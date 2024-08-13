import os
import json
import numpy as np
import cv2 as cv
from skimage import feature
from datetime import datetime
import re
from google.cloud import bigquery

# Set the path to service account key file
service_account_key_file = "/root/image/cam3/key3.json"

# Set the environment variable with the path to the service account key file
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = service_account_key_file

# Global variable for the client
client = bigquery.Client()

imgRectify = None

def persCorrect(inputImg):
    global imgRectify
    card_size = (130, 600)

    pts_src = np.array([(248, 145), (295, 169), (252, 328), (297, 363)], dtype=np.float32)

    pts_dst = np.array([[0, 0], [card_size[0], 0], [0, card_size[1]], [card_size[0], card_size[1]]], dtype=np.float32)

    H, _ = cv.findHomography(pts_src, pts_dst)
    imgRectify = cv.warpPerspective(inputImg, H, card_size)

    return imgRectify

def edgeCanny(input_image):
    img_gray = cv.cvtColor(input_image, cv.COLOR_BGR2GRAY)
    edges = feature.canny(np.array(img_gray))

    return edges

def drawVertical(image):
    center_x = image.shape[1] // 2
    bottom_y = image.shape[0] - 1

    for y in range(bottom_y, 0, -1):
        if np.any(image[y, center_x]):
            print(f"Vertical line intersects edge at y-coordinate: {y}")
            return y

    # If the loop completes without finding a non-zero pixel
    print("Vertical line did not intersect with any edges.")
    return -1

def findCross(verLineY, horiLinePositions, tolerance=5):
    crossLines = []

    for i, lineY in enumerate(horiLinePositions):
        if abs(lineY - verLineY) <= tolerance:
            crossLines.append(i)

    return crossLines

def getLatestImagePath(folder_path):
    # Get the list of files in the folder
    files = os.listdir(folder_path)
    
    # Filter image files (you may need to adjust the filter criteria)
    image_files = [file for file in files if file.lower().endswith(('.png', '.jpg', '.jpeg'))]
    
    # Sort the files by modification time and get the latest one
    latest_image = max(image_files, key=lambda x: os.path.getmtime(os.path.join(folder_path, x)))

    # Return the full path to the latest image
    latest_image_path = os.path.join(folder_path, latest_image)
    print(f"Latest image path: {latest_image_path}")
    return latest_image_path

def extract_datetime_and_water_level(file_path, water_level_message):
    datetime_match = re.search(r'_(\d{4}-\d{2}-\d{2}_\d{2}\.\d{2}\.\d{2})\.png', file_path)
    if datetime_match:
        date_time_str = datetime_match.group(1)
        date_time = datetime.strptime(date_time_str, "%Y-%m-%d_%H.%M.%S")
    else:
        raise ValueError("Datetime not found in the file name.")

    water_level_match = re.search(r"level': (\d+), 'zone': (\d+)", water_level_message)
    print(f"Water level message: {water_level_message}")
    if water_level_match:
        water_level = int(water_level_match.group(1))
        zone = int(water_level_match.group(2))
    else:
        raise ValueError("Water level and zone not found in the message.")

    return date_time, water_level, zone

def update_to_bigquery(cctv_id, temp_date_time, updateWaterLevel, updateZone):
    query = f"UPDATE depa-smartcity-thailand.water_lavel.waterLevelRecord SET waterLevel = {updateWaterLevel}, zone = {updateZone} WHERE cctvID = {cctv_id} AND dateTime = '{temp_date_time}';"
    query_job = client.query(query)
    query_job.result()
    # Check if the query was successful
    if query_job.state == "DONE":
        return "Update successfully"
    else:
        return "Update unsuccessfully"


def save_to_bigquery(cctv_id, date_time, water_level, zone):
    table_id = "depa-smartcity-thailand.water_lavel.waterLevelRecord"
    table = client.get_table(table_id)

    # Print or log the data before inserting
    print(f"Inserted data - cctvID: {cctv_id}, dateTime: {date_time}, waterLevel: {water_level}, zone: {zone}")

    # Check if a row with the same cctvID and dateTime already exists
    query = f"SELECT COUNT(*) FROM {table_id} WHERE cctvID={cctv_id} AND dateTime='{date_time}'"
    query_job = client.query(query)
    result = query_job.result()

    # Iterate over the rows in the result
    for row in result:
        if row[0] == 0:
            # If no matching rows found, insert the data
            rows_to_insert = [(cctv_id, date_time, water_level, zone)]

            try:
                # Execute the query
                update_job = client.insert_rows(table, rows_to_insert)

                # If the query execution is successful, return a success message
                return "Inserted successfully!"

            except Exception as e:
                # If there is an error, return an error message
                return f"Error! Cannot insert in the database. {str(e)}"
        else:
            # If a matching row exists, skip the insertion
            return "Data already exists. Skipped insertion."

    # If the loop completes without returning, handle the case where the result has no rows
    if result.total_rows == 0:
        # Insert the data if there are no rows
        rows_to_insert = [(cctv_id, date_time, water_level, zone)]

        try:
            # Execute the query
            update_job = client.insert_rows(table, rows_to_insert)

            # If the query execution is successful, return the inserted data
            return {"cctvID": cctv_id, "dateTime": date_time, "waterLevel": water_level, "zone": zone}

        except Exception as e:
            # If there is an error, return an error message
            return f"Error! Cannot insert in the database. {str(e)}"

def main():
    global camera_configs
    previous_water_level_info = None

    camera_name = "camera3"
    cctv_id = 3

    # Get the latest image path from the stream folder
    directory_path = '/root/image/cam3/stream'
    latest_image_path = getLatestImagePath(directory_path)

    # Load camera configurations from the JSON file
    json_file_path = 'newconfig.json'
    with open(json_file_path) as f:
        camera_configs = json.load(f)

    # Update the image path in the configuration
    camera_configs[camera_name]['image_path'] = latest_image_path

    img = cv.imread(latest_image_path)
    assert img is not None, 'Cannot read the given image, ' + latest_image_path

    imgRectify = persCorrect(img)

    edges = edgeCanny(imgRectify)

    vertical_line_y = drawVertical(edges)

    # Compare with the least y-coordinate defined in the JSON file
    least_y_coordinate = min(camera_configs[camera_name]['line_positions'])
    if vertical_line_y < least_y_coordinate:
        # If less than, use the least y-coordinate
        vertical_line_y = least_y_coordinate
        print(f"Using the least y-coordinate: {least_y_coordinate}")

    intersected_lines = findCross(vertical_line_y, camera_configs[camera_name]['line_positions'])
     # Check if waterline is detected
    if not intersected_lines:
        print("Vertical line does not intersect with any horizontal lines.")
        print("")
        print("Inserted the previous data automatically!")

        water_level_info = camera_configs[camera_name]['water_levels'][camera_configs[camera_name]['line_positions'].index(max(camera_configs[camera_name]['line_positions']))]

        # Extract datetime, water level, and zone information
        actual_date_time, actual_water_level, actual_zone = extract_datetime_and_water_level(latest_image_path, str(water_level_info))
       
        # If no intersected lines, fetch the latest data from the database
        query = f"SELECT * FROM depa-smartcity-thailand.water_lavel.waterLevelRecord WHERE cctvID = {cctv_id} ORDER BY dateTime DESC LIMIT 1;"
        query_job = client.query(query)

        # Fetch the result
        rows = query_job.result()

        # Check if there is any result
        if rows:
            # Get the latest row
            latest_row = list(rows)[0]
            waterLevel = latest_row["waterLevel"]
            zone = latest_row.get("zone")  

            # Insert latest data into the database
            message = "Vertical line does not intersect with any horizontal lines."
            ret = save_to_bigquery(cctv_id, actual_date_time, waterLevel, zone)
            return ret,message
        else:
            print("No data found in the database.")
            return "No data found in the database."
    else:
        max_index = max(intersected_lines)
        line_y = camera_configs[camera_name]['line_positions'][max_index]
        water_level_current = camera_configs[camera_name]['water_levels'][max_index]

        # Extract relevant information from the latest image path and water level result
        temp_date_time, currentWaterLevel, zone = extract_datetime_and_water_level(latest_image_path, str(water_level_current))
        
        query = f"SELECT * FROM depa-smartcity-thailand.water_lavel.waterLevelRecord WHERE cctvID = {cctv_id} ORDER BY dateTime DESC LIMIT 2;"
        query_job = client.query(query)
        row = []
        for result in query_job:
            row.append(dict(result))

        previousWaterLevel1 = row[0]['waterLevel']
        previousZone1 = row[0]['zone']
        previousdateTime1 = row[0]['dateTime']

        previousWaterLevel0 = row[1]['waterLevel']
        previousZone0 = row[1]["zone"]

        if ((currentWaterLevel - previousWaterLevel1 > 1) or (currentWaterLevel - previousWaterLevel1 < -1)):
            message = "Out of range +1/-1"
            ret = save_to_bigquery(cctv_id, temp_date_time, previousWaterLevel1, previousZone1)
            return ret,message
        else:
            if ((previousWaterLevel0 == previousWaterLevel1) and (previousWaterLevel1 == currentWaterLevel)):
                message = "Same water level"
                ret = save_to_bigquery(cctv_id, temp_date_time, currentWaterLevel, zone)
                return ret,message
            elif (((previousWaterLevel0 < previousWaterLevel1) or (previousWaterLevel0 > previousWaterLevel1)) and (previousWaterLevel1 == currentWaterLevel)):
                message = "example: 122 or 211"
                ret = save_to_bigquery(cctv_id, temp_date_time, currentWaterLevel, zone)
                return ret,message         
            elif (((previousWaterLevel0 < previousWaterLevel1) and (previousWaterLevel1 > currentWaterLevel) and (previousWaterLevel0 == currentWaterLevel)) or ((previousWaterLevel0 > previousWaterLevel1) and (previousWaterLevel1 < currentWaterLevel) and (previousWaterLevel0 == currentWaterLevel))):
                message = update_to_bigquery(cctv_id, previousdateTime1, previousWaterLevel0, previousZone0)
                ret = save_to_bigquery(cctv_id, temp_date_time, currentWaterLevel, zone)
                return ret,message
            elif ((previousWaterLevel0 == previousWaterLevel1) and ((previousWaterLevel1 < currentWaterLevel) or (previousWaterLevel1 > currentWaterLevel))):
                query2 = f"SELECT * FROM depa-smartcity-thailand.water_lavel.waterLevelRecord WHERE cctvID = {cctv_id} ORDER BY dateTime DESC LIMIT 3;"
                query_job2 = client.query(query2)
                row2 = []
                for res in query_job2:
                    row2.append(dict(res))

                # waterLevel2 = row[0]['waterLevel']
                # waterLevel1 = row[1]['waterLevel']
                waterLevel0 = row2[2]['waterLevel']
                if ((currentWaterLevel - waterLevel0 > 1) or (currentWaterLevel - waterLevel0 < -1)):
                    message = "Insert latest water level"
                    ret = save_to_bigquery(cctv_id, temp_date_time, previousWaterLevel1, previousZone1)
                    return ret,message
                else:
                    message = "Insert actual water level"
                    ret = save_to_bigquery(cctv_id, temp_date_time, currentWaterLevel, zone)
                    return ret,message

if __name__ == '__main__':
    result,message = main()
    print(message)
    print(result)
