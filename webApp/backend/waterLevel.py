import os
import requests
import json
#import pandas as pd
import csv
from io import StringIO
from datetime import datetime, timedelta
from google.cloud import bigquery
current_directory = os.getcwd()

service_account_key_file = os.path.join(current_directory, "databasekey.json")
client = bigquery.Client.from_service_account_json(service_account_key_file)
job_config = bigquery.LoadJobConfig()
job_config.write_disposition = bigquery.WriteDisposition.WRITE_APPEND

def getLastest():
    query = f'SELECT t1.* FROM depa-smartcity-thailand.water_lavel.waterLevelRecord AS t1 JOIN (SELECT cctvID, MAX(dateTime) AS maxDateTime FROM depa-smartcity-thailand.water_lavel.waterLevelRecord GROUP BY cctvID) AS t2 ON t1.cctvID = t2.cctvID AND t1.dateTime = t2.maxDateTime;'
    results = client.query(query)
    ret = []
    for result in results:
        ret.append(dict(result))
    return ret

def getAll():
    query = f'SELECT * FROM depa-smartcity-thailand.water_lavel.waterLevelRecord;'
    results = client.query(query)
    ret = []
    for result in results:
        ret.append(dict(result))
    return ret


def download_bigquery_data(cctvID,year):
    # # Initialize BigQuery client
    # client = bigquery.Client()
    query = f"""
        SELECT t1.cctvID,t2.cameraName_Eng,t1.dateTime,t1.waterLevel,t1.zone,
        FROM depa-smartcity-thailand.water_lavel.waterLevelRecord AS t1
        JOIN depa-smartcity-thailand.water_lavel.cctvCamera AS t2
        ON t1.cctvID = t2.id
        WHERE EXTRACT(YEAR FROM t1.dateTime) = {year} AND cctvID = {cctvID}
        ORDER BY t1.dateTime DESC;
    """
    data = client.query(query)
    csv_content = StringIO()
    fieldnames = ["cctvID","cameraName_Eng","dateTime","waterLevel","zone"]
    writer = csv.DictWriter(csv_content, fieldnames=fieldnames)
    writer.writeheader()
    for row in data:
        row = dict(row)
        writer.writerow(row)
    return csv_content.getvalue()