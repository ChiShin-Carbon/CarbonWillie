from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

Electricity_findone = APIRouter()

class ElectricityRequest(BaseModel):
    Electricity_id: int


@Electricity_findone.post("/Electricity_findone")
def read_electricity_fill(request: ElectricityRequest):
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using a parameterized query to prevent SQL injection
            query = "SELECT * FROM Electricity WHERE electricity_id = ?"
            cursor.execute(query, (request.Electricity_id,))
            
            # Fetch the record
            records = cursor.fetchall()
            conn.close()

            if records:
                # Convert each record to a dictionary
                result = [
                    {
                        "electricity_id": record[0],
                        "user_id": record[1],
                        "customer_number": record[2],
                        "remark": record[3],
                        "edit_time": record[4].strftime("%Y-%m-%d %H:%M") if record[4] else None,
                    }
                    for record in records
                ]
                return {"Electricity": result}
            else:
                # Raise a 404 error if no record found
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                                   detail="No electricity record found with this ID")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                               detail=f"Error reading electricity record: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                           detail="Could not connect to the database.")