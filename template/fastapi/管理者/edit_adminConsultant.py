from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from typing import Optional, List

edit_adminConsultant = APIRouter(tags=["admin"])

# 定義接收的資料模型
class ConsultantData(BaseModel):
    user_id: int
    address: str
    password: str
    username: str
    email: Optional[str]
    phone: Optional[str]
    responsible_companies: Optional[List[str]]  # 負責企業的 business_id 列表


@edit_adminConsultant.put("/edit_adminConsultant")
def update_consultant_data(user_data: ConsultantData):
    conn = connectDB()  # 建立資料庫連線
    if conn:
        cursor = conn.cursor()
        try:
            # 更新 users 表的 SQL
            query_update_consultant = """
                UPDATE users
                SET address = ?, password = ?, username = ?, email = ?, phone = ?
                WHERE user_id = ?
            """
            update_values = (
                user_data.address, user_data.password, user_data.username,
                user_data.email, user_data.phone, user_data.user_id
            )
            cursor.execute(query_update_consultant, update_values)

            if cursor.rowcount == 0:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

            # 處理負責企業 (CompanyConsultant 表)
            # 獲取當前的企業列表
            query_get_existing_companies = """
                SELECT business_id FROM CompanyConsultant WHERE user_id = ?
            """
            cursor.execute(query_get_existing_companies, (user_data.user_id,))
            existing_companies = {row[0] for row in cursor.fetchall()}  # 現有企業ID集合

            # 前端傳入的企業列表
            incoming_companies = set(user_data.responsible_companies or [])  # 傳入企業ID集合

            # 計算需要新增和移除的企業
            companies_to_add = incoming_companies - existing_companies  # 新增
            companies_to_remove = existing_companies - incoming_companies  # 移除

            # 執行新增操作
            for business_id in companies_to_add:
                query_insert_company = """
                    INSERT INTO CompanyConsultant (user_id, business_id) VALUES (?, ?)
                """
                cursor.execute(query_insert_company, (user_data.user_id, business_id))

            # 執行移除操作
            for business_id in companies_to_remove:
                query_delete_company = """
                    DELETE FROM CompanyConsultant WHERE user_id = ? AND business_id = ?
                """
                cursor.execute(query_delete_company, (user_data.user_id, business_id))

            # 提交事務
            conn.commit()
            return {"message": "Consultant data and companies updated successfully!"}

        except Exception as e:
            conn.rollback()  # 如果發生錯誤，回滾事務
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating consultant data: {e}")

        finally:
            cursor.close()  # 關閉游標
            conn.close()  # 關閉連線
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
