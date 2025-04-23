from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

inventory_router = APIRouter(tags=["Inventory API"])

class BaselineYearResponse(BaseModel):
    year: int

class InventoryFileResponse(BaseModel):
    file_path: str
    created_at: Optional[str] = None

@inventory_router.get("/inventory_baseline_years", response_model=List[dict])
def get_inventory_baseline_years():
    conn = connectDB()
    if not conn:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="無法連接到資料庫")
    
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT DISTINCT year FROM Inventory_Baseline ORDER BY year DESC")
        results = cursor.fetchall()
        
        years = [{"year": row[0]} for row in results if row[0]]
        return years
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"查詢發生錯誤: {e}")
    finally:
        conn.close()

@inventory_router.get("/inventory_file/{year}", response_model=InventoryFileResponse)
def get_inventory_file(year: int):
    conn = connectDB()
    if not conn:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="無法連接到資料庫")
    
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT file_path, created_at FROM Inventory_Baseline WHERE year = ?", (year,))
        inventory_result = cursor.fetchone()
        
        if not inventory_result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="找不到對應的清單資料")
        
        file_path, created_at = inventory_result
        
        # Convert datetime to string format
        created_at_str = created_at.strftime('%Y-%m-%d %H:%M:%S') if created_at else None
        
        return InventoryFileResponse(file_path=file_path, created_at=created_at_str)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"查詢發生錯誤: {e}")
    finally:
        conn.close()