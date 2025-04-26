from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

get_commute = APIRouter(tags=["Inventory API"])

class CommuteData(BaseModel):
    transportation: int
    kilometers: float
    oil_species: int
    remark: Optional[str] = None

@get_commute.get("/commute_data_by_year/{year}", response_model=List[CommuteData])
def get_commute_data_by_year(year: int):
    conn = connectDB()
    if not conn:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="無法連接到資料庫")
    
    cursor = conn.cursor()
    try:
        # 使用 YEAR 函數提取 edit_time 中的年份
        cursor.execute("""
            SELECT transportation, kilometers, oil_species, remark 
            FROM Commute 
            WHERE YEAR(edit_time) = ? 
            ORDER BY edit_time DESC
        """, (year,))
        
        results = cursor.fetchall()
        
        if not results:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"找不到{year}年的通勤資料")
        
        commute_data = []
        for row in results:
            transportation, kilometers, oil_species, remark = row
            
            commute_data.append({
                "transportation": transportation,
                "kilometers": kilometers,
                "oil_species": oil_species,
                "remark": remark if remark else None
            })
        
        return [CommuteData(**item) for item in commute_data]
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"查詢發生錯誤: {e}")
    finally:
        cursor.close()
        conn.close()