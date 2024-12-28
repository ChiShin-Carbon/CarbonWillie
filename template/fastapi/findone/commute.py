from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

Commute_findone = APIRouter()

class commuteRequest(BaseModel):
    commuteRequest_id: int


@Commute_findone.post("/Commute_findone")
def read_user_credentials(request: commuteRequest):
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using a parameterized query to prevent SQL injection
            query = "SELECT * FROM Commute where commute_id = ?"
            cursor.execute(query, (request.commuteRequest_id,))
            
            # Fetch all records for the user
            user_records = cursor.fetchall()
            conn.close()

            if user_records:
                # Convert each record to a dictionary
                result = [
                    {
                        "commute_id": record[0],
                        "user_id": record[1],
                        "transportation": record[2],
                        "oil_species": bool(record[3]),  # Assuming oil_species is a BIT (True/False)
                        "kilometer": float(record[4]),
                        "remark": record[5],
                        "img_path": record[6],  # Assuming oil_species is a BIT (True/False)
                        "edit_time": record[7].strftime("%Y-%m-%d %H:%M"),
                    }
                    for record in user_records
                ]
                return {"Commute": result}
            else:
                # Raise a 404 error if user has no vehicles
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No Commute found for this user")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading user credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
