from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional


edituserinfo = APIRouter()

class User(BaseModel):
    user_id: int
    username: str
    email: str
    telephone: Optional[str] = None
    phone: str
    role: bool

@edituserinfo.post("/edituserinfo")
def read_user_credentials(user: User):
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using parameterized query to prevent SQL injection
            if user.role == 0:
                query = "update users set username = ?, email = ?, phone = ? WHERE user_id = ?"
                value = (user.username, user.email, user.phone, user.user_id)
            else:
                query = "update users set username = ?, email = ?, telephone = ?, phone = ? WHERE user_id = ?"
                value = (user.username, user.email, user.telephone, user.phone, user.user_id)
            
            cursor.execute(query, value)
            conn.commit()  # Commit the changes


            if cursor.rowcount > 0:
                # If the update was successful
                return {"message": "User information updated successfully"}
            else:
                # Raise a 404 error if the user was not found
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating user credentials: {e}")
        finally:
            conn.close()  # Close the connection
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")