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
from collections import Counter
import concurrent.futures


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

        def extract_text_from_pdf(file_path):
            """Extracts text from a PDF file."""
            reader = PdfReader(file_path)
            text = ""
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text
            return text
            

        persist_directory = "./RAG資訊/vectorstore_db"
        populated_flag = os.path.join(persist_directory, ".populated")

        folder_path = './RAG資訊'
        all_pdfname = []


        # Ensure the directory for ChromaDB exists
        os.makedirs(persist_directory, exist_ok=True)

        # 1. Initialize Vector Store (Always Initialize Here)
        # 如果要重新建立向量資料庫，把RAG資訊中的vectorstrore_db資料夾刪除
        vectorstore = Chroma(
            collection_name="full_documents", 
            embedding_function=OpenAIEmbeddings(),
            persist_directory=persist_directory
        )


        for filename in os.listdir(folder_path):
            if filename.endswith(".pdf"):
                pdf_path = os.path.join(folder_path, filename)
                all_pdfname.append(pdf_path)
        # 3. 加入 PDF 文本到向量資料庫
        if not os.path.exists(populated_flag):
            for pdf_name in all_pdfname:
                file_path = os.path.join(pdf_name)
                pdf_text = extract_text_from_pdf(file_path)

                if not pdf_text.strip():
                    print(f"⚠️ PDF '{pdf_name}' 沒有提取到任何文字。跳過此檔案。")
                    continue

                child_splitter = RecursiveCharacterTextSplitter(chunk_size=2000)
                text_chunks = child_splitter.split_text(pdf_text)

                if not text_chunks:
                    print(f"⚠️ PDF '{pdf_name}' 的文字切割結果為空。跳過此檔案。")
                    continue


                documents = [Document(page_content=chunk) for chunk in text_chunks if chunk.strip()]

                if not documents:
                    print(f"⚠️ PDF '{pdf_name}' 的 documents 列表为空。跳过此檔案。")
                    continue

                # 加入向量数据库
                vectorstore.add_documents(documents)
    
            with open(populated_flag, "w") as f:
                f.write("populated")
            print("✅ 所有 PDF 的内容已加入向量資料庫。")
        else:
            print("🔄 向量資料庫已有資料")
        # 3. 使用向量資料庫進行相似度檢索
        query = user_message  
        sub_docs = vectorstore.similarity_search(query, k=5)  # 搜尋top5相似的chunks

        # 4. 提取chunks
        relevant_chunks = [doc.page_content for doc in sub_docs]

    

        # 6. 總結top5 chunk
        summarize_response = client.chat.completions.create(
            model="gpt-4o",
            temperature=0, #讓模型回覆盡可能一致 
            messages=[
                {"role": "system", "content": f"""
                根據您的問題({query})，以下是從相關內容中提取的最頻繁片段的總結(回覆資料來源)：
                """},
                {"role": "user", "content": "\n\n".join(relevant_chunks)},
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
