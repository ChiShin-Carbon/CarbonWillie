from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date

get_generator = APIRouter(tags=["Inventory API"])

class GeneratorData(BaseModel):
    doc_date: str
    doc_number: str
    usage: float
    remark: Optional[str] = None

@get_generator.get("/generator_data_by_year/{year}", response_model=List[GeneratorData])
def get_generator_data_by_year(year: int):
    conn = connectDB()
    if not conn:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="無法連接到資料庫")
    
    cursor = conn.cursor()
    try:
        # 使用 LIKE 運算符搜索符合特定年份的記錄
        year_pattern = f"{year}-%"
        
        cursor.execute("""
            SELECT Doc_date, Doc_number, usage, remark 
            FROM Emergency_Generator
            WHERE Doc_date LIKE ? 
            ORDER BY Doc_date DESC
        """, (year_pattern,))
        
        results = cursor.fetchall()
        
        if not results:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"找不到{year}年的緊急發電機資料")
        
        generator_data = []
        for row in results:
            doc_date, doc_number, usage, remark = row
            
            # 確保日期轉換為字串
            if isinstance(doc_date, (datetime, date)):
                doc_date = doc_date.strftime('%Y-%m-%d')
            
            generator_data.append({
                "doc_date": doc_date,
                "doc_number": doc_number,
                "usage": usage,
                "remark": remark
            })
        
        # 先轉換成字典，再讓 FastAPI 處理轉換成 Pydantic 模型
        return [GeneratorData(**item) for item in generator_data]
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"查詢發生錯誤: {e}")
    finally:
        conn.close()