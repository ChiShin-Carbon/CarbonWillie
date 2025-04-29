from fastapi import APIRouter, HTTPException, status, Depends
from connect.connect import connectDB
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# 建立 APIRouter 實例
authorized_review = APIRouter()

# 定義 Pydantic 模型類別
class AuthorizedRecord(BaseModel):
    authorized_record_id: int
    user_id: int
    baseline_id: int
    table_name: str
    is_done: bool
    completed_at: Optional[datetime]  # Allows datetime or None for NULL
    review: Optional[int]  # 允許 review 為 None
    username: str
    department: int

class UpdateReviewRequest(BaseModel):
    review: int  # 審核狀態

# 取得授權記錄
@authorized_review.get("/authorized_review", response_model=list[AuthorizedRecord])
def get_authorized_records():
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            query = """
                SELECT 
                    a.authorized_record_id,
                    a.user_id,
                    a.baseline_id,
                    a.table_name,
                    a.is_done,
                    a.completed_at,
                    a.review,
                    u.username,
                    u.department 
                FROM Authorized_Table a
                JOIN users u ON a.user_id = u.user_id
            """
            cursor.execute(query)
            records = cursor.fetchall()
            conn.close()

            if records:
                results = [
                    AuthorizedRecord(
                        authorized_record_id=record[0],
                        user_id=record[1],
                        baseline_id=record[2],
                        table_name=record[3],
                        is_done=record[4],
                        completed_at=record[5].strftime("%Y-%m-%d %H:%M:%S") if isinstance(record[5], datetime) else record[5],
                        review=record[6],
                        username=record[7],
                        department=record[8]
                    )
                    for record in records
                ]
                return results
            else:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No authorized records found")
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error retrieving authorized records: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")

# 更新 review 欄位
@authorized_review.put("/update_review/{authorized_record_id}")
def update_review(authorized_record_id: int, update_request: UpdateReviewRequest):
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            query = """
                UPDATE Authorized_Table
                SET review = ?
                WHERE authorized_record_id = ?
            """
            cursor.execute(query, (update_request.review, authorized_record_id))
            conn.commit()
            conn.close()
            return {"message": "Review updated successfully"}
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating review: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
    
