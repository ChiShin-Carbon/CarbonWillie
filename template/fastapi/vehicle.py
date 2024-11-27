from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

vehicle = APIRouter()


@vehicle.post("/vehicle")
def read_user_credentials():
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using a parameterized query to prevent SQL injection
            query = """
            SELECT Vehicle.vehicle_id, Vehicle.user_id, Vehicle.Doc_date, Vehicle.Doc_number, Vehicle.oil_species, Vehicle.liters, Vehicle.remark, Vehicle.img_path, Vehicle.edit_time
            , users.username
            FROM Vehicle
            LEFT JOIN users ON Vehicle.user_id = users.user_id
            """
            cursor.execute(query)
            
            # Fetch all records for the user
            user_records = cursor.fetchall()
            conn.close()

            if user_records:
                # Convert each record to a dictionary
                result = [
                    {
                        "vehicle_id": record[0],
                        "user_id": record[1],
                        "Doc_date": record[2],
                        "Doc_number": record[3],
                        "oil_species": bool(record[4]),  # Assuming oil_species is a BIT (True/False)
                        "liters": float(record[5]),
                        "remark": record[6],
                        "img_path": record[7],
                        "edit_time": record[8].strftime("%Y-%m-%d %H:%M"),
                        "username": record[9]
                    }
                    for record in user_records
                ]
                return {"vehicles": result}
            else:
                # Raise a 404 error if user has no vehicles
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No vehicles found for this user")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading user credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
