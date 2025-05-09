from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date

get_employee = APIRouter(tags=["Inventory API"])

class EmployeeData(BaseModel):
    month: str  # 改為只顯示月份部分
    employee_number: int
    daily_hours: int
    workday: int
    overtime: Optional[float] = None
    sick_leave: Optional[float] = None
    personal_leave: Optional[float] = None
    business_trip: Optional[float] = None
    wedding_and_funeral: Optional[float] = None
    special_leave: Optional[float] = None
    remark: Optional[str] = None

@get_employee.get("/employee_data_by_year/{year}", response_model=List[EmployeeData])
def get_employee_data_by_year(year: int):
    conn = connectDB()
    if not conn:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="無法連接到資料庫")
    
    cursor = conn.cursor()
    try:
        # 使用 LIKE 運算符搜索符合特定年份的記錄
        year_pattern = f"{year}-%"
        
        cursor.execute("""
            SELECT period_date, employee_number, daily_hours, workday, 
                   overtime, sick_leave, personal_leave, business_trip, 
                   wedding_and_funeral, special_leave, remark 
            FROM Employee 
            WHERE period_date LIKE ? 
            ORDER BY period_date DESC
        """, (year_pattern,))
        
        results = cursor.fetchall()
        
        if not results:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"找不到{year}年的員工資料")
        
        employee_data = []
        for row in results:
            period_date, employee_number, daily_hours, workday, overtime, sick_leave, \
            personal_leave, business_trip, wedding_and_funeral, special_leave, remark = row
            
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
            
            employee_data.append({
                "month": month,
                "employee_number": employee_number,
                "daily_hours": daily_hours,
                "workday": workday,
                "overtime": overtime,
                "sick_leave": sick_leave,
                "personal_leave": personal_leave,
                "business_trip": business_trip,
                "wedding_and_funeral": wedding_and_funeral,
                "special_leave": special_leave,
                "remark": remark
            })
        
        # 先轉換成字典，再讓 FastAPI 處理轉換成 Pydantic 模型
        return [EmployeeData(**item) for item in employee_data]
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"查詢發生錯誤: {e}")
    finally:
        conn.close()