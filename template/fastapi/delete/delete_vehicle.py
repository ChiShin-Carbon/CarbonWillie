from fastapi import APIRouter, HTTPException
from connect.connect import connectDB

delete_vehicle = APIRouter()

@delete_vehicle.delete("/delete_vehicle")
async def delete_vehicle_record(vehicle_id: int):
    # Connect to the database
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # SQL query to delete the record based on vehicle_id
            query = """
                DELETE FROM Vehicle
                WHERE id = ?
            """
            print("Executing query:", query)  # Debug print
            print("With vehicle_id:", vehicle_id)  # Debug print

            cursor.execute(query, (vehicle_id,))
            conn.commit()

            # Check if any row was deleted
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Vehicle record not found")

            return {"status": "success", "message": "Vehicle record deleted successfully"}

        except Exception as e:
            print("Database error:", e)  # Log specific error
            raise HTTPException(status_code=500, detail=f"Database delete error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")
