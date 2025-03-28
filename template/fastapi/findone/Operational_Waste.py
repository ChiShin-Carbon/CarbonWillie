from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

Operational_Waste_findone= APIRouter()
class OWRequest(BaseModel):
    OW_id: int


@Operational_Waste_findone.post("/Operational_Waste_findone")
def read_user_credentials(request: OWRequest):
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using a parameterized query to prevent SQL injection
            query = "SELECT * FROM Operational_Waste where waste_id = ?"
            cursor.execute(query, (request.OW_id,))
            
            # Fetch all records for the user
            user_records = cursor.fetchall()
            conn.close()

            if user_records:
                # Convert each record to a dictionary
                result = [
                    {
                        "waste_id": record[0],
                        "user_id": record[1],
                        "waste_item": record[2],
                        "remark": record[3],
                        "img_path": record[4],  # Assuming oil_species is a BIT (True/False)
                        "edit_time": record[5].strftime("%Y-%m-%d %H:%M"),
                    }
                    for record in user_records
                ]
                return {"Operational_Waste": result}
            else:
                # Raise a 404 error if user has no Operational_Waste
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No Operational_Waste found for this user")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading user credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
