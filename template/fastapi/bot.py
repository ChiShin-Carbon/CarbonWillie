from openai import OpenAI
import os
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastapi.concurrency import run_in_threadpool
from connect.connect import connectDB
from PyPDF2 import PdfReader
from langchain.retrievers import ParentDocumentRetriever
from langchain.storage import InMemoryStore
from langchain_chroma import Chroma
from langchain_community.document_loaders import TextLoader
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.schema import Document
import json
import asyncio
from concurrent.futures import ThreadPoolExecutor
import re
from collections import Counter
from datetime import datetime
from decimal import Decimal

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
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    if not client:
        raise HTTPException(status_code=500, detail="OpenAI API key is not set in the environment.")
    
    # Get user message
    user_message = request.message

    # Determine intent
    intent_response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": f"""
You are an intelligent assistant that replies to the user's questions with precision. 
Your primary focus is to understand the user's intent before responding. 

You have the following tools:
- query: Use this when the user asks for information that requires external sources or research, you have these table: {get_tables_content()}
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

    # Process based on intent
    if intent == "query":
        return await handle_query_intent(client, user_message)
    elif intent == "answer":
        return await handle_answer_intent(client, user_message)
    else:
        # Handle other intents
        print("Intent is others.")
        return {"response": "抱歉，碳智郎僅能回答資料庫中和碳盤查相關的問題"}


def get_tables_content():
    """Read and return database tables information."""
    tables_path = "./CreateTables.txt"
    with open(tables_path, 'r', encoding='utf-8') as file:
        return file.read()


def parse_database_records(records, column_names=None):
    """
    Parse database records into a more readable format.
    
    Args:
        records: Raw database records (list of tuples)
        column_names: List of column names (optional)
    
    Returns:
        List of dictionaries with parsed data
    """
    if not records:
        return []
    
    parsed_records = []
    for record in records:
        parsed_record = {}
        for i, value in enumerate(record):
            # Convert different data types to readable format
            if isinstance(value, Decimal):
                parsed_record[f'col_{i}'] = float(value)
            elif isinstance(value, datetime):
                parsed_record[f'col_{i}'] = value.strftime('%Y-%m-%d %H:%M:%S')
            elif hasattr(value, 'date') and callable(getattr(value, 'date')):  # datetime.date
                parsed_record[f'col_{i}'] = value.strftime('%Y-%m-%d')
            else:
                parsed_record[f'col_{i}'] = str(value) if value is not None else None
        
        parsed_records.append(parsed_record)
    
    return parsed_records


def get_column_info(cursor, table_name):
    """
    Get column information for a table to better understand the data structure.
    
    Args:
        cursor: Database cursor
        table_name: Name of the table
    
    Returns:
        List of column names
    """
    try:
        # Try to get column information (this syntax might vary depending on your database)
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = cursor.fetchall()
        return [col[1] for col in columns]  # Column names are usually in index 1
    except:
        # If PRAGMA doesn't work, try alternative method
        try:
            cursor.execute(f"SELECT * FROM {table_name} LIMIT 0")
            return [description[0] for description in cursor.description]
        except:
            return None


async def handle_query_intent(client, user_message):
    """Handle database query intent with improved answer generation."""
    tables_content = get_tables_content()
    
    try:
        # Generate SQL query with better context
        query_intent = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": f"""
                我們的資料庫有以下table，請根據使用者的問題生成適當的SQL查詢。
                
                重要指示：
                1. 只回傳SQL查詢語句，不需要markdown格式
                2. 根據問題的具體需求選擇適當的欄位，不一定要select *
                3. 如果問題涉及特定年份、日期或條件，請在WHERE子句中包含這些條件
                4. 避免使用中文標點符號，使用英文標點符號
                5. 如果需要聚合數據（如總和、平均值、計數），請使用適當的聚合函數
                
                資料庫結構：
                {tables_content}
                """},
                {"role": "user", "content": user_message},
            ]
        )

        # Sanitize the SQL query
        sql_query = query_intent.choices[0].message.content.strip()
        sql_query = sql_query.replace('，', ',').replace('；', ';').replace('：', ':')
        
        # Remove markdown formatting if present
        sql_query = re.sub(r'```sql\n?|```\n?', '', sql_query)
        
        print(f"Generated SQL: {sql_query}")
        
        # Execute database query
        conn = connectDB()
        if conn:
            try:
                cursor = conn.cursor()
                cursor.execute(sql_query)
                records = cursor.fetchall()
                
                # Get column names for better context
                column_names = [description[0] for description in cursor.description] if cursor.description else None
                
                # Parse records for better readability
                parsed_records = parse_database_records(records, column_names)
                
                # Generate a more user-friendly response
                response_prompt = f"""
                使用者問題：{user_message}
                
                資料庫查詢結果：
                欄位名稱：{column_names if column_names else '未知'}
                資料筆數：{len(records)}
                資料內容：{parsed_records if parsed_records else records}
                
                請根據以上資訊，以自然、易懂的方式回答使用者的問題。要求：
                1. 直接回答問題，避免顯示原始資料庫記錄格式
                2. 將數據轉換為有意義的資訊
                3. 如果有多筆相同的資料，請進行適當的總結
                4. 使用清晰的中文表達
                5. 如果沒有找到相關資料，請明確說明
                6. 避免顯示技術性的資料庫欄位名稱和原始tuple格式
                """
                
                result = client.chat.completions.create(
                    model="gpt-4o",
                    temperature=0.1,  # Lower temperature for more consistent responses
                    messages=[
                        {"role": "system", "content": "你是一個專業的數據分析助手，能夠將資料庫查詢結果轉換為清晰、易懂的回答。請避免顯示原始的資料庫記錄格式，而是提供有意義的資訊摘要。"},
                        {"role": "user", "content": response_prompt}
                    ]
                )
                
                result_message = result.choices[0].message.content
                print(f"Generated response: {result_message}")
                return {"response": result_message}
                
            except Exception as e:
                print(f"Database execution error: {e}")
                # Provide more specific error handling
                if "no such table" in str(e).lower():
                    return {"response": "抱歉，找不到相關的資料表。請確認您的問題是否與資料庫中的資料相關。"}
                elif "syntax error" in str(e).lower():
                    return {"response": "抱歉，查詢過程中發生錯誤。請嘗試重新表述您的問題。"}
                else:
                    return {"response": "抱歉，處理您的查詢時發生錯誤。請稍後再試或重新表述您的問題。"}
            finally:
                conn.close()
        else:
            print("Could not connect to the database.")
            return {"response": "抱歉，無法連接到資料庫。請稍後再試。"}
            
    except Exception as e:
        print(f"Error in handling query intent: {e}")
        return {"response": "抱歉，處理您的問題時發生錯誤。請稍後再試。"}


async def handle_answer_intent(client, user_message):
    """Handle RAG-based answer intent using PDF documents."""
    # Initialize and prepare vector store
    vectorstore = prepare_vectorstore()
    
    # Detect user language
    language = detect_user_language(client, user_message)
    print(f"Detected language: {language}")
    
    # 1. Retrieve top-k chunks
    top_chunks = retrieve_top_k_chunks(vectorstore, user_message, k=7)
    print(f"Step1: Retrieved top 7 chunks, number of chunks: {len(top_chunks)}")

    # 2. Pointwise scoring, select best chunks
    final_chunks = await select_best_chunks_async(client, user_message, top_chunks, top_n=3)
    print(f"Step2: Selected top 3 chunks based on pointwise scoring")

    # 3. Summarize selected chunks with detected language
    final_answer = summarize_chunks(client, user_message, final_chunks, language=language)

    return {"response": final_answer}


def detect_user_language(client, user_message):
    """Detect the user's language from their message."""
    # Use a language detection prompt with the OpenAI API
    language_detection = client.chat.completions.create(
        model="gpt-4o",
        temperature=0,
        messages=[
            {"role": "system", "content": """
            Detect the language of the user's message and respond with only the language code.
            Use standard language codes like:
            - 'en' for English
            - 'zh-tw' for Traditional Chinese
            - 'ja' for Japanese
            - etc.
            
            Only return the language code, no other text.
            """},
            {"role": "user", "content": user_message}
        ]
    )
    
    language_code = language_detection.choices[0].message.content.strip().lower()
    
    # Validate language code (basic validation)
    if not language_code or len(language_code) > 10:
        # Default to English if detection fails
        return "en"
    
    return language_code

def prepare_vectorstore():
    """Prepare and return the vector store for RAG."""
    persist_directory = "./RAG資訊/vectorstore_db"
    populated_flag = os.path.join(persist_directory, ".populated")

    # Ensure the directory for ChromaDB exists
    os.makedirs(persist_directory, exist_ok=True)

    # Initialize Vector Store
    vectorstore = Chroma(
        collection_name="full_documents", 
        embedding_function=OpenAIEmbeddings(),
        persist_directory=persist_directory
    )

    # If vector database not populated, add PDF content
    if not os.path.exists(populated_flag):
        folder_path = './RAG資訊'
        all_pdfname = []

        # Prepare all PDF filenames
        for filename in os.listdir(folder_path):
            if filename.endswith(".pdf"):
                pdf_path = os.path.join(folder_path, filename)
                all_pdfname.append(pdf_path)

        # Add PDFs to vector database
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

            # Add to vector database
            vectorstore.add_documents(documents)

        with open(populated_flag, "w") as f:
            f.write("populated")
        print("✅ 所有 PDF 的內容已加入向量資料庫。")
    else:
        print("🔄 向量資料庫已有資料")

    return vectorstore


def extract_text_from_pdf(file_path):
    """Extract text from a PDF file."""
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text
    return text


def retrieve_top_k_chunks(vectorstore, user_query, k=5):
    """Retrieve the top-k most relevant chunks from the vector store."""
    sub_docs = vectorstore.similarity_search(user_query, k=k)
    return [doc.page_content for doc in sub_docs]


def score_chunk_sync(client, query, chunk, index):
    """Score a single chunk for relevance to the query."""
    score_prompt = f"""
評估任務：對內容片段與使用者問題的相關性進行量化評分

使用者問題: {query}

待評估內容片段:
{chunk}

評分標準（總分10分）:
1. 直接回答問題 (0-3分)
   - 3分：完全且直接回答問題核心
   - 2分：部分回答問題
   - 1分：僅提及問題但未直接回答
   - 0分：完全未回答問題

2. 相關背景知識 (0-2分)
   - 2分：提供豐富且必要的背景資訊
   - 1分：提供一些相關背景
   - 0分：未提供相關背景

3. 專業性和準確性 (0-3分)
   - 3分：內容專業、準確且有深度
   - 2分：內容大致準確但缺乏深度
   - 1分：內容有輕微錯誤或過於簡化
   - 0分：內容有明顯錯誤或誤導

4. 完整性 (0-2分)
   - 2分：內容完整，無需額外資訊
   - 1分：內容基本完整但有遺漏
   - 0分：內容片段且不完整

思考步驟：
1. 仔細閱讀使用者問題，確定核心需求
2. 逐條評估內容片段在各標準下的表現
3. 為每個標準分配適當分數
4. 計算總分

只輸出最終總分（0-10的整數）。不要包含任何文字、解釋或分析過程。
"""

    score_response = client.chat.completions.create(
        model="gpt-4o",
        temperature=0,
        messages=[
            {"role": "system", "content": "你是精確的內容評分專家。你必須遵循指示，只回傳一個0-10之間的整數作為評分結果，不能有任何其他文字、標點或說明。違反此規則將導致評分系統失效。"},
            {"role": "user", "content": score_prompt}
        ]
    )

    content = score_response.choices[0].message.content.strip()
    print(f"Chunk {index} raw score: {content}")

    try:
        # Try to convert response to integer
        score = int(content)
        # Ensure score is in 0-10 range
        return max(0, min(score, 10)), chunk
    except Exception as e:
        print(f"Error parsing score for chunk {index}: {e}")
        # If parsing fails, try to extract number from text
        number_match = re.search(r'\d+', content)
        if number_match:
            try:
                score = int(number_match.group())
                return max(0, min(score, 10)), chunk
            except:
                pass
        return 5, chunk  # Default to middle value


async def select_best_chunks_async(client, query, chunks, top_n=3):
    """Asynchronously score chunks and select the best ones."""
    print(f"Scoring {len(chunks)} chunks asynchronously...")
    
    # Use ThreadPoolExecutor for potentially blocking API calls
    scored_chunks = []
    with ThreadPoolExecutor(max_workers=min(10, len(chunks))) as executor:
        # Create task list
        futures = []
        for i, chunk in enumerate(chunks):
            future = executor.submit(score_chunk_sync, client, query, chunk, i)
            futures.append(future)
        
        # Wait for all tasks to complete
        for i, future in enumerate(futures):
            try:
                score, chunk = future.result()
                scored_chunks.append((score, chunk))
                print(f"Completed {i+1}/{len(chunks)} evaluations")
            except Exception as e:
                print(f"Error in chunk evaluation {i}: {e}")
                # If scoring fails, give low score but keep the chunk
                scored_chunks.append((1, chunks[i]))
    
    # Sort by score and take top_n
    scored_chunks.sort(key=lambda x: x[0], reverse=True)  # Sort from high to low
    top_chunks = [chunk for _, chunk in scored_chunks[:top_n]]
    
    return top_chunks


def summarize_chunks(client, query, chunks, language=None):
    """
    Summarize relevant chunks to generate a final answer.
    
    Args:
        client: OpenAI client
        query (str): The user's question
        chunks (list): List of relevant text segments
        language (str, optional): Preferred language code (e.g., 'en', 'zh-tw') according to user's language
            
    Returns:
        str: Summarized response in markdown format based on the chunks
    """
    # Handle empty chunks case
    if not chunks:
        return "No relevant information found to answer your query."
    
    # Prepare language instruction
    lang_instruction = ""
    if language:
        lang_instruction = f"Please respond in {language}. "
    
    # Create system prompt
    system_prompt = (
        f"{lang_instruction}Based on the user's question: '{query}', "
        "synthesize the following relevant information into a comprehensive answer. "
        "Maintain factual accuracy and cite information directly from the provided content."
    )
    
    try:
        # Combine chunks with proper separation and context
        formatted_chunks = "\n\n--- CHUNK START ---\n" + "\n--- CHUNK END ---\n\n--- CHUNK START ---\n".join(chunks) + "\n--- CHUNK END ---"
        
        # Make API call with error handling
        summarize_response = client.chat.completions.create(
            model="gpt-4o",
            temperature=0.2,  # Slight randomness for more natural responses while maintaining consistency
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": formatted_chunks}
            ],
            max_tokens=1024  # Set reasonable output length limit
        )
        
        return summarize_response.choices[0].message.content
    
    except Exception as e:
        # Log error and return fallback response
        print(f"Error in summarization: {str(e)}")
        return "Sorry, I encountered an issue while processing your request. Please try again."