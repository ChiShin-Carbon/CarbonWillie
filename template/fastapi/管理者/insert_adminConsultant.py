from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from typing import Optional, List

insert_adminConsultant = APIRouter(tags=["admin"])

# 定義接收的資料模型
class ConsultantData(BaseModel):
    address: str
    password: str
    username: str
    email: Optional[str]
    phone: Optional[str]
    responsible_companies: Optional[List[str]]  # 負責企業的 business_id 列表

@insert_adminConsultant.post("/insert_adminConsultant")
def insert_consultant_data(consultant_data: ConsultantData):
    conn = connectDB()  # 建立資料庫連線
    if conn:
        cursor = conn.cursor()
        try:
            # 插入 users 表的 SQL
            query_consultant_info = """
                INSERT INTO users (
                    address, password, username, email, phone, role
                ) VALUES (?, ?, ?, ?, ?, ?)
            """
            consultant_values = (
                consultant_data.address, consultant_data.password, consultant_data.username,
                consultant_data.email, consultant_data.phone, 1  # role 固定為 1
            )

            # 執行插入 users 表的 SQL
            cursor.execute(query_consultant_info, consultant_values)

            # 獲取新增的 user_id，改用 OUTPUT 子句
            cursor.execute("SELECT @@IDENTITY")
            user_id = cursor.fetchone()[0]

            # 确保 user_id 被正确生成
            if not user_id:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to retrieve generated user_id."
                )

            # 如果有負責企業，插入到 CompanyConsultant 表
            if consultant_data.responsible_companies:
                query_company_consultant = """
                    INSERT INTO CompanyConsultant (business_id, user_id)
                    VALUES (?, ?)
                """
                print(consultant_data.responsible_companies)
                
                # 查询负责企业的 business_id 是否存在于 Company_Info 表中
                for business_id in consultant_data.responsible_companies:
                    cursor.execute("SELECT COUNT(*) FROM Company_Info WHERE business_id = ?", (business_id,))
                    company_exists = cursor.fetchone()[0]

                    if company_exists == 0:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"business_id {business_id} does not exist in Company_Info table."
                        )
                    
                    cursor.execute(query_company_consultant, (business_id, user_id))

                conn.commit()  # 提交所有 CompanyConsultant 插入操作

            return {"message": "Consultant data inserted successfully!"}
        
        except Exception as e:
            conn.rollback()  # 如果發生錯誤，回滾事務
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error inserting consultant data: {e}")
        
        finally:
            cursor.close()  # 關閉游標
            conn.close()  # 關閉連線
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
