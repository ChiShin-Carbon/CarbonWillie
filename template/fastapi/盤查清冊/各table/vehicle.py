from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date

get_vehicle = APIRouter(tags=["Vehicle API"])

class VehicleData(BaseModel):
    doc_date: str
    oil_species: int
    liters: float
    remark: Optional[str] = None

@get_vehicle.get("/vehicle_data_by_year/{year}", response_model=List[VehicleData])
def get_vehicle_data_by_year(year: int):
    conn = connectDB()
    if not conn:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="無法連接到資料庫")
    
    cursor = conn.cursor()
    try:
        # 使用 LIKE 運算符搜索符合特定年份的記錄
        year_pattern = f"{year}-%"
        
        cursor.execute("""
            SELECT Doc_date, oil_species, liters, remark 
            FROM Vehicle 
            WHERE Doc_date LIKE ? 
            ORDER BY Doc_date DESC
        """, (year_pattern,))
        
        results = cursor.fetchall()
        
        if not results:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"找不到{year}年的車輛資料")
        
        vehicle_data = []
        for row in results:
            doc_date, oil_species, liters, remark = row
            
            # 確保日期轉換為字串
            if isinstance(doc_date, (datetime, date)):
                doc_date = doc_date.strftime('%Y-%m-%d')
            
            vehicle_data.append({
                "doc_date": doc_date,
                "oil_species": oil_species,
                "liters": liters,
                "remark": remark
            })
        
        # 先轉換成字典，再讓 FastAPI 處理轉換成 Pydantic 模型
        return [VehicleData(**item) for item in vehicle_data]
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"查詢發生錯誤: {e}")
    finally:
        conn.close()