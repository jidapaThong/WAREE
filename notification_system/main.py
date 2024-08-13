import requests
from dotenv import load_dotenv
import os
import database
from datetime import datetime
from statistics import mode

def send_line_notify(message, channel_access_token):
    line_notify_api = "https://notify-api.line.me/api/notify"
    headers = {"Authorization": f"Bearer {channel_access_token}"}
    payload = {"message": message}
    response = requests.post(line_notify_api, headers=headers, data=payload)
    
    if response.status_code == 200:
        return "Line Notify sent successfully!"
    else:
        return f"Error: Unable to send Line Notify. Status code: {response.status_code}"

def check_and_notify(channel_access_token):
    data = database.getLastest()
    if len(data) != 0:
        for entry in data:
            cctv_id = int(entry.get('cctvID'))
            zone0,zone1,zone2,zone3,zone4,level0,level1,level2,level3,level4 = database.getrecords(cctv_id)
            checkzone = [zone0,zone1,zone2,zone3,zone4]
            checklevel = [level0,level1,level2,level3,level4]
            currentzone = mode(checkzone)
            currentlevel = mode(checklevel)
            dateTime_str = str(entry.get('dateTime'))
            dateTime_obj = datetime.fromisoformat(dateTime_str)
            dateTime = dateTime_obj.strftime("%d-%m-%Y %H:%M:%S")

            if cctv_id == 1:
                cameraName = 'คลองท่าใหญ่'
            elif cctv_id == 2:
                cameraName = 'คลองหน้าเมือง'
            elif cctv_id == 3:
                cameraName = 'คลองเลียบทางรถไฟ (แยกหมอปาน)'
            else:
                ret = "Error! CCTV ID not found."
                continue
            
            load = database.load_previous_statuses()
            for entry in load:
                cctv_id_load = int(entry.get('cctvID'))
                zone_load = int(entry.get('zone'))
                waterLevel_load = int(entry.get('waterLevel'))
                if cctv_id == cctv_id_load:
                    if cctv_id == 1:
                        if waterLevel_load == 2 and currentlevel == 3:
                            message = "\nประกาศแจ้งเตือน เฝ้าระวังภาวะน้ำท่วมเฉียบพลัน!😥⚠️"+f"\nสถานที่ {cameraName}"+f"\nวันที่และเวลา {dateTime}"+"\nสถานะ เฝ้าระวัง 🟡"+f"\nระดับน้ำ {currentlevel}"+f"\nขณะนี้ระดับน้ำใน {cameraName} อยู่ในเกณฑ์เฝ้าระวัง"
                            sendStatus = send_line_notify(message, channel_access_token)
                            save = database.save_previous_statuses(cctv_id, currentzone, currentlevel)
                        elif waterLevel_load == 5 and currentlevel == 6:
                            message = "\nประกาศแจ้งเตือน ภาวะน้ำท่วมเฉียบพลัน!😱🌊"+f"\nสถานที่ {cameraName}"+f"\nวันที่และเวลา {dateTime}"+"\nสถานะ อันตราย 🔴"+f"\nระดับน้ำ {currentlevel}"+f"\nขณะนี้ระดับน้ำใน {cameraName} อยู่ในเกณฑ์วิกฤต"
                            sendStatus = send_line_notify(message, channel_access_token)
                            save = database.save_previous_statuses(cctv_id, currentzone, currentlevel)
                        elif waterLevel_load == 5 and currentlevel == 4:
                            message = "\nประกาศแจ้งเตือน สถานการณ์ภาวะน้ำท่วมได้กลับเข้าสู่ภาวะเฝ้าระวังแล้ว!⚠️"+f"\nสถานที่ {cameraName}"+f"\nวันที่และเวลา {dateTime}"+"\nสถานะ เฝ้าระวัง 🟡"+f"\nระดับน้ำ {currentlevel}"+f"\nขณะนี้ระดับน้ำใน {cameraName} ได้กลับเข้าสู่เกณฑ์เฝ้าระวัง"
                            sendStatus = send_line_notify(message, channel_access_token)
                            save = database.save_previous_statuses(cctv_id, currentzone, currentlevel)
                        else:
                            ret = "Successfully compiled"
                            save = database.save_previous_statuses(cctv_id, currentzone, currentlevel)
                    elif cctv_id == 2:
                        if waterLevel_load == 3 and currentlevel == 4:
                            message = "\nประกาศแจ้งเตือน เฝ้าระวังภาวะน้ำท่วมเฉียบพลัน!😥⚠️"+f"\nสถานที่ {cameraName}"+f"\nวันที่และเวลา {dateTime}"+"\nสถานะ เฝ้าระวัง 🟡"+f"\nระดับน้ำ {currentlevel}"+f"\nขณะนี้ระดับน้ำใน {cameraName} อยู่ในเกณฑ์เฝ้าระวัง"
                            sendStatus = send_line_notify(message, channel_access_token)
                            save = database.save_previous_statuses(cctv_id, currentzone, currentlevel)
                        elif waterLevel_load == 6 and currentlevel == 7:
                            message = "\nประกาศแจ้งเตือน ภาวะน้ำท่วมเฉียบพลัน!😱🌊"+f"\nสถานที่ {cameraName}"+f"\nวันที่และเวลา {dateTime}"+"\nสถานะ อันตราย 🔴"+f"\nระดับน้ำ {currentlevel}"+f"\nขณะนี้ระดับน้ำใน {cameraName} อยู่ในเกณฑ์วิกฤต"
                            sendStatus = send_line_notify(message, channel_access_token)
                            save = database.save_previous_statuses(cctv_id, currentzone, currentlevel)
                        elif waterLevel_load == 6 and currentlevel == 5:
                            message = "\nประกาศแจ้งเตือน สถานการณ์ภาวะน้ำท่วมได้กลับเข้าสู่ภาวะเฝ้าระวังแล้ว!⚠️"+f"\nสถานที่ {cameraName}"+f"\nวันที่และเวลา {dateTime}"+"\nสถานะ เฝ้าระวัง 🟡"+f"\nระดับน้ำ {currentlevel}"+f"\nขณะนี้ระดับน้ำใน {cameraName} ได้กลับเข้าสู่เกณฑ์เฝ้าระวัง"
                            sendStatus = send_line_notify(message, channel_access_token)
                            save = database.save_previous_statuses(cctv_id, currentzone, currentlevel)
                        else:
                            ret = "Successfully compiled"
                            save = database.save_previous_statuses(cctv_id, currentzone, currentlevel)
                    elif cctv_id == 3:
                        if currentzone == 1 and zone_load == 0:
                            message = "\nประกาศแจ้งเตือน เฝ้าระวังภาวะน้ำท่วมเฉียบพลัน!😥⚠️"+f"\nสถานที่ {cameraName}"+f"\nวันที่และเวลา {dateTime}"+"\nสถานะ เฝ้าระวัง 🟡"+f"\nระดับน้ำ {currentlevel}"+f"\nขณะนี้ระดับน้ำใน {cameraName} อยู่ในเกณฑ์เฝ้าระวัง"
                            sendStatus = send_line_notify(message, channel_access_token)
                            save = database.save_previous_statuses(cctv_id, currentzone, currentlevel)
                        elif currentzone == 2 and zone_load == 1:
                            message = "\nประกาศแจ้งเตือน ภาวะน้ำท่วมเฉียบพลัน!😱🌊"+f"\nสถานที่ {cameraName}"+f"\nวันที่และเวลา {dateTime}"+"\nสถานะ อันตราย 🔴"+f"\nระดับน้ำ {currentlevel}"+f"\nขณะนี้ระดับน้ำใน {cameraName} อยู่ในเกณฑ์วิกฤต"
                            sendStatus = send_line_notify(message, channel_access_token)
                            save = database.save_previous_statuses(cctv_id, currentzone, currentlevel)
                        elif currentzone == 1 and zone_load == 2:
                            message = "\nประกาศแจ้งเตือน สถานการณ์ภาวะน้ำท่วมได้กลับเข้าสู่ภาวะเฝ้าระวังแล้ว!⚠️"+f"\nสถานที่ {cameraName}"+f"\nวันที่และเวลา {dateTime}"+"\nสถานะ เฝ้าระวัง 🟡"+f"\nระดับน้ำ {currentlevel}"+f"\nขณะนี้ระดับน้ำใน {cameraName} ได้กลับเข้าสู่เกณฑ์เฝ้าระวัง"
                            sendStatus = send_line_notify(message, channel_access_token)
                            save = database.save_previous_statuses(cctv_id, currentzone, currentlevel)
                        else:
                            ret = "Successfully compiled"
                            save = database.save_previous_statuses(cctv_id, currentzone, currentlevel)
                    else:
                        ret = "CCTV doesn't match! Cannot find CCTV!"
                        save = database.save_previous_statuses(cctv_id, currentzone, currentlevel)
    else:
        ret = "Error! Unable to get data."
    return ret

def main(request):
    load_dotenv()
    channel_access_token = os.getenv("channelAccessToken")
    ret = check_and_notify(channel_access_token)
    return ret

if __name__ == "__main__":
    main("")