from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

Fuel_Factors = APIRouter()


@Fuel_Factors.post("/Fuel_Factors")
def read_user_credentials():
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using a parameterized query to prevent SQL injection
            query = "SELECT * FROM Fuel_Factors"
            cursor.execute(query)
            
            # Fetch all records for the user
            user_records = cursor.fetchall()
            conn.close()

            if user_records:
                # Convert each record to a dictionary
                result = [
                    {
                        "fuel_factor_id": record[0],
                        "FuelType": record[1],
                        "CO2_Emission": "{:.2E}".format(float(record[2])),
                        "CH4_Emission": "{:.2E}".format(float(record[3])),
                        "N2O_Emission": "{:.2E}".format(float(record[4])),
                        "LHV": record[5],
                        "CO2_Total": "{:.2E}".format(float(record[6])),
                        "CH4_Total": "{:.2E}".format(float(record[7])),
                        "N2O_Total": "{:.2E}".format(float(record[8])),
                        "updata_time":record[9].strftime("%Y-%m-%d %H:%M") if record[9] else None,
                    }
                    for record in user_records
                ]
                return {"Fuel_Factors": result}
            else:
                # Raise a 404 error if user has no Emergency_Gnerator
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No Fuel_Factors found for this user")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading user credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
