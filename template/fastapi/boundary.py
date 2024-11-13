from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


boundary = APIRouter()

class Boundary(BaseModel):
    user_id: int
    field_name: str
    field_address: str
    is_inclusion: bool
    remark: str

@boundary.post("/boundary")
def create_boundary(boundary: Boundary):
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            query = """
                INSERT INTO Boundary (user_id, field_name, field_address, is_inclusion, remark)
                VALUES (?, ?, ?, ?, ?)
            """
            cursor.execute(query, (boundary.user_id, boundary.field_name, boundary.field_address, boundary.is_inclusion, boundary.remark))
            conn.commit()
            conn.close()
            return {"message": "Boundary created successfully"}
        
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error creating boundary: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")

@boundary.put("/boundary/{boundary_id}")
def update_boundary(boundary_id: int, boundary: Boundary):
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            query = """
                UPDATE Boundary
                SET user_id = ?, field_name = ?, field_address = ?, is_inclusion = ?, remark = ?
                WHERE boundary_id = ?
            """
            cursor.execute(query, (boundary.user_id, boundary.field_name, boundary.field_address, boundary.is_inclusion, boundary.remark, boundary_id))
            conn.commit()
            conn.close()
            return {"message": "Boundary updated successfully"}
        
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating boundary: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")

@boundary.delete("/boundary/{boundary_id}")
def delete_boundary(boundary_id: int):
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            query = "DELETE FROM Boundary WHERE boundary_id = ?"
            cursor.execute(query, (boundary_id,))
            conn.commit()
            conn.close()
            return {"message": "Boundary deleted successfully"}
        
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error deleting boundary: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")

@boundary.get("/boundary")
def read_boundary():
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        try:
            query = """
                SELECT baseline_id, field_name, field_address, is_inclusion, remark
                FROM Boundary 
                WHERE baseline_id = (
                SELECT TOP 1 baseline_id 
                FROM Baseline ORDER BY edit_time DESC
              )"""
            cursor.execute(query)
            boundary_record = cursor.fetchone()
            conn.close()

            if boundary_record:
                result = {
                    "field_name": boundary_record[0],
                    "field_address": boundary_record[1],
                    "is_inclusion": boundary_record[2],
                    "remark": boundary_record[3],
                    "method": boundary_record[4]
                }
                return {"boundary": result}  
            else:
                # Raise a 404 error if user not found
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Boundary not found")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading boundary credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
