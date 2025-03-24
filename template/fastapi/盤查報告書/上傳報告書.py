import os
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from connect.connect import connectDB
from docx2pdf import convert
import shutil

report_upload_router = APIRouter(tags=["Report API"])

# 使用相對路徑計算 UPLOAD_FOLDER
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # 取得 `template` 目錄
UPLOAD_FOLDER = os.path.join(BASE_DIR, "..", "..", "public", "version_report")  # 指向 `public/version_report`

@report_upload_router.post("/upload_report/")
async def upload_report(
    user_id: int = Form(...), 
    year: int = Form(...), 
    file: UploadFile = File(...)
):
    conn = connectDB()
    if not conn:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="無法連接到資料庫")
    
    cursor = conn.cursor()
    try:
        # 1. 查詢 Report_Baseline 獲取 report_id
        cursor.execute("SELECT report_id FROM Report_Baseline WHERE year = ?", (year,))
        report_result = cursor.fetchone()
        
        if not report_result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="找不到對應的報告資料")
        
        report_id = report_result[0]

        # 2. 查詢 Report_Uploads 是否已有該 report_id 的版本
        cursor.execute("SELECT MAX(version) FROM Report_Uploads WHERE report_id = ?", (report_id,))
        max_version_result = cursor.fetchone()
        max_version = max_version_result[0] if max_version_result and max_version_result[0] is not None else 0

        # 3. 設定新的 version 及 file_path
        new_version = max_version + 1
        file_name = f"{year}盤查報告書_v{new_version}.docx"
        file_path = f"/version_report/{file_name}"  # 資料庫存相對路徑

        # 4. 儲存檔案至 `public/version_report` 目錄
        save_path = os.path.join(UPLOAD_FOLDER, file_name)
        os.makedirs(os.path.dirname(save_path), exist_ok=True)  # 確保資料夾存在

        with open(save_path, "wb") as buffer:
            buffer.write(await file.read())

        # 5. 轉換 docx 為 pdf
        pdf_file_name = f"{year}盤查報告書_v{new_version}.pdf"
        pdf_file_path = os.path.join(UPLOAD_FOLDER, pdf_file_name)
        
        # 使用 docx2pdf 進行轉換
        try:
            convert(save_path, pdf_file_path)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"轉換檔案至 PDF 失敗: {e}")

        # 6. 取得當前時間
        uploaded_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # 7. 插入新資料到 Report_Uploads
        cursor.execute("""
            INSERT INTO Report_Uploads (report_id, user_id, file_path, uploaded_at, version)
            VALUES (?, ?, ?, ?, ?)
        """, (report_id, user_id, f"/version_report/{pdf_file_name}", uploaded_at, new_version))

        conn.commit()
        return {
            "message": "檔案上傳成功",
            "file_path": f"/version_report/{pdf_file_name}",
            "uploaded_at": uploaded_at,
            "version": new_version
        }

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"上傳發生錯誤: {e}")
    
    finally:
        conn.close()
