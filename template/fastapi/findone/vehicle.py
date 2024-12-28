from fastapi import APIRouter, HTTPException, status, Depends
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List

vehicle_findone = APIRouter()  # Renamed to avoid conflict with `vehicle` model

class VehicleRequest(BaseModel):
    vehicle_id: int

class VehicleResponse(BaseModel):
    vehicle_id: int
    user_id: int
    Doc_date: Optional[str]
    Doc_number: Optional[str]
    oil_species: bool
    liters: float
    remark: Optional[str]
    img_path: Optional[str]
    edit_time: Optional[str]

@vehicle_findone.post("/vehicle_findone", response_model=List[VehicleResponse])
def find_vehicle(request: VehicleRequest):
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using parameterized query to prevent SQL injection
            query = """
            SELECT Vehicle.vehicle_id, Vehicle.user_id, Vehicle.Doc_date, Vehicle.Doc_number, Vehicle.oil_species, Vehicle.liters, Vehicle.remark, Vehicle.img_path, Vehicle.edit_time
            FROM Vehicle
            WHERE Vehicle.vehicle_id = ?
            """
            cursor.execute(query, (request.vehicle_id,))  # Use the user's input in the query
            
            # Fetch all matching records
            vehicle_records = cursor.fetchall()
            conn.close()

            if vehicle_records:
                # Convert each record to a dictionary for serialization
                result = [
                    {
                        "vehicle_id": record[0],
                        "user_id": record[1],
                        "Doc_date": record[2].strftime("%Y-%m-%d") if record[2] else None,
                        "Doc_number": record[3],
                        "oil_species": bool(record[4]),  # Assuming oil_species is a BIT (True/False)
                        "liters": float(record[5]),
                        "remark": record[6],
                        "img_path": record[7],
                        "edit_time": record[8].strftime("%Y-%m-%d %H:%M") if record[8] else None,
                    }
                    for record in vehicle_records
                ]
                return result
            else:
                # Raise a 404 error if no vehicle matches
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No vehicle found with the given ID.")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error retrieving vehicle: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
