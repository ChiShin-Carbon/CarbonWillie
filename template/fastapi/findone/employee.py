from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel

employee_findone = APIRouter()

class EmployeeRequest(BaseModel):
    Employee_id: int

@employee_findone.post("/employee_findone")
def read_employee_data(request: EmployeeRequest):
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        try:
            # Use a context manager to ensure connection closes after use
            with conn.cursor() as cursor:
                # Secure SQL query using a parameterized query to prevent SQL injection
                query = """
                
                SELECT Employee.employee_id, Employee.user_id, Employee.period_date, Employee.employee_number, Employee.daily_hours, Employee.workday, Employee.overtime, Employee.sick_leave, Employee.personal_leave, Employee.business_trip, Employee.wedding_and_funeral, Employee.special_leave, Employee.remark, Employee.img_path, Employee.edit_time
                FROM Employee
                WHERE Employee.employee_id = ?
                """  # Update table name if needed
                cursor.execute(query, (request.Employee_id,))  # Use the user's input in the query

                
                # Fetch all employee records
                employee_records = cursor.fetchall()

                if employee_records:
                    # Convert each record to a dictionary format
                    result = [
                        {
                            "employee_id": record[0],
                            "user_id": record[1],
                            "period_date": str(record[2]),  # Convert to string if it's a date
                            "employee_number": record[3],
                            "daily_hours": record[4],
                            "workday": record[5], 
                            "overtime": float(record[6]),
                            "sick_leave": record[7],
                            "personal_leave": record[8],
                            "business_trip": record[9],
                            "wedding_and_funeral": record[10],
                            "special_leave": record[11],
                            "remark": record[12],
                            "img_path": record[13],
                            "edit_time": record[14].strftime("%Y-%m-%d %H:%M") if record[8] else None,
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
