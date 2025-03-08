from fastapi import APIRouter, HTTPException, Body
from connect.connect import connectDB
from pydantic import BaseModel

# Define model for the request body
class CommuteDelete(BaseModel):
    commute_id: int

delete_commute = APIRouter()

@delete_commute.delete("/delete_commute")
async def delete_commute_record(data: CommuteDelete = Body(...)):
    # Connect to the database
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # SQL query to delete the record based on commute_id
            query = """
                DELETE FROM Commute
                WHERE commute_id = ?
            """
            print("Executing query:", query)  # Debug print
            print("With commute_id:", data.commute_id)  # Debug print

            cursor.execute(query, (data.commute_id,))
            conn.commit()

            # Check if any row was deleted
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Commute record not found")

            return {"status": "success", "message": "Commute record deleted successfully"}

        except Exception as e:
            print("Database error:", e)  # Log specific error
            raise HTTPException(status_code=500, detail=f"Database delete error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")