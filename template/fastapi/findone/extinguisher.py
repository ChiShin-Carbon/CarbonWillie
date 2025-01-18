from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

Extinguisher_findone = APIRouter()

class ExtinguisherRequest(BaseModel):
    Extinguisher_id: int


@Extinguisher_findone.post("/Extinguisher_findone")
def read_user_credentials(request: ExtinguisherRequest):
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using a parameterized query to prevent SQL injection
            query = "SELECT * FROM Extinguisher WHERE extinguisher_id = ?"
            cursor.execute(query, (request.Extinguisher_id,))
            
            # Fetch all records for the user
            user_records = cursor.fetchall()
            conn.close()

            if user_records:
                # Convert each record to a dictionary
                result = [
                    {
                        "extinguisher_id": record[0],
                        "user_id": record[1],
                        "item_name": record[2],
                        "ingredient": record[3],
                        "specification": float(record[4]),  
                        "remark": record[5],
                        "img_path": record[6],
                        "edit_time": record[7].strftime("%Y-%m-%d %H:%M"),
                    }
                    for record in user_records
                ]
                return {"Extinguisher": result}
            else:
                # Raise a 404 error if user has no Emergency_Gnerator
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No Extinguisher found for this user")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading user credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
