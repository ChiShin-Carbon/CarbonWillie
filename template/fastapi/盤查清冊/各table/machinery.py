from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date

get_machinery = APIRouter(tags=["Inventory API"])

class MachineryData(BaseModel):
    doc_date: str
    machinery_location: str
    energy_type: int
    usage: float
    remark: Optional[str] = None

@get_machinery.get("/machinery_data_by_year/{year}", response_model=List[MachineryData])
def get_machinery_data_by_year(year: int):
    conn = connectDB()
    if not conn:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="無法連接到資料庫")
    
    cursor = conn.cursor()
    try:
        # 使用 LIKE 運算符搜索符合特定年份的記錄
        year_pattern = f"{year}-%"
        
        cursor.execute("""
            SELECT Doc_date, machinery_location, energy_type, usage, remark 
            FROM Machinery 
            WHERE Doc_date LIKE ? 
            ORDER BY Doc_date DESC
        """, (year_pattern,))
        
        results = cursor.fetchall()
        
        if not results:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"找不到{year}年的廠內機具資料")
        
        machinery_data = []
        for row in results:
            doc_date, machinery_location, energy_type, usage, remark = row
            
            # 確保日期轉換為字串
            if isinstance(doc_date, (datetime, date)):
                doc_date = doc_date.strftime('%Y-%m-%d')
            
            machinery_data.append({
                "doc_date": doc_date,
                "machinery_location": machinery_location,
                "energy_type": energy_type,
                "usage": usage,
                "remark": remark
            })
        
        # 先轉換成字典，再讓 FastAPI 處理轉換成 Pydantic 模型
        return [MachineryData(**item) for item in machinery_data]
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"查詢發生錯誤: {e}")
    finally:
        conn.close()