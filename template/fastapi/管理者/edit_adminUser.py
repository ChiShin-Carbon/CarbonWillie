from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from typing import Optional

edit_adminUser = APIRouter(tags=["admin"])

# 定義接收的資料模型
class UpdateUserData(BaseModel):
    user_id: int  # 用於標識要更新的使用者
    username: str
    email: Optional[str]
    telephone: Optional[str]
    phone: Optional[str]
    department: int
    position: int
    address: str
    password: str
    
@edit_adminUser.put("/edit_adminUser")
def update_user_data(user_data: UpdateUserData):
    conn = connectDB()  # 建立資料庫連線
    if conn:
        cursor = conn.cursor()
        try:
            # 更新 users 表的 SQL
            query_update_user = """
                UPDATE users
                SET username = ?, email = ?, telephone = ?, phone = ?,
                    department = ?, position = ?, address = ?, password = ?
                WHERE user_id = ?
            """
            update_values = (
                user_data.username, user_data.email, user_data.telephone,
                user_data.phone, user_data.department, user_data.position, user_data.address,
                user_data.password,  user_data.user_id
            )

            # 執行 SQL 查詢
            cursor.execute(query_update_user, update_values)

            # 檢查是否有更新的行
            if cursor.rowcount == 0:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

            # 提交事務
            conn.commit()
            return {"message": "User data updated successfully!"}

        except Exception as e:
            conn.rollback()  # 如果發生錯誤，回滾事務
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating user data: {e}")

        finally:
            cursor.close()  # 關閉游標
            conn.close()  # 關閉連線
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")