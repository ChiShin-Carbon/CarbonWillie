from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse
from connect.connect import connectDB
from pydantic import BaseModel
from typing import Optional
from 盤查報告書.merge import merge_documents  # 匯入合併 Word 檔案的函式
import os

# 建立 APIRouter 實例
word_companyinfo = APIRouter(tags=["word專用"])

# 定義 Pydantic 模型類別
class OrgInfoResponse(BaseModel):
    user_id: str
    business_id: Optional[str]
    org_name: Optional[str]

# 取得 org_name 並下載 Word 檔案
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

        # 查詢 org_name
        cursor.execute("SELECT org_name FROM Company_Info WHERE business_id = ?", (business_id,))
        org_result = cursor.fetchone()
        
        if not org_result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="找不到對應的 org_name")
        
        org_name = org_result[0]

        # 產生 Word 文件
        merge_documents()  
        file_path = "combined.docx"

        # 檢查檔案是否存在
        if not os.path.exists(file_path):
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="合併文件失敗")
        
        return FileResponse(path=file_path, filename="combined.docx", media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"查詢發生錯誤: {e}")

    finally:
        conn.close()
