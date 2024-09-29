from fastapi import APIRouter
import connect

router = APIRouter()

@router.get("/test/")
def read_users():
    conn = connect.connect()
    if conn:
        cursor = conn.cursor()
        cursor.execute("SELECT ID, name FROM test")  # Replace with your actual table query
        users = cursor.fetchall()
        conn.close()

        # Convert the result into a list of dictionaries
        result = [{"ID": row[0], "name": row[1]} for row in users]
        return result
    else:
        return {"error": "Could not connect to the database."}

@router.post("/create/")
def create_user(name: str):
    conn = connect.connect()
    if conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO test (name) VALUES (?)", name)
        conn.commit()
        conn.close()
        return {"success": "User created successfully!"}
    else:
        return {"error": "Could not connect to the database."}
