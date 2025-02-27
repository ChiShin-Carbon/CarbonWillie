from openai import OpenAI  # Import the OpenAI class
import os
from dotenv import load_dotenv  # Import for loading environment variables
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastapi.concurrency import run_in_threadpool  # For running synchronous code
from connect.connect import connectDB  # Import the custom connect function
from PyPDF2 import PdfReader
from langchain.retrievers import ParentDocumentRetriever
from langchain.storage import InMemoryStore
from langchain_chroma import Chroma
from langchain_community.document_loaders import TextLoader
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.schema import Document  # Import Document class


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
                我們的資料庫有以下table，請判斷使用者的問題屬於哪個table，並給出query的指令
                (注意：
                1.只要給出SQL指令即可，不需markdown格式
                2.每次都select * from table_name即可)
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
                    依據{user_message}在{records}中尋找使用者要的資料並回覆，如果沒特別要求就回覆所有資料
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
        folder_path = './RAG資訊'
        all_pdfname = []

        # Loop through each file in the folder
        for filename in os.listdir(folder_path):
            if filename.endswith(".pdf"):
                pdf_path = os.path.join(folder_path, filename)
                all_pdfname.append(pdf_path)
        
        selectpdf = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": f"""
                請在以下陣列中找出使用者問題可能在哪一些PDF檔案中
                注意：只需回答PDF檔案名稱，不需回答完整路徑和markdown格式
                例如：file_1.pdf
                note:緒論.pdf 可提供碳盤查起源、回答有哪些溫室氣體、什麼是盤查、為什麼要盤查、誰需要盤查
                {all_pdfname}
                """},
                {"role": "user", "content": user_message},
            ]
        )

        pdf_name = selectpdf.choices[0].message.content.strip().strip("[]").replace("'", "")
        file_path = os.path.join(folder_path, pdf_name)
        
        # Extract text from the selected PDF
        def extract_text_from_pdf(pdf_path):
            reader = PdfReader(pdf_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text()
            return text
        
        # Extract text
        pdf_text = extract_text_from_pdf(file_path)

        # Split text into smaller chunks
        child_splitter = RecursiveCharacterTextSplitter(chunk_size=5000)
        text_chunks = child_splitter.split_text(pdf_text)

        # Convert text chunks into Document objects
        documents = [Document(page_content=chunk) for chunk in text_chunks]

        # Index the chunks using Chroma Vector Store
        vectorstore = Chroma(
            collection_name="full_documents", 
            embedding_function=OpenAIEmbeddings()
        )

        # Use InMemoryStore for document storage
        store = InMemoryStore()
        retriever = ParentDocumentRetriever(
            vectorstore=vectorstore,
            docstore=store,
            child_splitter=child_splitter,
        )

        # Add the chunks to the retriever
        retriever.add_documents(documents)

        # Perform similarity search
        sub_docs = vectorstore.similarity_search(user_message)
        print(sub_docs[0].page_content)

        summarize_response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": f"""
                根據您的問題({user_message})，以下是從{pdf_name}中提取的相關內容：
                """},
                {"role": "user", "content": sub_docs[0].page_content},
            ]
        )
        return {"response": summarize_response.choices[0].message.content}


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
