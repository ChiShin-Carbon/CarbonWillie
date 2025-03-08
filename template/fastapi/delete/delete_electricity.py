from fastapi import APIRouter, HTTPException, Body
from connect.connect import connectDB
from pydantic import BaseModel

# Define models for the request bodies
class ElectricityDelete(BaseModel):
    electricity_id: int

class ElectricityUsageDelete(BaseModel):
    usage_id: int

# Create router
electricity_delete_router = APIRouter(tags=["delete"])

# Endpoint to delete electricity record
@electricity_delete_router.delete("/delete_Electricity")
async def delete_electricity_record(data: ElectricityDelete = Body(...)):
    # Connect to the database
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # First delete all related usage records (assuming on_delete cascade is not set)
            usage_query = """
                DELETE FROM Electricity_Usage
                WHERE electricity_id = ?
            """
            cursor.execute(usage_query, (data.electricity_id,))
            
            # Now delete the electricity record
            query = """
                DELETE FROM Electricity
                WHERE electricity_id = ?
            """
            print("Executing query:", query)  # Debug print
            print("With electricity_id:", data.electricity_id)  # Debug print

            cursor.execute(query, (data.electricity_id,))
            conn.commit()

            # Check if any row was deleted
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Electricity record not found")

            return {"status": "success", "message": "Electricity record deleted successfully"}

        except Exception as e:
            print("Database error:", e)  # Log specific error
            raise HTTPException(status_code=500, detail=f"Database delete error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")

# Endpoint to delete electricity usage record
@electricity_delete_router.delete("/delete_ElectricityUsage")
async def delete_electricity_usage_record(data: ElectricityUsageDelete = Body(...)):
    # Connect to the database
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # SQL query to delete the usage record
            query = """
                DELETE FROM Electricity_Usage
                WHERE usage_id = ?
            """
            print("Executing query:", query)  # Debug print
            print("With usage_id:", data.usage_id)  # Debug print

            cursor.execute(query, (data.usage_id,))
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