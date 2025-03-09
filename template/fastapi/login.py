from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


login = APIRouter()

class User(BaseModel):
    address: str
    password: str

@login.post("/login")
def read_user_credentials(user: User):
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using parameterized query to prevent SQL injection
            query = "SELECT user_id, address, password, username,department, position, role FROM users WHERE address = ? AND password = ?"
            cursor.execute(query, (user.address, user.password))  # Use the user's input in the query
            user_record = cursor.fetchone()
            conn.close()

            if user_record:
                # Convert the result into a dictionary
                result = {"user_id": user_record[0], "address": user_record[1], "password": user_record[2], "username": user_record[3], "department": user_record[4], "position":user_record[5], "role":user_record[6]}
                return {"user": result}  
            else:
                # Raise a 404 error if user not found
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading user credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
