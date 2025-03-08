from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB

Machinery = APIRouter()

@Machinery.post("/Machinery")
def read_user_credentials():
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using a parameterized query to prevent SQL injection
            query = """
            SELECT Machinery.machinery_id, Machinery.user_id, Machinery.Doc_date, Machinery.Doc_number, 
                   Machinery.machinery_location, Machinery.energy_type, Machinery.usage, Machinery.remark, 
                   Machinery.img_path, Machinery.edit_time, users.username
            FROM Machinery
            LEFT JOIN users ON Machinery.user_id = users.user_id
            """
            cursor.execute(query)
            
            # Fetch all records for the user
            user_records = cursor.fetchall()
            conn.close()

            if user_records:
                # Convert each record to a dictionary, handling None values for `usage`
                result = [
                    {
                        "machinery_id": record[0],
                        "user_id": record[1],
                        "Doc_date": record[2],
                        "Doc_number": record[3],
                        "machinery_location": record[4],
                        "energy_type": record[5],
                        "usage": float(record[6]) if record[6] is not None else None,  # Handle None values for usage
                        "remark": record[7],
                        "img_path": record[8],
                        "edit_time": record[9].strftime("%Y-%m-%d %H:%M"),
                        "username": record[10]
                    }
                    for record in user_records
                ]
                return {"Machinery": result}
            else:
                # Raise a 404 error if no Machinery records are found
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No Machinery found for this user")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading user credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")