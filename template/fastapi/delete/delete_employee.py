from fastapi import APIRouter, HTTPException, Body
from connect.connect import connectDB
from pydantic import BaseModel

# Define model for the request body
class EmployeeDelete(BaseModel):
    employee_id: int

delete_employee = APIRouter(tags=['delete'])

@delete_employee.delete("/delete_employee")
async def delete_employee_record(data: EmployeeDelete = Body(...)):
    # Connect to the database
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # SQL query to delete the record based on employee_id
            query = """
                DELETE FROM Employee
                WHERE employee_id = ?
            """
            print("Executing query:", query)  # Debug print
            print("With employee_id:", data.employee_id)  # Debug print

            cursor.execute(query, (data.employee_id,))
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