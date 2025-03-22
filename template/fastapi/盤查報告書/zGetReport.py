from fastapi import APIRouter, HTTPException, status, Depends
from connect.connect import connectDB
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

report_api = APIRouter(tags=["Report生成"])

class BaselineYearResponse(BaseModel):
    year: int

class ReportVersionResponse(BaseModel):
    version: int

class ReportFileResponse(BaseModel):
    file_path: str
    uploaded_at: Optional[str] = None
    username: Optional[str] = None
    department: Optional[int] = None

@report_api.get("/baseline_years", response_model=List[BaselineYearResponse])
def get_baseline_years():
    conn = connectDB()
    if not conn:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="無法連接到資料庫")
    
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT cfv_start_date FROM Baseline")
        results = cursor.fetchall()
        conn.close()
        
        years = [{"year": row[0].year} for row in results if row[0]]
        return years
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"查詢發生錯誤: {e}")

@report_api.get("/report_versions/{year}", response_model=List[ReportVersionResponse])
def get_report_versions(year: int):
    conn = connectDB()
    if not conn:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="無法連接到資料庫")
    
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT report_id FROM Report_Baseline WHERE year = ?", (year,))
        report_result = cursor.fetchone()
        
        if not report_result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="找不到對應的報告資料")
        
        report_id = report_result[0]
        cursor.execute("SELECT DISTINCT version FROM Report_Uploads WHERE report_id = ?", (report_id,))
        versions = [{"version": row[0]} for row in cursor.fetchall()]
        conn.close()
        return versions
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"查詢發生錯誤: {e}")

@report_api.get("/report_id/{year}", response_model=dict)
def get_report_id(year: int):
    conn = connectDB()
    if not conn:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="無法連接到資料庫")
    
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT report_id FROM Report_Baseline WHERE year = ?", (year,))
        report_result = cursor.fetchone()
        
        if not report_result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="找不到對應的報告資料")
        
        return {"report_id": report_result[0]}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"查詢發生錯誤: {e}")
    finally:
        conn.close()
