from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from typing import Optional

insert_adminUser = APIRouter(tags=["admin"])

# 定義接收的資料模型
class UserData(BaseModel):
    business_id: str
    username: str
    email: Optional[str]
    telephone: Optional[str]
    phone: Optional[str]
    department: int
    position: int
    address: str
    password: str
    role: int = 2  # 預設 role 為 2

@insert_adminUser.post("/insert_adminUser")
def insert_user_data(user_data: UserData):
    conn = connectDB()  # 建立資料庫連線
    if conn:
        cursor = conn.cursor()
        try:
            # 插入 users 表的 SQL，為每個欄位提供對應的 ? 佔位符
            query_user_info = """
                INSERT INTO users (
                    business_id, username, email, telephone, phone, department, position, address, password, role
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
            user_values = (
                user_data.business_id, user_data.username, user_data.email, user_data.telephone,
                user_data.phone, user_data.department, user_data.position, user_data.address,
                user_data.password, user_data.role
            )

            # 執行 SQL 查詢
            cursor.execute(query_user_info, user_values)

            # 提交事務
            conn.commit()
            return {"message": "User data inserted successfully!"}
        
        except Exception as e:
            conn.rollback()  # 如果發生錯誤，回滾事務
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error inserting user data: {e}")
        
        finally:
            cursor.close()  # 關閉游標
            conn.close()  # 關閉連線
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
