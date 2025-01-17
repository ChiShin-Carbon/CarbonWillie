from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

insert_adminCompany = APIRouter(tags=["admin"])

# 定義接收的資料模型
class CompanyData(BaseModel):
    business_id: str
    registration_number: Optional[str]
    org_name: str
    factory_number: Optional[str]
    county: Optional[str]
    town: Optional[str]
    postal_code: Optional[str]
    org_address: Optional[str]
    charge_person: Optional[str]
    org_email: Optional[str]
    industry_code: Optional[str]
    industry_name: Optional[str]
    contact_person: Optional[str]
    telephone: Optional[str]
    email: Optional[str]
    phone: Optional[str]

@insert_adminCompany.post("/insert_adminCompany")
def insert_company_data(company_data: CompanyData):
    conn = connectDB()  # 建立資料庫連線
    if conn:
        cursor = conn.cursor()
        try:
            # 插入主表的 SQL，為每個欄位提供對應的 ? 佔位符
            query_company_info = """
                INSERT INTO Company_Info (
                    business_id, registration_number, org_name, factory_number, county, town, postal_code,
                    org_address, charge_person, org_email, industry_code, industry_name
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
            company_values = (
                company_data.business_id, company_data.registration_number, company_data.org_name, 
                company_data.factory_number, company_data.county, company_data.town, company_data.postal_code, 
                company_data.org_address, company_data.charge_person, company_data.org_email, 
                company_data.industry_code, company_data.industry_name
            )

            # 插入聯絡表的 SQL
            query_contact_info = """
                INSERT INTO Contact_Info (
                    business_id, contact_person, telephone, email, phone
                ) VALUES (?, ?, ?, ?, ?)
            """
            contact_values = (
                company_data.business_id, company_data.contact_person, company_data.telephone, 
                company_data.email, company_data.phone
            )

            # 插入 CFV_Info 表的 SQL
            query_cfv_info = """
                INSERT INTO CFV_Info (
                    business_id, reason, GHG_Reg_Guide, ISO_CNS_14064_1, GHG_Protocol, verification, 
                    inspection_agency, significance, materiality, exclusion, GWP_version
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
            cfv_values = (
                company_data.business_id, 1, 1, 1, 1, 0, 0, "3.0%", "5.0%", "0.5%", "AR6"
            )

            # 執行 SQL 查詢
            cursor.execute(query_company_info, company_values)
            cursor.execute(query_contact_info, contact_values)
            cursor.execute(query_cfv_info, cfv_values)

            # 提交事務
            conn.commit()
            return {"message": "Company data inserted successfully!"}
        
        except Exception as e:
            conn.rollback()  # 如果發生錯誤，回滾事務
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error inserting company data: {e}")
        
        finally:
            cursor.close()  # 關閉游標
            conn.close()  # 關閉連線
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
