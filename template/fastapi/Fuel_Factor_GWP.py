from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

Fuel_Factors = APIRouter()


def format_scientific(value):
    if value is None:
        return None
    
    try:
        # Convert to float first, then format to scientific notation
        num_value = float(str(value).replace(',', ''))
        # Format using scientific notation with 8 decimal places
        return '{:.8e}'.format(num_value)
    except (ValueError, TypeError):
        # If conversion fails, return as string
        return str(value)

@Fuel_Factors.post("/Fuel_Factors")
def read_user_credentials():
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            query = "SELECT * FROM Fuel_Factors"
            cursor.execute(query)
            
            user_records = cursor.fetchall()
            conn.close()

            if user_records:
                result = [
                    {
                        "fuel_factor_id": record[0],
                        "FuelType": record[1],
                        "CO2_Emission": format_scientific(record[2]),
                        "CH4_Emission": format_scientific(record[3]), 
                        "N2O_Emission": format_scientific(record[4]),
                        "LHV": record[5],
                        "CO2_Total": format_scientific(record[6]),
                        "CH4_Total": format_scientific(record[7]),
                        "N2O_Total": format_scientific(record[8]),
                        "updata_time": record[9].strftime("%Y-%m-%d %H:%M") if record[9] else None,
                    }
                    for record in user_records
                ]
                return {"Fuel_Factors": result}
            else:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No Fuel_Factors found for this user")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading user credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")