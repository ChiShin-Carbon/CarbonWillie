from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel

NonEmployee = APIRouter()

@NonEmployee.post("/NonEmployee")
def read_employee_data():
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        try:
            # Use a context manager to ensure connection closes after use
            with conn.cursor() as cursor:
                # Secure SQL query using a parameterized query to prevent SQL injection
                query = """
                SELECT NonEmployee.nonemployee_id, NonEmployee.user_id, NonEmployee.period_date, NonEmployee.nonemployee_number, NonEmployee.total_hours, NonEmployee.total_days, NonEmployee.remark, NonEmployee.img_path, NonEmployee.edit_time 
                , users.username
                FROM NonEmployee LEFT JOIN users ON NonEmployee.user_id = users.user_id
                """
                cursor.execute(query)
                
                # Fetch all NonEmployee records
                NonEmployee_records = cursor.fetchall()

                if NonEmployee_records:
                    # Convert each record to a dictionary format
                    result = [
                        {
                            "nonemployee_id": record[0],
                            "user_id": str(record[1]),  # Convert to string if it's a date
                            "period_date": record[2],
                            "nonemployee_number": record[3],
                            "total_hours": record[4],  # Assuming workday is a BIT (0/1)
                            "total_days": float(record[5]),
                            "remark": record[6],
                            "img_path": record[7],
                            "edit_time": record[8].strftime("%Y-%m-%d %H:%M"),
                            "username": record[9]
                        }
                        for record in NonEmployee_records
                    ]
                    return {"Nonemployees": result}
                else:
                    # Return 404 error if no employee records found
                    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No employee records found.")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error retrieving employee data: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
