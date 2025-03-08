from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

ElectricityUsage_findone = APIRouter()

class ElectricityFillRequest(BaseModel):
    ElectricityFill_id: int


@ElectricityUsage_findone.post("/ElectricityFill_findone")
def read_electricity_fill(request: ElectricityFillRequest):
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using a parameterized query to prevent SQL injection
            query = "SELECT * FROM Electricity_Usage WHERE usage_id = ?"
            cursor.execute(query, (request.ElectricityFill_id,))
            
            # Fetch the record
            fill_records = cursor.fetchall()
            conn.close()

            if fill_records:
                # Convert each record to a dictionary
                result = [
                    {
                        "usage_id": record[0],
                        "electricity_id": record[1],
                        "user_id": record[2],
                        "Doc_date": record[3],
                        "Doc_number": record[4],
                        "period_start": record[5],
                        "period_end": record[6],
                        "electricity_type": record[7],
                        "usage": float(record[8]) if record[8] is not None else 0,
                        "amount": float(record[9]) if record[9] is not None else 0,
                        "carbon_emission": float(record[10]) if record[10] is not None else 0,
                        "remark": record[11],
                        "img_path": record[12],
                        "edit_time": record[13].strftime("%Y-%m-%d %H:%M") if record[13] else None,
                    }
                    for record in fill_records
                ]
                return {"ElectricityFill": result}
            else:
                # Raise a 404 error if no record found
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                                   detail="No electricity usage record found with this ID")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                               detail=f"Error reading electricity usage record: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                           detail="Could not connect to the database.")