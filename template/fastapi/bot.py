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
import json

from collections import Counter

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

        # 1. Initialize Vector Store
        vectorstore = Chroma(
            collection_name="full_documents", 
            embedding_function=OpenAIEmbeddings(),
            persist_directory=persist_directory
        )

        # 2. 準備所有 PDF 檔名
        for filename in os.listdir(folder_path):
            if filename.endswith(".pdf"):
                pdf_path = os.path.join(folder_path, filename)
                all_pdfname.append(pdf_path)

        # 3. 如果向量資料庫還沒建置，則將 PDF 加入向量資料庫
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
                    print(f"⚠️ PDF '{pdf_name}' 的 documents 列表為空。跳過此檔案。")
                    continue

                # 加入向量資料庫
                vectorstore.add_documents(documents)

            with open(populated_flag, "w") as f:
                f.write("populated")
            print("✅ 所有 PDF 的內容已加入向量資料庫。")
        else:
            print("🔄 向量資料庫已有資料")

        # ---- 函數封裝：檢索 top-k chunks ----
        def retrieve_top_k_chunks(user_query, k=5):
            """
            從 vectorstore 中檢索最相關的 top-k chunks。
            """
            sub_docs = vectorstore.similarity_search(user_query, k=k)
            return [doc.page_content for doc in sub_docs]

        # ---- 函數封裝：Pairwise 比較 ----
        def pairwise_compare(query, chunk1, chunk2):
            """
            使用 GPT 對兩個 chunk 進行 Pairwise 比較，判斷哪個更相關。
            回傳更相關的 chunk。
            """
            compare_prompt = f"""
    你是一個審核員，負責比較以下兩個內容片段，判斷哪個更適合回答使用者問題。
    請你輸出以下JSON格式，無其他文字：
    {{
      "more_relevant_chunk": "更相關的內容片段"
    }}

    使用者問題: {query}

    內容片段 1:
    {chunk1}

    內容片段 2:
    {chunk2}
            """

            # num_retries = 5  # 設置多次詢問次數
            # responses = []

            # for _ in range(num_retries):
            #     compare_response = client.chat.completions.create(
            #         model="gpt-4o",
            #         temperature=0,  # 確保結果確定性
            #         messages=[
            #             {"role": "system", "content": (
            #                 "你是一位精通文本比較的專家，請使用邏輯推理分析以下內容。\n"
            #                 "請遵循以下原則：\n"
            #                 "1. **思維鏈拆解 (CoT)**：逐步分解比較標準，確保嚴謹推理。\n"
            #                 "2. **驗算與驗證 (Analyze Rate)**：檢查比較結果是否合理，並提供簡單驗證。\n"
            #                 "3. **自洽性 (Self-Consistency)**：若存在多種可能結果，請統計最常見的結論。\n"
            #                 "4. **思維圖譜 (Graphs of Thought, GoT)**：使用結構化方式進行比較。\n"
            #                 "5. **請根據範例輸出 JSON 格式，確保內容結構化**。"
            #             )},
            #             {"role": "user", "content": compare_prompt}
            #         ]
            #     )

            #     content = compare_response.choices[0].message.content.strip()
                
            #     try:
            #         result = json.loads(content)
            #         responses.append(result.get("more_relevant_chunk", ""))
            #     except Exception:
            #         responses.append("")  # 解析失敗時，記錄空字串以避免報錯

            # # **使用 Self-Consistency 確保穩定輸出**
            # most_common_response = Counter(responses).most_common(1)[0][0]

            # # **確保結果不為空，否則回傳 chunk1**
            # return most_common_response if most_common_response else chunk1


            compare_response = client.chat.completions.create(
                model="gpt-4o",
                temperature=0,  # 確保結果確定性
                messages=[
                    {"role": "system", "content": "請專注於比較，不要輸出多餘解釋。"},
                    {"role": "user", "content": compare_prompt}
                ]
            )

            content = compare_response.choices[0].message.content.strip()

            try:
                result = json.loads(content)
                return result.get("more_relevant_chunk", chunk1)  # 預設回傳 chunk1
            except Exception:
                return chunk1  # 若解析失敗，回傳 chunk1

        # ---- 函數封裝：淘汰機制 ----
        def eliminate_chunks(query, chunks):
            """
            對 chunks 進行 Pairwise 比較，淘汰掉較不相關的 chunk。
            最終留下 2 個最相關的 chunk。
            """
            while len(chunks) > 1:
                # 每次比較前兩個 chunk，淘汰較不相關的
                more_relevant = pairwise_compare(query, chunks[0], chunks[1])
                if more_relevant == chunks[0]:
                    chunks.pop(1)  # 淘汰 chunks[1]
                    print("eliminate 1 chunk")
                else:
                    chunks.pop(0)  # 淘汰 chunks[0]
                    print("eliminate 1 chunk")

            return chunks

        # ---- 函數封裝：總結 ----
        def summarize_chunks(query, chunks):
            """
            對留下的 chunks 進行總結，生成最終回答。
            """
            summarize_response = client.chat.completions.create(
                model="gpt-4o",
                temperature=0,  # 讓模型回覆盡可能一致
                messages=[
                    {
                        "role": "system",
                        "content": f"用#zh-tw回答，根據您的問題({query})，以下是從相關內容中提取的總結："
                    },
                    {
                        "role": "user",
                        "content": "\n\n".join(chunks)
                    },
                ]
            )
            return summarize_response.choices[0].message.content

        # ---- main process ----
        query = user_message

        # 1. 檢索 top-5 chunks
        top_chunks = retrieve_top_k_chunks(query, k=5)
        print(f"Step1:retrieve top 5 chunks, numbers of chunks:{len(top_chunks)}")

        # 2. Pairwise 比較，淘汰掉 4 個 chunk，留下 1 個
        final_chunks = eliminate_chunks(query, top_chunks)
        print(f"final chunks number:{len(final_chunks)}")

        # 3. 對留下的 chunk 進行總結
        final_answer = summarize_chunks(query, final_chunks)

        return {"response": final_answer}
    else:
        # Handle other intents here
        print("Intent is others.")
        return {"response": "抱歉，碳智郎僅能回答資料庫中和碳盤查相關的問題"}


    

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
