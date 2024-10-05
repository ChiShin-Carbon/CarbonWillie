from fastapi import APIRouter
from connect.connect import connectDB
router = APIRouter()

@router.get("/users")
def read_users():
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        cursor.execute("SELECT user_id, business_id, username, email, telephone, phone, department, position, address, password FROM users")  # Query the users1 table
        users = cursor.fetchall()
        conn.close()

        # Convert rows into a list of dictionaries
        user_list = []
        for row in users:
            user_dict = {
                "user_id": row[0],
                "business_id": row[1],
                "username": row[2],
                "email": row[3],
                "telephone": row[4],
                "phone": row[5],
                "department": row[6],
                "position": row[7],
                "address": row[8],
                "password": row[9]
            }
            user_list.append(user_dict)

        return {"users": user_list}

    else:
        return {"error": "Could not connect to the database."}
@router.post("/create/")
def create_user(name: str):
    conn = connectDB()
    if conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO test (name) VALUES (?)", name)
        conn.commit()
        conn.close()
        return {"success": "User created successfully!"}
    else:
        return {"error": "Could not connect to the database."}
