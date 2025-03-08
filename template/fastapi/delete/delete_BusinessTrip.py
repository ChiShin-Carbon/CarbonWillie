from fastapi import APIRouter, HTTPException, Body
from connect.connect import connectDB
from pydantic import BaseModel

# Define model for the request body
class BusinessTripDelete(BaseModel):
    business_id: int

delete_BusinessTrip = APIRouter()

@delete_BusinessTrip.delete("/delete_BusinessTrip")
async def delete_business_trip_record(data: BusinessTripDelete = Body(...)):
    # Connect to the database
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # SQL query to delete the record based on business_id
            query = """
                DELETE FROM Business_Trip
                WHERE businesstrip_id = ?
            """
            print("Executing query:", query)  # Debug print
            print("With business_id:", data.business_id)  # Debug print

            cursor.execute(query, (data.business_id,))
            conn.commit()

            # Check if any row was deleted
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Business trip record not found")

            return {"status": "success", "message": "Business trip record deleted successfully"}

        except Exception as e:
            print("Database error:", e)  # Log specific error
            raise HTTPException(status_code=500, detail=f"Database delete error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")