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

class BaselineCompletion(BaseModel):
    is_completed: bool

# 編輯基準年
@baseline.put("/baseline/{baseline_id}")
def update_baseline(baseline_id: int, baseline: Baseline):
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            query = """
                UPDATE Baseline
                SET cfv_start_date = ?, cfv_end_date = ?, edit_time = GETDATE()
                WHERE baseline_id = ?
            """
            cursor.execute(query, (baseline.cfv_start_date, baseline.cfv_end_date, baseline_id))
            conn.commit()
            conn.close()
            return {"message": "Baseline updated successfully"}
        
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating baseline: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")

# 新增基準年
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

# 顯示基準年
@baseline.get("/baseline")
def read_baseline():
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            query = "SELECT TOP 1 baseline_id, cfv_start_date, cfv_end_date, edit_time, is_completed FROM Baseline ORDER BY edit_time DESC"
            cursor.execute(query)
            baseline_record = cursor.fetchone()
            conn.close()

            if baseline_record:
                result = {
                    "baseline_id": baseline_record[0],
                    "cfv_start_date": baseline_record[1],
                    "cfv_end_date": baseline_record[2],
                    "edit_time": baseline_record[3],
                    "is_completed": baseline_record[4]
                }
                return {"baseline": result}  
            else:
                # Raise a 404 error if user not found
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Baseline not found")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading baseline credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")

# 更新基準年完成狀態
@baseline.put("/baseline/{baseline_id}/complete")
def update_baseline_completion(baseline_id: int, completion: BaselineCompletion):
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            query = """
                UPDATE Baseline
                SET is_completed = ?, edit_time = GETDATE()
                WHERE baseline_id = ?
            """
            cursor.execute(query, (completion.is_completed, baseline_id))
            conn.commit()
            conn.close()
            return {"message": "Baseline completion status updated successfully"}
        
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating baseline completion status: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")