from fastapi import APIRouter, HTTPException, status
import connect
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


edituserinfo = APIRouter()

class User(BaseModel):
    user_id: int
    username: str
    email: str
    telephone: str
    phone: str

@edituserinfo.post("/edituserinfo")
def read_user_credentials(user: User):
    conn = connect.connect()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using parameterized query to prevent SQL injection
            query = "update users set username = ?, email = ?, telephone = ?, phone = ? WHERE user_id = ?"
            cursor.execute(query, (user.username, user.email, user.telephone, user.phone, user.user_id))
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