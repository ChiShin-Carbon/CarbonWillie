from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

get_authorized_users = APIRouter(tags=["Inventory API"])

class UserInfo(BaseModel):
    user_id: int
    department: int
    department_name: str  # 將部門代碼轉換為部門名稱
    username: str
    email: str
    telephone: Optional[str] = None
    address: str

class TableAuthorizedUsers(BaseModel):
    table_name: str
    users: List[UserInfo]

@get_authorized_users.get("/authorized_users_by_year/{year}", response_model=List[TableAuthorizedUsers])
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
        
        # 步驟2: 查詢 Authorized_Table 中使用該 baseline_id 的所有資料
        cursor.execute("""
            SELECT DISTINCT table_name 
            FROM Authorized_Table 
            WHERE baseline_id = ?
        """, (baseline_id,))
        
        table_names = cursor.fetchall()
        if not table_names:
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
        
        # 步驟3: 對每個表名，查詢授權使用者的詳細資訊
        for table_name_row in table_names:
            table_name = table_name_row[0]
            
            cursor.execute("""
                SELECT a.user_id, u.department, u.username, u.email, u.telephone, u.address
                FROM Authorized_Table a
                JOIN users u ON a.user_id = u.user_id
                WHERE a.baseline_id = ? AND a.table_name = ?
            """, (baseline_id, table_name))
            
            users_data = cursor.fetchall()
            
            users_list = []
            for user_data in users_data:
                user_id, department, username, email, telephone, address = user_data
                
                # 獲取部門名稱，如果代碼不在映射中則使用"未知部門"
                department_name = department_names.get(department, "未知部門")
                
                users_list.append(UserInfo(
                    user_id=user_id,
                    department=department,
                    department_name=department_name,
                    username=username,
                    email=email,
                    telephone=telephone if telephone else None,
                    address=address
                ))
            
            result.append(TableAuthorizedUsers(
                table_name=table_name,
                users=users_list
            ))
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"查詢發生錯誤: {e}")
    finally:
        conn.close()