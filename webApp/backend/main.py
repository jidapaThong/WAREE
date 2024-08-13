#from fastapi import FastAPI
#import uvicorn
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

import waterLevel as water


app = FastAPI(title="REST API")
app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"]
)


@app.get('/waterLevel/latest')
async def getLatestWater():
    return water.getLastest()

@app.get('/waterLevel/all')
async def getAllWater():
    return water.getAll()

@app.get("/download/{cctvID}/{year}")
async def downloadData(cctvID,year):
    try:
        csv_file = water.download_bigquery_data(cctvID,year)
        headers = {
            "Content-Disposition": f"attachment; filename=waterLevelData_cctvID{cctvID}_year{year}.csv",
            "Content-Type": "text/csv",
        }
        return Response(content = csv_file, headers = headers)
    except Exception as e:
        print(f"Error in download endpoint: {e}")
        return Response(content="Internal Server Error", status_code=500)

