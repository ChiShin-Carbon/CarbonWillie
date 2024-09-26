from fastapi import FastAPI
from route import router
from config.database import connect_to_mongo

app = FastAPI()

# Connect to MongoDB
connect_to_mongo()

# Include routers
app.include_router(test_router)

@app.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI MongoDB project!"}