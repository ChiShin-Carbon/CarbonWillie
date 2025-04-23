from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from typing import List, Optional

# 原本的 inventory_router
get_vehicle = APIRouter(tags=["Inventory API"])

# 新增 Vehicle 回傳格式
class VehicleDataResponse(BaseModel):
    doc_date: str
    oil_species: str
    liters: float
    remark: Optional[str] = None
@get_vehicle.get("/vehicles_by_year/{year}", response_model=List[VehicleDataResponse])
def get_vehicles_by_year(year: int):
    conn = connectDB()
    if not conn:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="無法連接到資料庫")
    
    cursor = conn.cursor()
    try:
        # 用 SQL Server 的 YEAR() 函數來過濾年份
        query = """
            SELECT Doc_date, oil_species, liters, remark
            FROM Vehicle
            WHERE YEAR(Doc_date) = ?
        """
        cursor.execute(query, (year,))
        results = cursor.fetchall()

        vehicles = []
        for row in results:
            vehicles.append({
                "doc_date": row[0],
                "oil_species": row[1],
                "liters": row[2],
                "remark": row[3]
            })

        return vehicles
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"查詢發生錯誤: {e}")
    finally:
        conn.close()
