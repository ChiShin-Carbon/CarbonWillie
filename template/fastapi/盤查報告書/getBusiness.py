from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from typing import Optional

# 建立 APIRouter 實例
word_companyinfo = APIRouter(tags=["word專用"])

# 定義 Pydantic 模型類別，新增 org_address 和 charge_person
class OrgInfoResponse(BaseModel):
    user_id: str
    business_id: Optional[str]
    org_name: Optional[str]
    org_address: Optional[str]  # 地址
    charge_person: Optional[str]  # 負責人

# 取得 org_name、org_address、charge_person 的 API 端點
@word_companyinfo.get("/org_info/{user_id}", response_model=OrgInfoResponse)
def get_org_info(user_id: str):
    conn = connectDB()
    if not conn:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="無法連接到資料庫")

    cursor = conn.cursor()
    
    try:
        # 查詢 business_id
        cursor.execute("SELECT business_id FROM users WHERE user_id = ?", (user_id,))
        business_result = cursor.fetchone()
        
        if not business_result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="找不到對應的 business_id")
        
        business_id = business_result[0]

        # 查詢 org_name、org_address、charge_person
        cursor.execute("""
            SELECT org_name, org_address, charge_person 
            FROM Company_Info 
            WHERE business_id = ?
        """, (business_id,))
        
        org_result = cursor.fetchone()
        
        conn.close()

        if not org_result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="找不到對應的機構資訊")

        # 回傳完整資訊
        return OrgInfoResponse(
            user_id=user_id,
            business_id=business_id,
            org_name=org_result[0],
            org_address=org_result[1],
            charge_person=org_result[2]
        )

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"查詢發生錯誤: {e}")
