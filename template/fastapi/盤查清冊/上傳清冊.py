import os
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from connect.connect import connectDB

inventory_upload_router = APIRouter(tags=["Inventory API"])

# 使用相對路徑計算 UPLOAD_FOLDER
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # 取得目前目錄
UPLOAD_FOLDER = os.path.join(BASE_DIR, "..", "..", "public", "version_excel")  # 指向 `public/version_inventory`

@inventory_upload_router.post("/upload_inventory/")
async def upload_inventory(
    user_id: int = Form(...), 
    year: int = Form(...), 
    file: UploadFile = File(...)
):
    # 檢查檔案是否為 Excel 格式
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="僅接受 Excel 檔案格式 (.xlsx 或 .xls)")
    
    conn = connectDB()
    if not conn:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="無法連接到資料庫")
    
    cursor = conn.cursor()
    try:
        # 1. 查詢 Inventory_Baseline 獲取 inventory_id
        cursor.execute("SELECT inventory_id FROM Inventory_Baseline WHERE year = ?", (year,))
        inventory_result = cursor.fetchone()
        
        if not inventory_result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"找不到 {year} 年對應的盤查清冊資料")
        
        inventory_id = inventory_result[0]

        # 2. 查詢 Inventory_Uploads 是否已有該 inventory_id 的版本
        cursor.execute("SELECT MAX(version) FROM Inventory_Uploads WHERE inventory_id = ?", (inventory_id,))
        max_version_result = cursor.fetchone()
        max_version = max_version_result[0] if max_version_result and max_version_result[0] is not None else 0

        # 3. 設定新的 version 及 file_path
        new_version = max_version + 1
        file_name = f"{year}盤查清冊_v{new_version}.xlsx"
        
        # 4. 儲存檔案至 `public/version_inventory` 目錄
        save_path = os.path.join(UPLOAD_FOLDER, file_name)
        os.makedirs(os.path.dirname(save_path), exist_ok=True)  # 確保資料夾存在

        with open(save_path, "wb") as buffer:
            buffer.write(await file.read())
        
        # 5. 設定檔案相對路徑（用於存入資料庫）
        file_path = f"/version_excel/{file_name}"
        
        # 6. 取得當前時間
        uploaded_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # 7. 插入新資料到 Inventory_Uploads
        cursor.execute("""
            INSERT INTO Inventory_Uploads (inventory_id, user_id, file_path, uploaded_at, version)
            VALUES (?, ?, ?, ?, ?)
        """, (inventory_id, user_id, file_path, uploaded_at, new_version))

        conn.commit()
        return {
            "message": "檔案上傳成功",
            "file_path": file_path,
            "uploaded_at": uploaded_at,
            "version": new_version
        }

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"上傳發生錯誤: {e}")
    
    finally:
        cursor.close()
        conn.close()