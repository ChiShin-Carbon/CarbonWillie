from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

Business_Trip_findone = APIRouter()
class BTRequest(BaseModel):
    BT_id: int


@Business_Trip_findone.post("/Business_Trip_findone")
def read_user_credentials(request: BTRequest):
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using a parameterized query to prevent SQL injection
            query = "SELECT * FROM Business_Trip where businesstrip_id = ?"
            cursor.execute(query, (request.BT_id,))
            
            # Fetch all records for the user
            user_records = cursor.fetchall()
            conn.close()

            if user_records:
                # Convert each record to a dictionary
                result = [
                    {
                        "business_id": record[0],
                        "user_id": record[1],
                        "transportation": record[2],
                        "oil_species": bool(record[3]),  # Assuming oil_species is a BIT (True/False)
                        "kilometer": float(record[4]),
                        "remark": record[5],
                        "img_path": record[6],  # Assuming oil_species is a BIT (True/False)
                        "edit_time": record[7],
                    }
                    for record in user_records
                ]
                return {"Business_Trip": result}
            else:
                # Raise a 404 error if user has no vehicles
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No Business_Trip found for this user")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading user credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
