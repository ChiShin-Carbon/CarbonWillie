from fastapi import APIRouter, HTTPException
from connect.connect import connectDB

delete_electricity = APIRouter()

@delete_electricity.delete("/delete_electricity")
async def delete_electricity_record(electricity_id: int):
    # Connect to the database
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # SQL query to delete the record based on electricity_id
            query = """
                DELETE FROM Electricity_Usage
                WHERE id = ?
            """
            print("Executing query:", query)  # Debug print
            print("With electricity_id:", electricity_id)  # Debug print

            cursor.execute(query, (electricity_id,))
            conn.commit()

            # Check if any row was deleted
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Electricity usage record not found")

            return {"status": "success", "message": "Electricity usage record deleted successfully"}

        except Exception as e:
            print("Database error:", e)  # Log specific error
            raise HTTPException(status_code=500, detail=f"Database delete error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")
