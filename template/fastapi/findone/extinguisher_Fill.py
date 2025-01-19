from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

ExtinguisherFill_findone = APIRouter()

class ExtinguisherFillRequest(BaseModel):
    ExtinguisherFill_id: int


@ExtinguisherFill_findone.post("/ExtinguisherFill_findone")
def read_user_credentials(request: ExtinguisherFillRequest):
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using a parameterized query to prevent SQL injection
            query = "SELECT * FROM Extinguisher_FillRec WHERE fillrec_id = ?"
            cursor.execute(query, (request.ExtinguisherFill_id,))
            
            # Fetch all records for the user
            user_records = cursor.fetchall()
            conn.close()

            if user_records:
                # Convert each record to a dictionary
                result = [
                    {
                        "fillrec_id": record[0],
                        "extinguisher_id": record[1],
                        "user_id": record[2],
                        "Doc_date": record[3],
                        "Doc_number": record[4],
                        "usage": float(record[5]),  
                        "remark": record[6],
                        "img_path": record[7],
                        "edit_time": record[8].strftime("%Y-%m-%d %H:%M"),
                    }
                    for record in user_records
                ]
                return {"ExtinguisherFill": result}
            else:
                # Raise a 404 error if user has no Emergency_Gnerator
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No Extinguisher found for this user")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading user credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
