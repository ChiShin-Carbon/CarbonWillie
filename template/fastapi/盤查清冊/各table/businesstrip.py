from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

get_businesstrip = APIRouter(tags=["Inventory API"])

class BusinessTripData(BaseModel):
    transportation: int
    kilometers: float
    oil_species: int
    remark: Optional[str] = None

@get_businesstrip.get("/businesstrip_data_by_year/{year}", response_model=List[BusinessTripData])
def get_businesstrip_data_by_year(year: int):
    conn = connectDB()
    if not conn:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="無法連接到資料庫")
    
    cursor = conn.cursor()
    try:
        # 使用 YEAR 函數提取 edit_time 中的年份
        cursor.execute("""
            SELECT transportation, kilometers, oil_species, remark 
            FROM Business_Trip 
            WHERE YEAR(edit_time) = ? 
            ORDER BY edit_time DESC
        """, (year,))
        
        results = cursor.fetchall()
        
        if not results:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"找不到{year}年的商務旅行資料")
        
        businesstrip_data = []
        for row in results:
            transportation, kilometers, oil_species, remark = row
            
            businesstrip_data.append({
                "transportation": transportation,
                "kilometers": kilometers,
                "oil_species": oil_species,
                "remark": remark if remark else None
            })
        
        return [BusinessTripData(**item) for item in businesstrip_data]
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"查詢發生錯誤: {e}")
    finally:
        cursor.close()
        conn.close()