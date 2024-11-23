from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB

delete_adminCompany = APIRouter()

@delete_adminCompany.delete("/delete_adminCompany/{business_id}")
def delete_company_data(business_id: str):
    conn = connectDB()  # 建立資料庫連線
    if conn:
        cursor = conn.cursor()
        try:
            # 刪除 Contact_Info 表中的資料
            query_delete_contact_info = """
                DELETE FROM Contact_Info WHERE business_id = ?
            """
            cursor.execute(query_delete_contact_info, (business_id,))

            # 刪除 Company_Info 表中的資料
            query_delete_company_info = """
                DELETE FROM Company_Info WHERE business_id = ?
            """
            cursor.execute(query_delete_company_info, (business_id,))

            # 提交事務
            conn.commit()

            # 確認是否刪除成功
            if cursor.rowcount == 0:  # 如果 `rowcount` 為 0，表示無資料被刪除
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail=f"No company data found with business_id: {business_id}"
                )

            return {"message": f"Company data with business_id {business_id} deleted successfully!"}
        
        except Exception as e:
            conn.rollback()  # 如果發生錯誤，回滾事務
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error deleting company data: {e}")
        
        finally:
            cursor.close()  # 關閉游標
            conn.close()  # 關閉連線
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
