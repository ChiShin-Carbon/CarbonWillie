from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date

get_nonemployee = APIRouter(tags=["Inventory API"])

class NonEmployeeData(BaseModel):
    month: str  # 只存月份部分
    nonemployee_number: int
    total_hours: int
    total_days: int
    remark: Optional[str] = None

@get_nonemployee.get("/nonemployee_data_by_year/{year}", response_model=List[NonEmployeeData])
def get_nonemployee_data_by_year(year: int):
    conn = connectDB()
    if not conn:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="無法連接到資料庫")
    
    cursor = conn.cursor()
    try:
        # 使用 LIKE 運算符搜索符合特定年份的記錄
        year_pattern = f"{year}-%"
        
        cursor.execute("""
            SELECT period_date, nonemployee_number, total_hours, total_days, remark 
            FROM NonEmployee 
            WHERE period_date LIKE ? 
            ORDER BY period_date DESC
        """, (year_pattern,))
        
        results = cursor.fetchall()
        
        if not results:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"找不到{year}年的非員工資料")
        
        nonemployee_data = []
        for row in results:
            period_date, nonemployee_number, total_hours, total_days, remark = row
            
            # 從日期中提取月份部分
            month = None
            if isinstance(period_date, (datetime, date)):
                month = period_date.strftime('%m')  # 只取月份部分
            elif isinstance(period_date, str):
                # 如果已經是字串，嘗試從格式為 'YYYY-MM-DD' 的字串中提取月份
                parts = period_date.split('-')
                if len(parts) >= 2:
                    month = parts[1]
            
            if not month:
                month = "未知"
            
            nonemployee_data.append({
                "month": month,
                "nonemployee_number": nonemployee_number,
                "total_hours": total_hours,
                "total_days": total_days,
                "remark": remark
            })
        
        # 先轉換成字典，再讓 FastAPI 處理轉換成 Pydantic 模型
        return [NonEmployeeData(**item) for item in nonemployee_data]
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"查詢發生錯誤: {e}")
    finally:
        conn.close()