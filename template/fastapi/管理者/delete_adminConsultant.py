from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB

delete_adminConsultant = APIRouter(tags=["admin"])

@delete_adminConsultant.delete("/delete_adminconsultant/{user_id}")
def delete_consultant(user_id: str):
    conn = connectDB()  # 建立資料庫連線
    if conn:
        cursor = conn.cursor()
        try:
            # 先刪除與 consultant 相關的 CompanyConsultant 資料
            query_delete_company_consultant = """
                DELETE FROM CompanyConsultant WHERE user_id = ?
            """
            cursor.execute(query_delete_company_consultant, (user_id,))

            # 刪除 users 表中的資料
            query_delete_user = """
                DELETE FROM users WHERE user_id = ?
            """
            cursor.execute(query_delete_user, (user_id,))

            # 提交事務
            conn.commit()

            # 確認是否刪除成功
            if cursor.rowcount == 0:  # 如果 `rowcount` 為 0，表示無資料被刪除
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail=f"No consultant found with user_id: {user_id}"
                )

            return {"message": f"Consultant data with user_id {user_id} deleted successfully!"}
        
        except Exception as e:
            conn.rollback()  # 如果發生錯誤，回滾事務
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error deleting consultant data: {e}")
        
        finally:
            cursor.close()  # 關閉游標
            conn.close()  # 關閉連線
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
