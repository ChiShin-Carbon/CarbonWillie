import openai  # Correct import for the OpenAI package
import os
from dotenv import load_dotenv  # Import for loading environment variables
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastapi.concurrency import run_in_threadpool  # For running synchronous code

# Load environment variables
load_dotenv()

# Initialize FastAPI router
botapi = APIRouter()

# Define a request model for the incoming data
class MessageRequest(BaseModel):
    message: str

@botapi.post("/botapi")
async def botmessage(request: MessageRequest):
    # Validate if the message contains the word "碳"
    if "碳" not in request.message:
        return {"response": "請輸入和碳有關的問題。"}

    # Set the OpenAI API key
    openai.api_key = os.getenv("OPENAI_API_KEY")
    if not openai.api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key is not set in the environment.")

    # Extract the user's message
    user_message = request.message

    try:
        # Run the OpenAI API call in a thread pool
        completion = await run_in_threadpool(
            openai.ChatCompletion.create,
            model="gpt-4",  # Use a valid model
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_message},
            ]
        )

        # Return the response content as JSON
        return {"response": completion.choices[0].message.content}

    except Exception as e:
        # Log the error and raise HTTPException
        print(f"Error occurred: {str(e)}")  # Log error message
        raise HTTPException(status_code=500, detail=f"An error occurred while processing the request: {str(e)}")
