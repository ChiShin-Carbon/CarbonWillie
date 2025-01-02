from fastapi import APIRouter, HTTPException
from connect.connect import connectDB

delete_machine = APIRouter()

@delete_machine.delete("/delete_machine")
async def delete_machine_record(machine_id: int):
    # Connect to the database
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # SQL query to delete the record based on machine_id
            query = """
                DELETE FROM Machine
                WHERE id = ?
            """
            print("Executing query:", query)  # Debug print
            print("With machine_id:", machine_id)  # Debug print

            cursor.execute(query, (machine_id,))
            conn.commit()

            # Check if any row was deleted
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Machine record not found")

            return {"status": "success", "message": "Machine record deleted successfully"}

        except Exception as e:
            print("Database error:", e)  # Log specific error
            raise HTTPException(status_code=500, detail=f"Database delete error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")
