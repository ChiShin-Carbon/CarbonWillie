from fastapi import APIRouter, HTTPException, Body
from connect.connect import connectDB
from pydantic import BaseModel

# Define models for the request bodies
class ExtinguisherDelete(BaseModel):
    extinguisher_id: int

class FillRecDelete(BaseModel):
    fillrec_id: int

# Create router
delete_router = APIRouter(tags=["delete"])

# Endpoint to delete extinguisher
@delete_router.delete("/delete_Extinguisher")
async def delete_extinguisher_record(data: ExtinguisherDelete = Body(...)):
    # Connect to the database
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # First delete all related fill records (assuming on_delete cascade is not set)
            fill_query = """
                DELETE FROM Extinguisher_FillRec
                WHERE extinguisher_id = ?
            """
            cursor.execute(fill_query, (data.extinguisher_id,))
            
            # Now delete the extinguisher record
            query = """
                DELETE FROM Extinguisher
                WHERE extinguisher_id = ?
            """
            print("Executing query:", query)  # Debug print
            print("With extinguisher_id:", data.extinguisher_id)  # Debug print

            cursor.execute(query, (data.extinguisher_id,))
            conn.commit()

            # Check if any row was deleted
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Extinguisher record not found")

            return {"status": "success", "message": "Extinguisher record deleted successfully"}

        except Exception as e:
            print("Database error:", e)  # Log specific error
            raise HTTPException(status_code=500, detail=f"Database delete error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")

# Endpoint to delete fill record
@delete_router.delete("/delete_ExtinguisherFill")
async def delete_fill_record(data: FillRecDelete = Body(...)):
    # Connect to the database
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # SQL query to delete the fill record
            query = """
                DELETE FROM Extinguisher_FillRec
                WHERE fillrec_id = ?
            """
            print("Executing query:", query)  # Debug print
            print("With fillrec_id:", data.fillrec_id)  # Debug print

            cursor.execute(query, (data.fillrec_id,))
            conn.commit()

            # Check if any row was deleted
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Fill record not found")

            return {"status": "success", "message": "Fill record deleted successfully"}

        except Exception as e:
            print("Database error:", e)  # Log specific error
            raise HTTPException(status_code=500, detail=f"Database delete error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")