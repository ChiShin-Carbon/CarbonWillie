import openai  # Correct import for the OpenAI package
import os
from dotenv import load_dotenv  # Import for loading environment variables
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastapi.concurrency import run_in_threadpool  # For running synchronous code

load_dotenv()

botapi = APIRouter()

# Define a request model for the incoming data
class MessageRequest(BaseModel):
    message: str

@botapi.post("/botapi")
async def botmessage(request: MessageRequest):
    # Set your API key from the environment variable
    openai.api_key = os.getenv("OPENAI_API_KEY")

    # Get the message from the request body
    user_message = request.message

    # Create a completion request in a background thread (to handle synchronous OpenAI call)
    try:
        completion = await run_in_threadpool(openai.ChatCompletion.create, 
            model="gpt-4o-mini",  # Use a valid model
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_message}  # Use the incoming message from the request
            ]
        )

        # Return the response content as JSON
        return {"response": completion.choices[0].message.content}

    except Exception as e:
        print(f"Error occurred: {str(e)}")  # 打印錯誤訊息
        raise HTTPException(status_code=500, detail=str(e))