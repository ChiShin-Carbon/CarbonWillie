from fastapi import APIRouter, HTTPException, Body
from connect.connect import connectDB
from pydantic import BaseModel

# Define model for the request body
class MachineryDelete(BaseModel):
    machinery_id: int

delete_machine = APIRouter()

@delete_machine.delete("/delete_machine")
async def delete_machine_record(data: MachineryDelete = Body(...)):
    # Connect to the database
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # SQL query to delete the record based on machinery_id
            query = """
                DELETE FROM Machinery
                WHERE machinery_id = ?
            """
            print("Executing query:", query)  # Debug print
            print("With machinery_id:", data.machinery_id)  # Debug print

            cursor.execute(query, (data.machinery_id,))
            conn.commit()

            # Check if any row was deleted
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Machinery record not found")

            return {"status": "success", "message": "Machinery record deleted successfully"}

        except Exception as e:
            print("Database error:", e)  # Log specific error
            raise HTTPException(status_code=500, detail=f"Database delete error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")