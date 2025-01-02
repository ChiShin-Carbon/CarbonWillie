from fastapi import APIRouter, HTTPException
from connect.connect import connectDB

delete_emergency = APIRouter()

@delete_emergency.delete("/delete_emergency")
async def delete_emergency_record(emergency_id: int):
    # Connect to the database
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # SQL query to delete the record based on emergency_id
            query = """
                DELETE FROM Emergency_Generator
                WHERE id = ?
            """
            print("Executing query:", query)  # Debug print
            print("With emergency_id:", emergency_id)  # Debug print

            cursor.execute(query, (emergency_id,))
            conn.commit()

            # Check if any row was deleted
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Emergency generator record not found")

            return {"status": "success", "message": "Emergency generator record deleted successfully"}

        except Exception as e:
            print("Database error:", e)  # Log specific error
            raise HTTPException(status_code=500, detail=f"Database delete error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")
