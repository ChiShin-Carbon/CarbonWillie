from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

Electricity_Usage = APIRouter()


@Electricity_Usage.post("/Electricity_Usage")
def read_user_credentials():
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using a parameterized query to prevent SQL injection
            query = "SELECT * FROM Electricity_Usage"
            cursor.execute(query)
            
            # Fetch all records for the user
            user_records = cursor.fetchall()
            conn.close()

            if user_records:
                # Convert each record to a dictionary
                result = [
                    {
                        "electricity_id": record[0],
                        "user_id": record[1],
                        "Doc_date": record[2],
                        "Doc_number": record[3],
                        "period_start": record[4],  # Assuming oil_species is a BIT (True/False)
                        "period_end": record[5],
                        "electricity_type": float(record[6]),
                        "usage": float(record[7]),
                        "amount": float(record[8]),
                        "carbon_emission": record[9],
                        "remark": record[10],
                        "img_path": record[11],
                        "edit_time": record[12].strftime("%Y-%m-%d %H:%M") if len(record) > 10 and record[12] else None,
                    }
                    for record in user_records
                ]
                return {"Electricity_Usage": result}
            else:
                # Raise a 404 error if user has no vehicles
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No Electricity_Usage found for this user")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading user credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
