from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

commute = APIRouter()


@commute.post("/commute")
def read_user_credentials():
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using a parameterized query to prevent SQL injection
            query = "SELECT * FROM Commute"
            cursor.execute(query)
            
            # Fetch all records for the user
            user_records = cursor.fetchall()
            conn.close()

            if user_records:
                # Convert each record to a dictionary, with added error handling for conversion
                result = []
                for record in user_records:
                    try:
                        # Safely convert kilometers to float and handle invalid entries
                        kilometers = float(record[5]) if record[5].replace('.', '', 1).isdigit() else None
                        if kilometers is None:
                            raise ValueError(f"Invalid kilometers value: {record[5]}")
                        
                        # Prepare result dictionary for the current record
                        result.append({
                            "commute_id": record[0],
                            "user_id": record[1],
                            "transportation": record[2],
                            "oil_species": record[3],
                            "kilometers": kilometers,
                            "remark": record[6],
                            "img_path": record[7],
                            "edit_time": record[8],
                        })
                    
                    except Exception as e:
                        # If an error occurs during processing a record, log it or raise an exception
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Error processing record: {str(e)}"
                        )

                return {"commute": result}
            else:
                # Raise a 404 error if no records are found
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No vehicles found for this user")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading user credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")
