from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel

employee = APIRouter()

@employee.post("/employee")
def read_employee_data():
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        try:
            # Use a context manager to ensure connection closes after use
            with conn.cursor() as cursor:
                # Secure SQL query using a parameterized query to prevent SQL injection
                query = "SELECT * FROM Employee"  # Update table name if needed
                cursor.execute(query)
                
                # Fetch all employee records
                employee_records = cursor.fetchall()

                if employee_records:
                    # Convert each record to a dictionary format
                    result = [
                        {
                            "user_id": record[0],
                            "period_date": str(record[1]),  # Convert to string if it's a date
                            "employee_number": record[2],
                            "daily_hours": record[3],
                            "workday": bool(record[4]),  # Assuming workday is a BIT (0/1)
                            "overtime": float(record[5]),
                            "sick_leave": record[6],
                            "personal_leave": record[7],
                            "business_trip": record[8],
                            "wedding_and_funeral": record[9],
                            "special_leave": record[10],
                            "remark": record[11],
                            "img_path": record[12],
                            "edit_time": str(record[13]),  # Convert datetime to string if necessary
                        }
                        for record in employee_records
                    ]
                    return {"employees": result}
                else:
                    # Return 404 error if no employee records found
                    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No employee records found.")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error retrieving employee data: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
