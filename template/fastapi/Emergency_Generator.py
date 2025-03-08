from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB

Emergency_Generator = APIRouter()

@Emergency_Generator.post("/Emergency_Generator")
def read_user_credentials():
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using a parameterized query to prevent SQL injection
            query = """
            SELECT Emergency_Generator.generator_id, Emergency_Generator.user_id, Emergency_Generator.Doc_date, 
                   Emergency_Generator.Doc_number, Emergency_Generator.usage, Emergency_Generator.remark, 
                   Emergency_Generator.img_path, Emergency_Generator.edit_time, users.username
            FROM Emergency_Generator
            LEFT JOIN users ON Emergency_Generator.user_id = users.user_id
            """
            cursor.execute(query)
            
            # Fetch all records for the user
            user_records = cursor.fetchall()
            conn.close()

            if user_records:
                # Convert each record to a dictionary
                result = [
                    {
                        "generator_id": record[0],
                        "user_id": record[1],
                        "Doc_date": record[2],
                        "Doc_number": record[3],
                        "usage": float(record[4]),  
                        "remark": record[5],
                        "img_path": record[6],
                        "edit_time": record[7].strftime("%Y-%m-%d %H:%M"),
                        "username": record[8]
                    }
                    for record in user_records
                ]
                return {"Emergency_Generator": result}
            else:
                # Raise a 404 error if user has no Emergency_Generator
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No Emergency_Generator found for this user")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading user credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")