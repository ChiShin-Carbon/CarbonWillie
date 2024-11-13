from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware


baseline = APIRouter()

class Baseline(BaseModel):
    user_id: int
    cfv_start_date: datetime
    cfv_end_date: datetime

@baseline.post("/baseline")
def create_baseline(baseline: Baseline):
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            query = """
                INSERT INTO Baseline (user_id, cfv_start_date, cfv_end_date, edit_time)
                VALUES (?, ?, ?, GETDATE())
            """
            cursor.execute(query, (baseline.user_id, baseline.cfv_start_date, baseline.cfv_end_date))
            conn.commit()
            conn.close()
            return {"message": "Baseline created successfully"}
        
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error creating baseline: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")

@baseline.get("/baseline")
def read_baseline():
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            query = "SELECT TOP 1 cfv_start_date, cfv_end_date, edit_time FROM Baseline ORDER BY edit_time DESC"
            cursor.execute(query)
            baseline_record = cursor.fetchone()
            conn.close()

            if baseline_record:
                result = {
                    "cfv_start_date": baseline_record[0],
                    "cfv_end_date": baseline_record[1],
                    "edit_time": baseline_record[2]
                }
                return {"baseline": result}  
            else:
                # Raise a 404 error if user not found
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Baseline not found")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading baseline credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
