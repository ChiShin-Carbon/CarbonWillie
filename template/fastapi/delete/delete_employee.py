from fastapi import APIRouter, HTTPException
from connect.connect import connectDB

delete_employee = APIRouter()

@delete_employee.delete("/delete_employee")
async def delete_employee_record(employee_id: int):
    # Connect to the database
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # SQL query to delete the record based on employee_id
            query = """
                DELETE FROM Employee
                WHERE id = ?
            """
            print("Executing query:", query)  # Debug print
            print("With employee_id:", employee_id)  # Debug print

            cursor.execute(query, (employee_id,))
            conn.commit()

            # Check if any row was deleted
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Employee record not found")

            return {"status": "success", "message": "Employee record deleted successfully"}

        except Exception as e:
            print("Database error:", e)  # Log specific error
            raise HTTPException(status_code=500, detail=f"Database delete error: {e}")
        finally:
            cursor.close()
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Database connection error")
