from fastapi import APIRouter, HTTPException, status, Depends, Form
from connect.connect import connectDB
from typing import List, Optional
from pydantic import BaseModel

Authorized_table = APIRouter()

class AuthorizedTableItem(BaseModel):
    user_id: int


@Authorized_table.post("/authorized-tables")
async def read_user_credentials(
    user_id: int = Form(...),
):
    print(user_id)
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using a parameterized query to prevent SQL injection
            query = """
            SELECT authorized_record_id, user_id, table_name, is_done, 
                   completed_at, review
            FROM Authorized_Table
            WHERE user_id = ?
            """
            cursor.execute(query, (user_id,))
            
            # Fetch all authorized tables for the user
            authorized_records = cursor.fetchall()
            conn.close()

            if authorized_records:
                # Convert each record to a dictionary
                result = [
                    {
                        "authorized_record_id": record[0],
                        "user_id": record[1],
                        "table_name": record[2],
                        "is_done": bool(record[3]),  # Convert BIT to boolean
                        "completed_at": record[4].strftime("%Y-%m-%d %H:%M") if record[4] else None,
                        "review": record[5]
                    }
                    for record in authorized_records
                ]
                return result
            else:
                # If no authorized tables found, return an empty list
                return []
        
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail=f"Error fetching authorized tables: {e}"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Could not connect to the database."
        )

@Authorized_table.post("/authorized-tables")
def create_authorized_table(user_id: int, table_name: str, review: int = 1):
    """
    Create a new authorized table entry for a user.
    """
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            query = """
            INSERT INTO Authorized_Table (user_id, table_name, is_done, completed_at, review)
            VALUES (?, ?, 0, NULL, ?)
            """
            cursor.execute(query, (user_id, table_name, review))
            conn.commit()
            
            # Get the ID of the newly created record
            cursor.execute("SELECT @@IDENTITY")
            new_id = cursor.fetchone()[0]
            
            conn.close()
            return {"message": "Authorized table created successfully", "authorized_record_id": new_id}
        except Exception as e:
            conn.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail=f"Error creating authorized table: {e}"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Could not connect to the database."
        )

@Authorized_table.put("/authorized-tables/{authorized_record_id}")
def update_authorized_table(authorized_record_id: int, is_done: bool):
    """
    Update the completion status of an authorized table.
    """
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            # Update is_done status and completed_at time if marked as done
            if is_done:
                query = """
                UPDATE Authorized_Table 
                SET is_done = 1, completed_at = GETDATE()
                WHERE authorized_record_id = ?
                """
            else:
                query = """
                UPDATE Authorized_Table 
                SET is_done = 0, completed_at = NULL
                WHERE authorized_record_id = ?
                """
            
            cursor.execute(query, (authorized_record_id,))
            conn.commit()
            
            # Check if any rows were affected
            if cursor.rowcount == 0:
                conn.close()
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail=f"Authorized table with ID {authorized_record_id} not found"
                )
            
            conn.close()
            return {"message": "Authorized table updated successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail=f"Error updating authorized table: {e}"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Could not connect to the database."
        )

@Authorized_table.delete("/authorized-tables/{authorized_record_id}")
def delete_authorized_table(authorized_record_id: int):
    """
    Remove an authorized table entry.
    """
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            query = """
            DELETE FROM Authorized_Table 
            WHERE authorized_record_id = ?
            """
            
            cursor.execute(query, (authorized_record_id,))
            conn.commit()
            
            # Check if any rows were affected
            if cursor.rowcount == 0:
                conn.close()
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail=f"Authorized table with ID {authorized_record_id} not found"
                )
            
            conn.close()
            return {"message": "Authorized table deleted successfully"}
        except Exception as e:
            conn.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail=f"Error deleting authorized table: {e}"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Could not connect to the database."
        )

# Endpoint to get all authorized tables for management purposes
@Authorized_table.get("/authorized-tables")
def get_all_authorized_tables():
    """
    Fetch all authorized tables with user information for admin management.
    """
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            query = """
            SELECT a.authorized_record_id, a.user_id, a.table_name, a.is_done, 
                   a.completed_at, a.review, u.username
            FROM Authorized_Table a
            JOIN users u ON a.user_id = u.user_id
            ORDER BY u.username, a.table_name
            """
            cursor.execute(query)
            
            records = cursor.fetchall()
            conn.close()

            result = [
                {
                    "authorized_record_id": record[0],
                    "user_id": record[1],
                    "table_name": record[2],
                    "is_done": bool(record[3]),
                    "completed_at": record[4].strftime("%Y-%m-%d %H:%M") if record[4] else None,
                    "review": record[5],
                    "username": record[6]
                }
                for record in records
            ]
            return result
        
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail=f"Error fetching all authorized tables: {e}"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Could not connect to the database."
        )