from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from typing import List, Optional

get_fire_extinguisher = APIRouter(tags=["Inventory API"])

class FireExtinguisherData(BaseModel):
    item_name: str
    ingredient: int
    specification: float
    remark: Optional[str] = None

@get_fire_extinguisher.get("/fire_extinguisher_data", response_model=List[FireExtinguisherData])
def get_fire_extinguisher_data():
    conn = connectDB()
    if not conn:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="無法連接到資料庫")
    
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT item_name, ingredient, specification, remark 
            FROM Extinguisher 
            ORDER BY extinguisher_id
        """)
        
        results = cursor.fetchall()
        
        if not results:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="找不到滅火器資料")
        
        fire_extinguisher_data = []
        for row in results:
            item_name, ingredient, specification, remark = row
            
            fire_extinguisher_data.append({
                "item_name": item_name,
                "ingredient": ingredient,
                "specification": specification,
                "remark": remark
            })
        
        # 先轉換成字典，再讓 FastAPI 處理轉換成 Pydantic 模型
        return [FireExtinguisherData(**item) for item in fire_extinguisher_data]
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"查詢發生錯誤: {e}")
    finally:
        conn.close()