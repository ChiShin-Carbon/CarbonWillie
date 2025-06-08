from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date

get_electricity = APIRouter(tags=["Inventory API"])

class ElectricityData(BaseModel):
    doc_date: str  # 只保留月份 (格式: YYYY-MM)
    period_start: str
    period_end: str
    electricity_type: int
    value: float  # 根據 electricity_type 決定是 usage 或 amount

@get_electricity.get("/electricity_data_by_year/{year}", response_model=List[ElectricityData])
def get_electricity_data_by_year(year: int):
    conn = connectDB()
    if not conn:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="無法連接到資料庫")
    
    cursor = conn.cursor()
    try:
        # 使用 LIKE 運算符搜索符合特定年份的記錄
        year_pattern = f"{year}-%"
        
        cursor.execute("""
            SELECT Doc_date, period_start, period_end, electricity_type, usage, amount
            FROM Electricity_Usage
            WHERE Doc_date LIKE ? 
            ORDER BY Doc_date DESC
        """, (year_pattern,))
        
        results = cursor.fetchall()
        
        if not results:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"找不到{year}年的用電資料")
        
        electricity_data = []
        for row in results:
            doc_date, period_start, period_end, electricity_type, usage, amount = row
            
            # 確保日期轉換為字串並只保留年月
            if isinstance(doc_date, (datetime, date)):
                doc_date = doc_date.strftime('%Y-%m')  # 只保留年月
            else:
                # 如果是字串格式，截取前7個字符 (YYYY-MM)
                doc_date = str(doc_date)[:7]
            
            # 確保期間日期轉換為字串
            if isinstance(period_start, (datetime, date)):
                period_start = period_start.strftime('%Y-%m-%d')
            if isinstance(period_end, (datetime, date)):
                period_end = period_end.strftime('%Y-%m-%d')
            
            # 根據 electricity_type 決定取用 usage 或 amount
            if electricity_type == 1:
                value = usage  # 用電度數
            elif electricity_type == 2:
                value = amount  # 用電金額
            else:
                # 如果 electricity_type 不是 1 或 2，預設使用 usage
                value = usage
            
            electricity_data.append({
                "doc_date": doc_date,
                "period_start": period_start,
                "period_end": period_end,
                "electricity_type": electricity_type,
                "value": value
            })
        
        # 先轉換成字典，再讓 FastAPI 處理轉換成 Pydantic 模型
        return [ElectricityData(**item) for item in electricity_data]
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"查詢發生錯誤: {e}")
    finally:
        conn.close()