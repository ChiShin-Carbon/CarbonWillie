from openai import OpenAI  # Import the OpenAI class
import os
from dotenv import load_dotenv  # Import for loading environment variables
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastapi.concurrency import run_in_threadpool  # For running synchronous code
from connect.connect import connectDB  # Import the custom connect function

# Load environment variables
load_dotenv()

# Initialize FastAPI router
botapi = APIRouter()

# Define a request model for the incoming data
class MessageRequest(BaseModel):
    message: str

@botapi.post("/botapi")
async def botmessage(request: MessageRequest):

    # Set the OpenAI API key
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))  # Pass the API key directly here
    if not client:
        raise HTTPException(status_code=500, detail="OpenAI API key is not set in the environment.")
    
    # If intent is query, proceed to generate the query
    tables_path = "./CreateTables.txt"
    with open(tables_path, 'r', encoding='utf-8') as file:
        tables_content = file.read()


    user_message = request.message

    intent_response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": f"""
You are an intelligent assistant that replies to the user's questions with precision. 
Your primary focus is to understand the user's intent before responding. 

You have the following tools:
- query: Use this when the user asks for information that requires external sources or research, you have these table: {tables_content}
- answer: Use this when the user asks about Carbon Footprint Verification, including its process, standards, calculations, or related details.
- others: Use this for any other questions or requests unrelated to Carbon Footprint Verification or external queries.

Your task is to:
1. **Accurately determine the user's intent** and respond with one of the following intents ONLY:
    - query
    - answer
    - others
            """},
            {"role": "user", "content": user_message},
        ]
    )
    
    # Extract intent from the response
    intent = intent_response.choices[0].message.content.strip().lower()
    print(f"Intent: {intent}")

    # Check the determined intent
    if intent == "query":
        # If intent is query, proceed to generate the query
        tables_path = "./CreateTables.txt"
        with open(tables_path, 'r', encoding='utf-8') as file:
            tables_content = file.read()
        
        query_intent = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": f"""
                我們的資料庫有以下table，請判斷使用者的問題屬於哪個table，並給出query的指令(注意：只要給出SQL指令即可，不需markdown格式)
                {tables_content}
                """},
                {"role": "user", "content": user_message},
            ]
        )

        conn = connectDB()  # Establish connection using your custom connect function
        if conn:
            cursor = conn.cursor()
            # Secure SQL query using a parameterized query to prevent SQL injection
            cursor.execute(query_intent.choices[0].message.content)
            # Fetch all records
            records = cursor.fetchall()
            conn.close()

            result = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": f"""
                    依據{user_message}在{records}中尋找使用者要的資料並回覆
                    """},
                ]
            )
            
            result_message = result.choices[0].message.content
            print(result_message)
            return {"response": result_message}
        else:
            print("Could not connect to the database.")
            return {"response": "Could not connect to the database."}

    elif intent == "answer":
        answer_intent = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": f"""
                請以#zh-TW回覆使用者的問題
                
                """},
                {"role": "user", "content": request.message},
            ]
        )
        print("Intent is to answer about Carbon Footprint Verification.")
    
    else:
        # Handle other intents here
        print("Intent is others.")

    

    # try:
    #     # Run the OpenAI API call in a thread pool
    #     completion = await run_in_threadpool(
    #         openai.ChatCompletion.create,
    #         model="gpt-4",  # Use a valid model
    #         messages=[
    #             {"role": "system", "content": "You are a helpful assistant."},
    #             {"role": "user", "content": user_message},
    #         ]
    #     )

    #     # Return the response content as JSON
    #     return {"response": completion.choices[0].message.content}

    # except Exception as e:
    #     # Log the error and raise HTTPException
    #     print(f"Error occurred: {str(e)}")  # Log error message
    #     raise HTTPException(status_code=500, detail=f"An error occurred while processing the request: {str(e)}")
