from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# 建立 APIRouter 實例
authorizedTable = APIRouter()

# 定義 Pydantic 模型類別
class AuthorizedRecord(BaseModel):
    authorized_record_id: int
    user_id: int
    table_name: str
    is_done: bool
    completed_at: Optional[datetime]  # Allows datetime or None for NULL
    review: int
    username: str
    department: int
    
@authorizedTable.get("/authorizedTable", response_model=list[AuthorizedRecord])
def get_authorized_records():
    # 使用自定義連接函數建立資料庫連接
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # 執行 SQL 查詢從 Authorized_Table 獲取資料
            query = """
                SELECT 
                    a.authorized_record_id,
                    a.user_id,
                    a.table_name,
                    a.is_done,
                    a.completed_at,
                    a.review ,
                    u.username,
                    u.department 
                FROM Authorized_Table a
                JOIN users u ON a.user_id = u.user_id
            """
            cursor.execute(query)
            records = cursor.fetchall()
            conn.close()

            if records:
                # 將結果轉換為 AuthorizedRecord 模型的字典列表，並將 completed_at 轉換為字符串
                results = [
                    AuthorizedRecord(
                        authorized_record_id=record[0],
                        user_id=record[1],
                        table_name=record[2],
                        is_done=record[3],
                        completed_at=record[4].strftime("%Y-%m-%d %H:%M:%S") if isinstance(record[4], datetime) else record[4],
                        review=record[5],
                        username=record[6],
                        department=record[7]
                    )
                    for record in records
                ]
                return results  # 返回授權記錄列表
            else:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No authorized records found")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error retrieving authorized records: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")

@authorizedTable.put("/authorizedTable/{authorized_record_id}")
def update_authorized_record(authorized_record_id: int, is_done: bool, completed_at: Optional[datetime] = None):
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            query = """
                UPDATE Authorized_Table
                SET is_done = ?, completed_at = ?
                WHERE authorized_record_id = ?
            """
            cursor.execute(query, (is_done, completed_at, authorized_record_id))
            conn.commit()
            
            if cursor.rowcount == 0:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")
            
            return {"status": "success", "message": "Record updated successfully"}
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating record: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")