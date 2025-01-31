from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

RefFill_findone = APIRouter()

class RefRequest(BaseModel):
    Fill_id: int


@RefFill_findone.post("/RefFill_findone")
def read_user_credentials(request: RefRequest):
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using a parameterized query to prevent SQL injection
            query = "SELECT * FROM Refrigerant_FillRec WHERE fillrec_id = ?"
            cursor.execute(query, (request.Fill_id,))
            
            # Fetch all records for the user
            user_records = cursor.fetchall()
            conn.close()

            if user_records:
                # Convert each record to a dictionary
                result = [
                    {
                        "fillrec_id": record[0],
                        "refrigerant_id": record[1] if record[1] else None,
                        "user_id": record[2],
                        "Doc_date": record[3],
                        "Doc_number": record[4],
                        "usage": record[5],
                        "escape_rate": record[6],
                        "remark": record[7],
                        "img_path": record[8],
                        "edit_time": record[9].strftime("%Y-%m-%d %H:%M"),
                    }
                    for record in user_records
                ]
                return {"RefFill": result}
            else:
                # Raise a 404 error if user has no Emergency_Gnerator
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No RefFill found for this user")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading user credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
