import os
import ffmpeg
from datetime import datetime, timedelta
import logging

# Get the directory where the script is located
script_directory = os.path.dirname(os.path.abspath(__file__))

# Define the URL for the HLS stream
hls_url = "https://streaming.noc.nakhoncity.org/live/NSW06.m3u8"

# Create the "stream" directory if it doesn't exist
stream_directory = os.path.join(script_directory, "stream")

if not os.path.exists(stream_directory):
    os.makedirs(stream_directory)

# Set up logging
log_file = os.path.join(script_directory, "cron.log")
logging.basicConfig(filename=log_file, level=logging.DEBUG, format='%(asctime)s - %(levelname)s: %(message)s')

try:
    # Get the current Thai time
    thai_time = datetime.now()

    # Format the time as "HH.MM.SS" (hours.minutes.seconds)
    formatted_time = thai_time.strftime("%H.%M.%S")

    # Format the date as "YYYY-MM-DD" (year-month-day)
    formatted_date = thai_time.strftime("%Y-%m-%d")

    # Create the image filename with the camera name, date, and time
    image_filename = os.path.join(stream_directory, f"NSW06_{formatted_date}_{formatted_time}.png")

    # Use FFmpeg to capture a frame from the stream
    (
        ffmpeg
        .input(hls_url, ss=1)
        .output(image_filename, format='image2', vframes=1)
        .run()
    )

    print(f"Frame captured and saved as {image_filename}")
    logging.info(f"Frame captured and saved as {image_filename}")

    # Cleanup routine: Delete images older than 10 minutes
    cleanup_time_threshold = thai_time - timedelta(minutes=10)
    for file in os.listdir(stream_directory):
        file_path = os.path.join(stream_directory, file)
        if os.path.isfile(file_path) and os.path.getmtime(file_path) < cleanup_time_threshold.timestamp():
            os.remove(file_path)
            print(f"Deleted old image: {file_path}")
            logging.info(f"Deleted old image: {file_path}")

except Exception as e:
    print(f"Error capturing frame: {e}")
    logging.error(f"Error capturing frame: {e}")
