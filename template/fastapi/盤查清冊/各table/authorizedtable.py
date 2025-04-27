from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

get_authorized_users = APIRouter(tags=["Inventory API"])

class AuthorizedUserEntry(BaseModel):
    table_name: str
    user_id: int
    department: int
    department_name: str
    username: str
    email: str
    telephone: Optional[str] = None
    address: str

@get_authorized_users.get("/authorized_users_by_year/{year}", response_model=List[AuthorizedUserEntry])
def get_authorized_users_by_year(year: int):
    conn = connectDB()
    if not conn:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="無法連接到資料庫")
    
    cursor = conn.cursor()
    try:
        # 步驟1: 根據年份查詢 Baseline 表中符合的數據
        year_pattern = f"{year}%"
        cursor.execute("""
        SELECT TOP 1 baseline_id 
        FROM Baseline 
        WHERE cfv_start_date LIKE ? 
        ORDER BY baseline_id DESC
    """, (year_pattern,))
        
        baseline_result = cursor.fetchone()
        if not baseline_result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"找不到{year}年的基準線資料")
        
        baseline_id = baseline_result[0]
        
        # 查詢授權表中的所有數據，直接關聯用戶表獲取用戶詳細信息
        cursor.execute("""
            SELECT a.table_name, a.user_id, u.department, u.username, u.email, u.telephone, u.address
            FROM Authorized_Table a
            JOIN users u ON a.user_id = u.user_id
            WHERE a.baseline_id = ?
        """, (baseline_id,))
        
        all_entries = cursor.fetchall()
        if not all_entries:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"找不到使用baseline_id={baseline_id}的授權表資料")
        
        # 定義部門代碼對應的名稱
        department_names = {
            1: "管理部門",
            2: "資訊部門",
            3: "業務部門",
            4: "門診部門",
            5: "健檢部門",
            6: "檢驗部門",
            7: "其他"
        }
        
        result = []
        
        # 將每一筆數據轉換為 AuthorizedUserEntry
        for entry in all_entries:
            table_name, user_id, department, username, email, telephone, address = entry
            
            # 獲取部門名稱，如果代碼不在映射中則使用"未知部門"
            department_name = department_names.get(department, "未知部門")
            
            result.append(AuthorizedUserEntry(
                table_name=table_name,
                user_id=user_id,
                department=department,
                department_name=department_name,
                username=username,
                email=email,
                telephone=telephone if telephone else None,
                address=address
            ))
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"查詢發生錯誤: {e}")
    finally:
        conn.close()