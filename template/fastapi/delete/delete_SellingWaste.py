from fastapi import APIRouter, HTTPException, Body
from connect.connect import connectDB
from pydantic import BaseModel

# Define model for the request body
class SellingWasteDelete(BaseModel):
    waste_id: int

delete_SellingWaste = APIRouter()

@delete_SellingWaste.delete("/delete_SellingWaste")
async def delete_selling_waste_record(data: SellingWasteDelete = Body(...)):
    # Connect to the database
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # SQL query to delete the record based on waste_id
            query = """
                DELETE FROM Selling_Waste
                WHERE waste_id = ?
            """
            print("Executing query:", query)  # Debug print
            print("With waste_id:", data.waste_id)  # Debug print

            cursor.execute(query, (data.waste_id,))
            conn.commit()

            # Check if any row was deleted
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Selling waste record not found")

            return {"status": "success", "message": "Selling waste record deleted successfully"}

        except Exception as e:
            print("Database error:", e)  # Log specific error
            raise HTTPException(status_code=500, detail=f"Database delete error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")