import numpy as np
import cv2 as cv
from skimage import feature
import json
import os
from google.cloud import bigquery
from datetime import datetime, timedelta
import re

imgRectify = None

service_account_key_file = "/root/image/cam2/key2.json"
json_file_path = "/root/image/cam2/newconfig.json"
directory_path = "/root/image/cam2/stream"

current_directory = os.path.dirname(os.path.realpath(__file__))
service_account_key_file = os.path.join(current_directory, "key2.json")
full_key_path = os.path.join(current_directory, "key2.json")
client = bigquery.Client.from_service_account_json(service_account_key_file)


def getImgPath(camera_name, camera_configs, directory_path):
    # Get the list of files in the folder
    files = os.listdir(directory_path)

    # Filter image files (you may need to adjust the filter criteria)
    image_files = [file for file in files if file.lower().endswith(('.png', '.jpg', '.jpeg'))]

    # Sort the files by modification time and get the latest one
    latest_image = max(image_files, key=lambda x: os.path.getmtime(os.path.join(directory_path, x)))

    # Return the full path to the latest image
    latest_image_path = os.path.join(directory_path, latest_image)
    print(f"Latest image path: {latest_image_path}")
    return latest_image_path


def persCorrect(inputImg):
    global imgRectify
    card_size = (130, 600)

    pts_src = np.array([(251, 74), (319, 80), (233, 444), (289, 446)], dtype=np.float32)

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


def extract_datetime_and_water_level(file_path, water_level_message):
    # Extract the filename from the path
    file_name = os.path.basename(file_path)

    # Use a more flexible regex pattern to capture the timestamp
    datetime_match = re.search(r'_(\d{4}-\d{2}-\d{2}_\d{2}\.\d{2}\.\d{2})\.png', file_name)

    if datetime_match:
        date_time_str = datetime_match.group(1)

        try:
            # Parse datetime using dateutil.parser
            date_time = datetime.strptime(date_time_str, "%Y-%m-%d_%H.%M.%S")
        except ValueError as ve:
            print(f"Error: {ve}")
            print(f"Contents of date_time_str: {date_time_str!r}")
            raise
    else:
        raise ValueError("Datetime not found in the file name.")

    # Use a more flexible regex pattern to capture the water level and zone
    water_level_match = re.search(r"'level': (\d+), 'zone': (\d+)", water_level_message)

    # Provide default values if the regex pattern doesn't match
    water_level = 0
    zone = 0

    if water_level_match:
        water_level = int(water_level_match.group(1))
        zone = int(water_level_match.group(2))
    else:
        print("Water level and zone not found in the message. Using default values.")

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


# Save water level data to database
def save_to_database(cctv_id, date_time, water_level, zone):
    # Check if the data already exists in the database
    check_query = f'SELECT * FROM depa-smartcity-thailand.water_lavel.waterLevelRecord WHERE cctvID = {cctv_id} AND dateTime = "{date_time}"'
    
    try:
        check_job = client.query(check_query)
        existing_rows = list(check_job.result())
        
        if existing_rows:
            # If a matching row exists, skip the insertion
            print("Data already exists. Skipped insertion.")
            return "Data already exists. Skipped insertion."
        
        # If the data does not exist, proceed with insertion
        update_query = f'INSERT INTO depa-smartcity-thailand.water_lavel.waterLevelRecord (cctvID, dateTime, waterLevel, zone) VALUES ({cctv_id}, "{date_time}", {water_level}, {zone});'
        
        # Execute the query
        update_job = client.query(update_query)
        update_job.result()

        # If the query execution is successful, print the inserted data
        inserted_data = {'cctvID': cctv_id, 'dateTime': date_time, 'waterLevel': water_level, 'zone': zone}
        print("Inserted data:", inserted_data)

        # If the query execution is successful, return a success message
        return "Inserted successfully!"

    except Exception as e:
        # If there is an error, return an error message
        print(f"Error: {e}")
        return f"Error! Cannot insert in the database. {str(e)}"


def main():
    # Read file
    with open('newconfig.json') as f:
        camera_configs = json.load(f)

    camera_name = "camera2"
    cctv_id = 2

    # Get the latest image path from the stream folder
    directory_path = '/root/image/cam2/stream'  # Replace with the actual path
    latest_image_path = getImgPath(camera_name, camera_configs, directory_path)

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
            ret = save_to_database(cctv_id, actual_date_time, waterLevel, zone)
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
            ret = save_to_database(cctv_id, temp_date_time, previousWaterLevel1, previousZone1)
            return ret,message
        else:
            if ((previousWaterLevel0 == previousWaterLevel1) and (previousWaterLevel1 == currentWaterLevel)):
                message = "Same water level"
                ret = save_to_database(cctv_id, temp_date_time, currentWaterLevel, zone)
                return ret,message
            elif (((previousWaterLevel0 < previousWaterLevel1) or (previousWaterLevel0 > previousWaterLevel1)) and (previousWaterLevel1 == currentWaterLevel)):
                message = "example: 122 or 211"
                ret = save_to_database(cctv_id, temp_date_time, currentWaterLevel, zone)
                return ret,message         
            elif (((previousWaterLevel0 < previousWaterLevel1) and (previousWaterLevel1 > currentWaterLevel) and (previousWaterLevel0 == currentWaterLevel)) or ((previousWaterLevel0 > previousWaterLevel1) and (previousWaterLevel1 < currentWaterLevel) and (previousWaterLevel0 == currentWaterLevel))):
                message = update_to_bigquery(cctv_id, previousdateTime1, previousWaterLevel0, previousZone0)
                ret = save_to_database(cctv_id, temp_date_time, currentWaterLevel, zone)
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
                    ret = save_to_database(cctv_id, temp_date_time, previousWaterLevel1, previousZone1)
                    return ret,message
                else:
                    message = "Insert actual water level"
                    ret = save_to_database(cctv_id, temp_date_time, currentWaterLevel, zone)
                    return ret,message

if __name__ == '__main__':
    result,message = main()
    print(message)
    print(result)
