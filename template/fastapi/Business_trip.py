from fastapi import APIRouter, HTTPException, status
from connect.connect import connectDB

Business_Trip = APIRouter()

@Business_Trip.post("/Business_Trip")
def read_user_credentials():
    conn = connectDB()  # Establish connection using your custom connect function
    if conn:
        cursor = conn.cursor()
        try:
            # Secure SQL query using a parameterized query to prevent SQL injection
            query = """
            SELECT Business_Trip.businesstrip_id, Business_Trip.user_id, Business_Trip.transportation, 
                   Business_Trip.oil_species, Business_Trip.kilometers, Business_Trip.remark, 
                   Business_Trip.img_path, Business_Trip.edit_time, users.username
            FROM Business_Trip
            LEFT JOIN users ON Business_Trip.user_id = users.user_id
            """
            cursor.execute(query)
            
            # Fetch all records for the user
            user_records = cursor.fetchall()
            conn.close()

            if user_records:
                # Convert each record to a dictionary
                result = [
                    {
                        "business_id": record[0],
                        "user_id": record[1],
                        "transportation": record[2],
                        "oil_species": bool(record[3]),
                        "kilometer": float(record[4]),
                        "remark": record[5],
                        "img_path": record[6],
                        "edit_time": record[7].strftime("%Y-%m-%d %H:%M") if hasattr(record[7], 'strftime') else record[7],
                        "username": record[8]
                    }
                    for record in user_records
                ]
                return {"Business_Trip": result}
            else:
                # Raise a 404 error if user has no vehicles
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No Business_Trip found for this user")
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error reading user credentials: {e}")
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not connect to the database.")