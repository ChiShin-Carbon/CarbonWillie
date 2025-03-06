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
import asyncio
from concurrent.futures import ThreadPoolExecutor
import re
from collections import Counter

# Load environment variables
load_dotenv()

# Initialize FastAPI router
botapi = APIRouter(tags=["bot"])

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

                child_splitter = RecursiveCharacterTextSplitter(chunk_size=2500)
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

        # ---- 函數封裝：Pointwise 評分 (同步版本) ----
        def score_chunk_sync(client, query, chunk, index):
            """
            同步函數：對單個 chunk 進行評分
            """
            score_prompt = f"""
你的任務是評估以下內容片段與使用者問題的相關性。
根據相關性給該片段打分，分數範圍是0到10，其中10分表示非常相關，0分表示完全不相關。

評分標準：
- 內容是否直接回答問題 (0-3分)
- 內容是否提供相關背景知識 (0-2分)
- 內容的專業性和準確性 (0-3分)
- 內容的完整性 (0-2分)

只需輸出一個整數分數，不要包含任何其他文字、解釋或標點符號，只有數字。
例如：7

使用者問題: {query}

內容片段:
{chunk}
            """

            score_response = client.chat.completions.create(
                model="gpt-4o",
                temperature=0,
                messages=[
                    {"role": "system", "content": "你是專業評分員。你的回答必須只包含一個數字（0-10），不要有任何其他文字。"},
                    {"role": "user", "content": score_prompt}
                ]
            )

            content = score_response.choices[0].message.content.strip()
            print(f"Chunk {index} raw score: {content}")

            try:
                # 嘗試將回應直接轉換為整數
                score = int(content)
                # 確保分數在 0-10 的範圍內
                return max(0, min(score, 10)), chunk
            except Exception as e:
                print(f"Error parsing score for chunk {index}: {e}")
                # 如果無法解析為整數，嘗試從文本中提取數字
                number_match = re.search(r'\d+', content)
                if number_match:
                    try:
                        score = int(number_match.group())
                        return max(0, min(score, 10)), chunk
                    except:
                        pass
                return 5, chunk  # 預設回傳中間值

        # ---- 函數封裝：非同步選擇最佳 chunks ----
        async def select_best_chunks_async(client, query, chunks, top_n=3):
            """
            非同步函數：對每個 chunk 進行獨立評分，選出分數最高的 top_n 個。
            """
            print(f"Scoring {len(chunks)} chunks asynchronously...")
            
            # 使用 ThreadPoolExecutor 處理可能阻塞的 API 呼叫
            scored_chunks = []
            with ThreadPoolExecutor(max_workers=min(10, len(chunks))) as executor:
                # 建立任務清單
                futures = []
                for i, chunk in enumerate(chunks):
                    future = executor.submit(score_chunk_sync, client, query, chunk, i)
                    futures.append(future)
                
                # 等待所有任務完成
                for i, future in enumerate(futures):
                    try:
                        score, chunk = future.result()
                        scored_chunks.append((score, chunk))
                        print(f"Completed {i+1}/{len(chunks)} evaluations")
                    except Exception as e:
                        print(f"Error in chunk evaluation {i}: {e}")
                        # 如果評分失敗，給予低分數但仍保留這個 chunk
                        scored_chunks.append((1, chunks[i]))
            
            # 按分數排序並取 top_n 個
            scored_chunks.sort(key=lambda x: x[0], reverse=True)  # 從高到低排序
            top_chunks = [chunk for _, chunk in scored_chunks[:top_n]]
            
            return top_chunks

        # ---- 函數封裝：總結 ----
        def summarize_chunks(query, chunks):
            """
            對選出的 chunks 進行總結，生成最終回答。
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

        # 1. 檢索 top-k chunks
        top_chunks = retrieve_top_k_chunks(query, k=7)
        print(f"Step1: Retrieved top 7 chunks, number of chunks: {len(top_chunks)}")

        # 2. Pointwise 評分，選出最佳的 chunks
        final_chunks = await select_best_chunks_async(client, query, top_chunks, top_n=3)
        print(f"Step2: Selected top 3 chunks based on pointwise scoring")

        # 3. 對留下的 chunk 進行總結
        final_answer = summarize_chunks(query, final_chunks)

        return {"response": final_answer}
    else:
        # Handle other intents here
        print("Intent is others.")
        return {"response": "抱歉，碳智郎僅能回答資料庫中和碳盤查相關的問題"}