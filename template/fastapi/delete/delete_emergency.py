from fastapi import APIRouter, HTTPException, Body
from connect.connect import connectDB
from pydantic import BaseModel

# Define model for the request body
class EmergencyDelete(BaseModel):
    generator_id: int

delete_emergency = APIRouter()

@delete_emergency.delete("/delete_emergency")
async def delete_emergency_record(data: EmergencyDelete = Body(...)):
    # Connect to the database
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # SQL query to delete the record based on generator_id
            query = """
                DELETE FROM Emergency_Generator
                WHERE generator_id = ?
            """
            print("Executing query:", query)  # Debug print
            print("With generator_id:", data.generator_id)  # Debug print

            cursor.execute(query, (data.generator_id,))
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