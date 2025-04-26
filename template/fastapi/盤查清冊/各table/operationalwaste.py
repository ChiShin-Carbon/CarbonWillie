from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

get_operational_waste = APIRouter(tags=["Inventory API"])

class OperationalWasteData(BaseModel):
    waste_item: str
    remark: Optional[str] = None

@get_operational_waste.get("/operational_waste_data_by_year/{year}", response_model=List[OperationalWasteData])
def get_operational_waste_data_by_year(year: int):
    conn = connectDB()
    if not conn:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="無法連接到資料庫")
    
    cursor = conn.cursor()
    try:
        # 使用 YEAR 函數提取 edit_time 中的年份
        cursor.execute("""
            SELECT waste_item, remark 
            FROM Operational_Waste 
            WHERE YEAR(edit_time) = ? 
            ORDER BY edit_time DESC
        """, (year,))
        
        results = cursor.fetchall()
        
        if not results:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"找不到{year}年的廢棄物資料")
        
        waste_data = []
        for row in results:
            waste_item, remark = row
            
            waste_data.append({
                "waste_item": waste_item,
                "remark": remark if remark else None
            })
        
        return [OperationalWasteData(**item) for item in waste_data]
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"查詢發生錯誤: {e}")
    finally:
        cursor.close()
        conn.close()