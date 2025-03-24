from fastapi import APIRouter, HTTPException, status, Depends
from connect.connect import connectDB
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

report_router = APIRouter(tags=["Report API"])

class BaselineYearResponse(BaseModel):
    year: int

class ReportVersionResponse(BaseModel):
    version: int

class ReportFileResponse(BaseModel):
    file_path: str
    uploaded_at: Optional[str] = None
    username: Optional[str] = None
    department: Optional[int] = None

@report_router.get("/baseline_years", response_model=List[dict])
def get_baseline_years():
    conn = connectDB()
    if not conn:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="無法連接到資料庫")
    
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT DISTINCT year FROM Report_Baseline ORDER BY year DESC")
        results = cursor.fetchall()
        
        years = [{"year": row[0]} for row in results if row[0]]
        return years
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"查詢發生錯誤: {e}")
    finally:
        conn.close()

@report_router.get("/report_versions/{year}", response_model=List[ReportVersionResponse])
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

@report_router.get("/report_file/{year}/{version}", response_model=ReportFileResponse)
def get_report_file(year: int, version: int):
    conn = connectDB()
    if not conn:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="無法連接到資料庫")
    
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT report_id, file_path, created_at FROM Report_Baseline WHERE year = ?", (year,))
        report_result = cursor.fetchone()
        
        if not report_result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="找不到對應的報告資料")
        
        report_id, file_path, created_at = report_result
        
        # Convert datetime to string format
        created_at_str = created_at.strftime('%Y-%m-%d %H:%M:%S') if created_at else None
        
        if version == 0:
            return ReportFileResponse(file_path=file_path, uploaded_at=created_at_str)
        
        cursor.execute("SELECT user_id, file_path, uploaded_at FROM Report_Uploads WHERE report_id = ? AND version = ?", (report_id, version))
        upload_result = cursor.fetchone()
        
        if not upload_result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="找不到對應的上傳版本")
        
        user_id, file_path, uploaded_at = upload_result
        
        # Convert datetime to string format
        uploaded_at_str = uploaded_at.strftime('%Y-%m-%d %H:%M:%S') if uploaded_at else None
        
        cursor.execute("SELECT username, department FROM users WHERE user_id = ?", (user_id,))
        user_result = cursor.fetchone()
        
        if not user_result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="找不到對應的使用者資訊")
        
        username, department = user_result
        return ReportFileResponse(file_path=file_path, uploaded_at=uploaded_at_str, username=username, department=department)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"查詢發生錯誤: {e}")
    finally:
        conn.close()