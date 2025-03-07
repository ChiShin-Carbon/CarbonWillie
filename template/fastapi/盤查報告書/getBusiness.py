from fastapi import APIRouter, HTTPException, status, Depends
from connect.connect import connectDB
from pydantic import BaseModel
from typing import Optional
import requests

# 建立 APIRouter 實例
word_companyinfo = APIRouter(tags=["word專用"])

# 定義 Pydantic 模型類別
class OrgInfoResponse(BaseModel):
    user_id: str
    business_id: Optional[str]
    org_name: Optional[str]
    org_address: Optional[str]
    charge_person: Optional[str]
    intro: Optional[str]
    summary: Optional[str]

# 呼叫 word_ai.py 生成企業前言與簡介的函數
def fetch_intro_and_summary(org_name: str, business_id: str):
    """向 word_ai 端點請求企業前言與簡介"""
    try:
        response = requests.post("http://localhost:8000/generate_company_info", json={"org_name": org_name, "business_id": business_id})
        response.raise_for_status()
        data = response.json()
        return data.get("intro"), data.get("summary")
    except requests.RequestException as e:
        print(f"獲取企業簡介失敗: {e}")
        return None, None

# 取得 org_name、org_address 和 charge_person 的 API 端點
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
        cursor.execute("SELECT org_name, org_address, charge_person FROM Company_Info WHERE business_id = ?", (business_id,))
        org_result = cursor.fetchone()
        
        conn.close()

        if not org_result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="找不到對應的機構資訊")

        # 取得企業前言與簡介
        org_name = org_result[0]
        intro, summary = fetch_intro_and_summary(org_name, business_id)

        return OrgInfoResponse(
            user_id=user_id, 
            business_id=business_id, 
            org_name=org_name, 
            org_address=org_result[1], 
            charge_person=org_result[2],
            intro=intro,
            summary=summary
        )

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"查詢發生錯誤: {e}")
