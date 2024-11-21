from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

extinguisher = APIRouter()

@extinguisher.get("/extinguisher")
def read_extinguisher():
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using a parameterized query to prevent SQL injection
            query = """
                SELECT 
                    e.extinguisher_id, e.user_id, e.item_name, e.ingredient,
                    e.specification, e.remark, e.img_path, e.edit_time,
                    f.fillrec_id, f.Doc_date, f.Doc_number, f.usage,
                    f.remark AS fillrec_remark, f.img_path AS fillrec_img_path, f.edit_time AS fillrec_edit_time
                FROM Extinguisher e
                LEFT JOIN Extinguisher_FillRec f 
                ON e.extinguisher_id = f.extinguisher_id
                """
            cursor.execute(query)
            
            # Fetch all records for the user
            extinguisher_records = cursor.fetchall()
            conn.close()

            if extinguisher_records:
                # Convert each record to a dictionary
                result = [
                    {
                        "extinguisher_id": record[0],
                        "user_id": record[1],
                        "item_name": record[2],
                        "ingredient": record[3],
                        "specification": bool(record[4]),  # Assuming BIT field
                        "remark": record[5],
                        "img_path": record[6],
                        "edit_time": record[7],
                        "fillrec": {
                            "fillrec_id": record[8],
                            "Doc_date": record[9],
                            "Doc_number": record[10],
                            "usage": record[11],
                            "fillrec_remark": record[12],
                            "fillrec_img_path": record[13],
                            "fillrec_edit_time": record[14],
                        } if record[8] else None  # If no fillrec_id, set to None
                    }
                    for record in extinguisher_records
                ]
                return {"extinguishers": result}
            else:
                # Raise a 404 error if user has no extinguishers
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No extinguishers found for this user")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading extinguishers credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
