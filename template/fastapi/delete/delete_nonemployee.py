from fastapi import APIRouter, HTTPException, Body
from connect.connect import connectDB
from pydantic import BaseModel

# Define model for the request body
class NonEmployeeDelete(BaseModel):
    nonemployee_id: int

delete_nonemployee = APIRouter()

@delete_nonemployee.delete("/delete_nonemployee")
async def delete_nonemployee_record(data: NonEmployeeDelete = Body(...)):
    # Connect to the database
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # SQL query to delete the record based on nonemployee_id
            query = """
                DELETE FROM NonEmployee
                WHERE nonemployee_id = ?
            """
            print("Executing query:", query)  # Debug print
            print("With nonemployee_id:", data.nonemployee_id)  # Debug print

            cursor.execute(query, (data.nonemployee_id,))
            conn.commit()

            # Check if any row was deleted
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="NonEmployee record not found")

            return {"status": "success", "message": "NonEmployee record deleted successfully"}

        except Exception as e:
            print("Database error:", e)  # Log specific error
            raise HTTPException(status_code=500, detail=f"Database delete error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")