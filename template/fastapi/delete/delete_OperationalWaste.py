from fastapi import APIRouter, HTTPException
from connect.connect import connectDB

delete_waste = APIRouter()

@delete_waste.delete("/delete_waste")
async def delete_waste_record(waste_id: int):
    # Connect to the database
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # SQL query to delete the record based on waste_id
            query = """
                DELETE FROM Operational_Waste
                WHERE id = ?
            """
            print("Executing query:", query)  # Debug print
            print("With waste_id:", waste_id)  # Debug print

            cursor.execute(query, (waste_id,))
            conn.commit()

            # Check if any row was deleted
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Operational waste record not found")

            return {"status": "success", "message": "Operational waste record deleted successfully"}

        except Exception as e:
            print("Database error:", e)  # Log specific error
            raise HTTPException(status_code=500, detail=f"Database delete error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")
