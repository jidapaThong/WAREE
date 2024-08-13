import os
from google.cloud import bigquery

current_directory = os.getcwd()

service_account_key_file = os.path.join(current_directory, "key.json")
client = bigquery.Client.from_service_account_json(service_account_key_file)
job_config = bigquery.LoadJobConfig()
job_config.write_disposition = bigquery.WriteDisposition.WRITE_APPEND

def getLastest():
    query = f'SELECT t1.* FROM depa-smartcity-thailand.water_lavel.waterLevelRecord AS t1 JOIN (SELECT cctvID, MAX(dateTime) AS maxDateTime FROM depa-smartcity-thailand.water_lavel.waterLevelRecord GROUP BY cctvID) AS t2 ON t1.cctvID = t2.cctvID AND t1.dateTime = t2.maxDateTime;'
    results = client.query(query)
    data = []
    for result in results:
        data.append(dict(result))
    return data

def getrecords(cctv_id):
    query = f"SELECT * FROM depa-smartcity-thailand.water_lavel.waterLevelRecord WHERE cctvID = {cctv_id} ORDER BY dateTime DESC LIMIT 5;"
    query_job = client.query(query)
    row = []
    for result in query_job:
        row.append(dict(result))
    zone0 = row[4]["zone"]
    zone1 = row[3]["zone"]
    zone2 = row[2]["zone"]
    zone3 = row[1]["zone"]
    zone4 = row[0]["zone"]

    level0 = row[4]["waterLevel"]
    level1 = row[3]["waterLevel"]
    level2 = row[2]["waterLevel"]
    level3 = row[1]["waterLevel"]
    level4 = row[0]["waterLevel"]
    return zone0,zone1,zone2,zone3,zone4,level0,level1,level2,level3,level4

# Load previous water level zone from database
def load_previous_statuses():
    query = f'SELECT * FROM `depa-smartcity-thailand.water_lavel.zoneForNotify`;'
    query_job = client.query(query)
    data = []
    for result in query_job:
        data.append(dict(result))
    return data
 
# Save current zone to database
def save_previous_statuses(cctv_id, currentzone, currentlevel):
    update_query = f'UPDATE `depa-smartcity-thailand.water_lavel.zoneForNotify` SET zone = {currentzone}, waterLevel = {currentlevel} WHERE cctvID = {cctv_id};'
    update_job = client.query(update_query)
    update_job.result()
    if update_job.num_dml_affected_rows > 0:
        return "Water level Zone updated successfully!"
    else:
        return "Error! Cannot save current water level zone in the database."
