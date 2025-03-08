from fastapi import APIRouter, HTTPException, Body
from connect.connect import connectDB
from pydantic import BaseModel

# Define models for the request bodies
class RefrigerantDelete(BaseModel):
    refrigerant_id: int

class RefrigerantFillDelete(BaseModel):
    fillrec_id: int

# Create router
delete_refrigerant = APIRouter()

# Endpoint to delete refrigerant
@delete_refrigerant.delete("/delete_refrigerant")
async def delete_refrigerant_record(data: RefrigerantDelete = Body(...)):
    # Connect to the database
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # First delete all related fill records (assuming on_delete cascade is not set)
            fill_query = """
                DELETE FROM Refrigerant_FillRec
                WHERE refrigerant_id = ?
            """
            cursor.execute(fill_query, (data.refrigerant_id,))
            
            # Now delete the refrigerant record
            query = """
                DELETE FROM Refrigerant
                WHERE refrigerant_id = ?
            """
            print("Executing query:", query)  # Debug print
            print("With refrigerant_id:", data.refrigerant_id)  # Debug print

            cursor.execute(query, (data.refrigerant_id,))
            conn.commit()

            # Check if any row was deleted
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Refrigerant record not found")

            return {"status": "success", "message": "Refrigerant record deleted successfully"}

        except Exception as e:
            print("Database error:", e)  # Log specific error
            raise HTTPException(status_code=500, detail=f"Database delete error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")

# Endpoint to delete fill record
@delete_refrigerant.delete("/delete_refrigerant_fill")
async def delete_refrigerant_fill_record(data: RefrigerantFillDelete = Body(...)):
    # Connect to the database
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # SQL query to delete the fill record
            query = """
                DELETE FROM Refrigerant_FillRec
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