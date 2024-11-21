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
                    e.extinguisher_id, e.user_id, u.username, e.item_name, e.ingredient,
                    e.specification, e.remark, e.img_path, e.edit_time,
                    f.fillrec_id, f.Doc_date, f.Doc_number, f.usage, f.remark AS fillrec_remark,
                    f.img_path AS fillrec_img_path, f.user_id AS fillrec_user_id, uf.username AS fillrec_username,
                    f.edit_time AS fillrec_edit_time
                FROM Extinguisher e
                LEFT JOIN Extinguisher_FillRec f ON e.extinguisher_id = f.extinguisher_id
                LEFT JOIN users u ON e.user_id = u.user_id
                LEFT JOIN users uf ON f.user_id = uf.user_id
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
                        "username": record[2],
                        "item_name": record[3],
                        "ingredient": record[4],
                        "specification": record[5],  # Assuming BIT field
                        "remark": record[6],
                        "img_path": record[7],
                        "edit_time": record[8],
                        "fillrec": {
                            "fillrec_id": record[9],
                            "Doc_date": record[10],
                            "Doc_number": record[11],
                            "usage": record[12],
                            "fillrec_remark": record[13],
                            "fillrec_img_path": record[14],
                            "fillrec_user_id": record[15],
                            "fillrec_username": record[16],
                            "fillrec_edit_time": record[17],
                        } if record[9] else None  # If no fillrec_id, set to None
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
