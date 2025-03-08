from fastapi import APIRouter, HTTPException, Body
from connect.connect import connectDB
from pydantic import BaseModel

# Define a model for the request body
class VehicleDelete(BaseModel):
    vehicle_id: int

delete_vehicle = APIRouter(tags=["delete"])

@delete_vehicle.delete("/delete_vehicle")
async def delete_vehicle_record(vehicle: VehicleDelete = Body(...)):
    # Connect to the database
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # SQL query to delete the record based on vehicle_id
            query = """
                DELETE FROM Vehicle
                WHERE vehicle_id = ?
            """
            print("Executing query:", query)  # Debug print
            print("With vehicle_id:", vehicle.vehicle_id)  # Debug print

            cursor.execute(query, (vehicle.vehicle_id,))
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