from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

Power_Emission_Factor = APIRouter()

@Power_Emission_Factor.post("/Power_Emission_Factor")
def read_user_credentials():
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            query = "SELECT * FROM power_emission_factors"
            cursor.execute(query)
            
            user_records = cursor.fetchall()
            conn.close()

            if user_records:
                result = [
                    {
                        "year": record[0],
                        "emission_factor": record[1],
                        "updata_time": record[2].strftime("%Y-%m-%d %H:%M") if record[2] else None,
                    }
                    for record in user_records
                ]
                return {"Power_Emission_Factor": result}
            else:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No Power_Emission_Factor found for this user")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading user credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")