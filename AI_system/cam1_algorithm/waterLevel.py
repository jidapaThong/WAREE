import os
from google.cloud import bigquery
from datetime import datetime, timedelta
import json
import cv2
import numpy as np
from PIL import Image, ImageDraw
from skimage import feature
from scipy.ndimage import gaussian_filter
from pathlib import Path
import logging
import re

current_directory = os.getcwd()
# print("Current working directory:", os.getcwd())


# Path to Google Cloud service account key file
service_account_key_file = "/root/image/cam1/key1.json"
json_file_path = "/root/image/cam1/newconfig.json"
directory_path = "/root/image/cam1/stream"

# Set the working directory to the script's directory
script_directory = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_directory)

service_account_key_file = os.path.join(current_directory, "key1.json")
full_key_path = os.path.join(current_directory, "key1.json")
job_config = bigquery.LoadJobConfig()
job_config.write_disposition = bigquery.WriteDisposition.WRITE_APPEND

# logging.basicConfig(filename='waterLevel.log', level=logging.INFO)
# logging.info("Script started.")

# Global variable for the client
client = bigquery.Client.from_service_account_json(service_account_key_file)

# Initialize rows to None in the global scope
rows = None

def get_latest_picture(file_path):
    path = Path(file_path)
    if not path.is_dir():
        print("Invalid directory path.")
        return None

    files = [f for f in path.iterdir() if f.is_file()]

    if not files:
        print("No files found in the directory.")
        return None

    # Use a more flexible regex pattern to capture the timestamp
    file_names = [os.path.basename(file) for file in files]
    date_time_matches = [re.search(r'_(\d{4}-\d{2}-\d{2}_\d{2}\.\d{2}\.\d{2})\.', file_name) for file_name in file_names]

    # Filter out files without a matching timestamp
    valid_matches = [match.group(1) for match in date_time_matches if match]

    if not valid_matches:
        print("No valid timestamps found in the filenames.")
        return None

    # Get the latest timestamp
    latest_timestamp = max(valid_matches)

    # Construct the latest picture path
    latest_picture = next((file for file in files if latest_timestamp in file.name), None)

    if latest_picture:
        return str(latest_picture)
    else:
        print("Failed to retrieve the latest picture.")
        return None

def update_json_file(json_file_path, new_image_path):
    with open(json_file_path, 'r') as json_file:
        data = json.load(json_file)

    data["camera1"]["image_path"] = new_image_path

    with open(json_file_path, 'w') as json_file:
        json.dump(data, json_file, indent=2)

def loadImg(path):
    try:
        img = cv2.imread(path)
        return img
    except Exception as e:
        print(f"Error loading image: {e}")
        print(f"Error: {e}")
        return None

def cropImg(img, boundingBox):
    x, y, w, h = boundingBox
    cropped_img = img[y:y+h, x:x+w]
    return cropped_img

def edgeDetect(input_img, sigma=1.5):
    input_img = cv2.cvtColor(input_img, cv2.COLOR_BGR2GRAY)
    img_blurred = gaussian_filter(input_img, sigma=sigma)
    edges = feature.canny(img_blurred)
    return edges

def findIntersectedLines(vertical_line_y, horizontal_line_positions, tolerance=5):
    intersected_lines = []
    for i, line_y in enumerate(horizontal_line_positions):
        if abs(line_y - vertical_line_y) <= tolerance:
            intersected_lines.append(i)
    return intersected_lines

def drawVertical(image):
    center_x = image.shape[1] // 2
    for y in range(image.shape[0]):
        if image[y, center_x] > 0:
            return y
    return -1

def rotate(image, angle):
    center = tuple(np.array(image.shape[1::-1]) / 2)
    rot_mat = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotatedImage = cv2.warpAffine(image, rot_mat, image.shape[1::-1], flags=cv2.INTER_LINEAR)
    return rotatedImage

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

    # Check if the data already exists in the database
    check_query = f'SELECT * FROM {table_id} WHERE cctvID = {cctv_id} AND dateTime = TIMESTAMP("{date_time}")'

    try:
        check_job = client.query(check_query)
        existing_rows = list(check_job.result())

        if existing_rows:
            # If a matching row exists, return a message indicating duplicate data
            return f"Duplicate data! (cctvID={cctv_id}, dateTime={date_time}, waterLevel={water_level}, zone={zone})"

        # If the data does not exist, proceed with insertion
        rows_to_insert = [(cctv_id, date_time, water_level, zone)]

        try:
            # Execute the query
            update_job = client.insert_rows(client.get_table(table_id), rows_to_insert)

            # If the query execution is successful, return a success message with details
            return f"Inserted successfully! (cctvID={cctv_id}, dateTime={date_time}, waterLevel={water_level}, zone={zone})"

        except Exception as e:
            # If there is an error, return an error message
            return f"Error! Cannot insert in the database. {str(e)}"

    except Exception as e:
        # Handle the check query execution error
        return f"Error checking duplicate data. {str(e)}"
          

def main(camera_name, cameraConfig):
    global client
    global rows 
    cctv_id = None

    if camera_name == "camera1":
        cctv_id = 1
    elif camera_name == "camera2":
        cctv_id = 2
    elif camera_name == "camera3":
        cctv_id = 3
    else:
        print(f"Unknown camera name: {camera_name}")
        return

    print(f"Processing camera: {camera_name}")

    # Specify the directory path where the latest pictures are located
    directory_path = r"/root/image/cam1/stream"
    latest_picture_path = get_latest_picture(directory_path)

    # Print the latest image path for debugging
    print(f"Latest image path: {latest_picture_path}")

    # Extract timestamp from the latest image path using regex
    datetime_match = re.search(r'_(\d{4}-\d{2}-\d{2}_\d{2}\.\d{2}\.\d{2})\.png', latest_picture_path)
    
    if datetime_match:
        date_time_str = datetime_match.group(1)

        try:
            # Parse datetime using dateutil.parser
            temp_date_time = datetime.strptime(date_time_str, "%Y-%m-%d_%H.%M.%S")
        except ValueError as ve:
            print(f"Error: {ve}")
            print(f"Contents of date_time_str: {date_time_str!r}")
            raise

    # Get the zone information from cameraConfig
    zone_levels = {level['level']: level['zone'] for level in cameraConfig['water_levels']}

    originalImg = loadImg(latest_picture_path)
    
    if originalImg is None:
        return "Error loading image", None

    rotatedImage = rotate(originalImg, angle=-5)

    # box = (278, 204, 105, 275)
    box = (222, 95, 180, 400)
    cropped = cropImg(rotatedImage, box)
    edgeOutput = edgeDetect(cropped, sigma=1.5)
    edgeOutput = (edgeOutput * 255).astype(np.uint8)

    verticalLineY = drawVertical(edgeOutput)
    cv2.line(edgeOutput, (0, verticalLineY), (edgeOutput.shape[1], verticalLineY), (0, 255, 0), 1)

    intersectedIndices = findIntersectedLines(verticalLineY, cameraConfig["line_positions"])

    if not intersectedIndices:
        print("Vertical line does not intersect with any horizontal lines.")
        print("")
        print("Inserted the previous data automatically!")

        # If no intersected lines, fetch the latest data from the database
        query = f"SELECT * FROM depa-smartcity-thailand.water_lavel.waterLevelRecord WHERE cctvID = {cctv_id} ORDER BY dateTime DESC LIMIT 1"
        query_job = client.query(query)

        # Fetch the result
        rows = query_job.result()

        # Check if there is any result
        if rows:
            # Get the latest row
            latest_row = list(rows)[0]

            # Update the values
            waterLevel = latest_row["waterLevel"]
            zone = latest_row.get("zone")  # Use .get() to handle missing keys

            # Print the values being inserted
            # print(f"Inserting latest data: cctvID={cctv_id}, dateTime={date_time}, waterLevel={waterLevel}, status={status}")

            # Insert latest data into the database
            message = "Vertical line does not intersect with any horizontal lines."
            ret = save_to_bigquery(cctv_id, temp_date_time, waterLevel, zone)
            return ret, message
        else:
            print("No data found in the database.")
            return "No data found in the database.", None

    else:
        minIndex = min(intersectedIndices)
        lineY = cameraConfig["line_positions"][minIndex]
        currentWaterLevel = cameraConfig['water_levels'][minIndex]['level']

        # Extract date and time from the latest image path using regex
        datetime_match = re.search(r'_(\d{4}-\d{2}-\d{2}_\d{2}\.\d{2}\.\d{2})\.png', latest_picture_path)

        if datetime_match:
            date_time_str = datetime_match.group(1)

            try:
                # Parse datetime using dateutil.parser
                temp_date_time = datetime.strptime(date_time_str, "%Y-%m-%d_%H.%M.%S")
            except ValueError as ve:
                print(f"Error: {ve}")
                print(f"Contents of date_time_str: {date_time_str!r}")
                raise

        # Assign the zone based on the currentWaterLevel
        zone = zone_levels.get(currentWaterLevel, None)

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
            return ret, message
        else:
            if ((previousWaterLevel0 == previousWaterLevel1) and (previousWaterLevel1 == currentWaterLevel)):
                message = "Same water level"
                ret = save_to_bigquery(cctv_id, temp_date_time, currentWaterLevel, zone)
                return ret, message
            elif (((previousWaterLevel0 < previousWaterLevel1) or (previousWaterLevel0 > previousWaterLevel1)) and (previousWaterLevel1 == currentWaterLevel)):
                message = "example: 122 or 211"
                ret = save_to_bigquery(cctv_id, temp_date_time, currentWaterLevel, zone)
                return ret, message         
            elif (((previousWaterLevel0 < previousWaterLevel1) and (previousWaterLevel1 > currentWaterLevel) and (previousWaterLevel0 == currentWaterLevel)) or ((previousWaterLevel0 > previousWaterLevel1) and (previousWaterLevel1 < currentWaterLevel) and (previousWaterLevel0 == currentWaterLevel))):
                message = update_to_bigquery(cctv_id, previousdateTime1, previousWaterLevel0, previousZone0)
                ret = save_to_bigquery(cctv_id, temp_date_time, currentWaterLevel, zone)
                return ret, message
            elif ((previousWaterLevel0 == previousWaterLevel1) and ((previousWaterLevel1 < currentWaterLevel) or (previousWaterLevel1 > currentWaterLevel))):
                query2 = f"SELECT * FROM depa-smartcity-thailand.water_lavel.waterLevelRecord WHERE cctvID = {cctv_id} ORDER BY dateTime DESC LIMIT 3;"
                query_job2 = client.query(query2)
                row2 = []
                for res in query_job2:
                    row2.append(dict(res))

                waterLevel0 = row2[2]['waterLevel']
                if ((currentWaterLevel - waterLevel0 > 1) or (currentWaterLevel - waterLevel0 < -1)):
                    message = "Insert latest water level"
                    ret = save_to_bigquery(cctv_id, temp_date_time, previousWaterLevel1, previousZone1)
                    return ret, message
                else:
                    message = "Insert actual water level"
                    ret = save_to_bigquery(cctv_id, temp_date_time, currentWaterLevel, zone)
                    return ret, message

if __name__ == "__main__":
    with open('newconfig.json') as f:
        camera_configs = json.load(f)

    for camera_name, cameraConfig in camera_configs.items():
        if camera_name == "camera1":
            result, message = main(camera_name, cameraConfig)
            print(message)
            print(result)
