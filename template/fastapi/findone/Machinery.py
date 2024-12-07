from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel

Machinery_findone = APIRouter()

class MachineryRequest(BaseModel):
    Machinery_id: int

@Machinery_findone.post("/Machinery_findone")
def read_user_credentials(request: MachineryRequest):
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        try:
            cursor = conn.cursor()
            # Parameterized SQL query
            query = "SELECT * FROM Machinery WHERE machinery_id = ?"
            cursor.execute(query, (request.Machinery_id,))
            
            # Fetch the records
            user_records = cursor.fetchall()
            conn.close()

            if user_records:
                # Convert each record to a dictionary
                result = [
                    {
                        "machinery_id": record[0],
                        "user_id": record[1],
                        "Doc_date": record[2],  # Directly pass None if record[2] is None
                        "Doc_number": record[3],
                        "machinery_location": record[4] if record[4] else None,  # Handle None values
                        "energy_type": record[5] if record[5] else None,  # Handle None values
                        "usage": float(record[6]) if record[6] is not None else None,  # Handle None values
                        "remark": record[7],
                        "img_path": record[8],
                        "edit_time": record[9].strftime("%Y-%m-%d %H:%M") if record[9] else None,
                    }
                    for record in user_records
                ]
                return {"Machinery": result}
            else:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail="No Machinery found for this user"
                )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail=f"Error reading user credentials: {e}"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Could not connect to the database."
        )
