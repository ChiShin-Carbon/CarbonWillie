from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


userinfo = APIRouter()

class User(BaseModel):
    user_id: int

@userinfo.post("/userinfo")
def read_user_credentials(user: User):
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using parameterized query to prevent SQL injection
            query = "SELECT address,business_id, username, email, telephone, phone, department, position, role FROM users WHERE user_id = ?"
            cursor.execute(query, (user.user_id,))  # Use the user's input in the query, tuple with trailing comma for a single item
            user_record = cursor.fetchone()
            conn.close()

            if user_record:
                # Convert the result into a dictionary
                result = {
                    "address": user_record[0],
                    "business_id": user_record[1],
                    "username": user_record[2],
                    "email": user_record[3],
                    "telephone": user_record[4],
                    "phone": user_record[5],
                    "department": user_record[6],
                    "position": user_record[7],
                    "role": user_record[8]
                }
                return {"user": result}  
            else:
                # Raise a 404 error if user not found
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading user credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
