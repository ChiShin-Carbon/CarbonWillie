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
from typing import Dict, List, Any, Optional, Tuple
import functools
import time

# Load environment variables
load_dotenv()

# Initialize FastAPI router
botapi = APIRouter(tags=["bot"])

# Define a request model for the incoming data
class MessageRequest(BaseModel):
    message: str

# Cache for frequently used content
_tables_content_cache = None
_vectorstore_cache = None

# ========================================
# Optimized SQL Query Generation Class
# ========================================

class SQLQueryEnhancer:
    def __init__(self, client: OpenAI):
        self.client = client
        self.common_errors = {
            "no such table": "找不到指定的資料表",
            "syntax error": "SQL語法錯誤",
            "no such column": "找不到指定的欄位",
            "ambiguous column": "欄位名稱模糊，需要指定表格名稱"
        }
    
    @functools.lru_cache(maxsize=1)
    def get_enhanced_tables_content(self) -> str:
        """Read and return enhanced database tables information (cached)."""
        global _tables_content_cache
        if _tables_content_cache:
            return _tables_content_cache
            
        tables_path = "./CreateTables.txt"
        try:
            with open(tables_path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Simplified enhanced content (reduced size)
            enhanced_content = content + """
            
# 常用查詢模式：
# 時間: WHERE Doc_date BETWEEN '2024-01-01' AND '2024-12-31'
# 聚合: SELECT SUM(liters) FROM Vehicle WHERE YEAR(Doc_date) = 2024
# 部門：1=管理,2=資訊,3=業務,4=門診,5=健檢,6=檢驗,7=其他
# 職位：1=總經理,2=副總,3=主管,4=副主管,5=組長,6=其他
# 角色：0=系統管理員,1=顧問,2=企業用戶
            """
            _tables_content_cache = enhanced_content
            return enhanced_content
        except Exception as e:
            print(f"Error reading tables content: {e}")
            return ""

    def generate_sql_with_context(self, user_message: str) -> str:
        """Generate SQL query with reduced context for faster processing."""
        tables_content = self.get_enhanced_tables_content()
        
        # Simplified system prompt
        system_prompt = f"""
你是SQL查詢生成專家。只回傳可執行的SQL查詢語句，不要任何解釋。

規則：
1. 只回傳SQL，無markdown格式
2. 使用英文標點符號
3. 日期格式：'YYYY-MM-DD'
4. JOIN關聯：users.user_id ↔ 其他表user_id

資料庫結構：{tables_content}

問題：{user_message}
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                temperature=0,  # Zero temperature for consistency and speed
                max_tokens=200,  # Limit tokens for faster response
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ]
            )
            
            sql_query = response.choices[0].message.content.strip()
            sql_query = self.sanitize_sql_query(sql_query)
            return sql_query
            
        except Exception as e:
            print(f"Error generating SQL: {e}")
            raise Exception("SQL生成失敗")

    def sanitize_sql_query(self, sql_query: str) -> str:
        """Clean SQL query (optimized)."""
        # Remove markdown
        sql_query = re.sub(r'```(?:sql)?\n?|```', '', sql_query)
        
        # Replace Chinese punctuation
        replacements = {'，': ',', '；': ';', '：': ':', '"': '"', '"': '"'}
        for chinese, english in replacements.items():
            sql_query = sql_query.replace(chinese, english)
        
        sql_query = ' '.join(sql_query.split())
        
        # Quick security check
        dangerous = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'CREATE']
        if any(keyword in sql_query.upper() for keyword in dangerous):
            raise Exception("不允許執行危險操作")
        
        return sql_query

    def execute_query_with_metadata(self, sql_query: str) -> Tuple[List[Dict], Dict]:
        """Execute query (optimized)."""
        conn = connectDB()
        if not conn:
            raise Exception("無法連接資料庫")
        
        try:
            cursor = conn.cursor()
            start_time = time.time()
            cursor.execute(sql_query)
            
            # Get results
            raw_records = cursor.fetchall()
            column_info = [{"name": desc[0]} for desc in cursor.description] if cursor.description else []
            
            # Simplified parsing
            parsed_records = []
            for record in raw_records:
                parsed_record = {}
                for i, value in enumerate(record):
                    col_name = column_info[i]["name"] if i < len(column_info) else f"col_{i}"
                    
                    if value is None:
                        parsed_record[col_name] = None
                    elif isinstance(value, Decimal):
                        parsed_record[col_name] = float(value)
                    elif isinstance(value, datetime):
                        parsed_record[col_name] = value.strftime('%Y-%m-%d %H:%M:%S')
                    elif hasattr(value, 'date'):
                        parsed_record[col_name] = value.strftime('%Y-%m-%d')
                    else:
                        parsed_record[col_name] = str(value)
                
                parsed_records.append(parsed_record)
            
            metadata = {
                "total_records": len(raw_records),
                "execution_time": round(time.time() - start_time, 2)
            }
            
            return parsed_records, metadata
            
        except Exception as e:
            raise Exception(f"查詢錯誤: {str(e)}")
        finally:
            conn.close()

    def generate_user_friendly_response(self, user_message: str, parsed_records: List[Dict], 
                                      metadata: Dict) -> str:
        """Generate response (optimized)."""
        
        # Quick fallback for simple cases
        if not parsed_records:
            return "沒有找到符合條件的資料。"
        
        total_records = len(parsed_records)
        if total_records == 1:
            # Single record - simple format
            record = parsed_records[0]
            result = "查詢結果：\n"
            for key, value in record.items():
                result += f"{key}: {value}\n"
            return result
        
        # Simplified response generation for multiple records
        response_prompt = f"""
根據用戶問題生成簡潔回答：

問題：{user_message}
資料筆數：{total_records}
結果：{json.dumps(parsed_records[:3], ensure_ascii=False)}

要求：
1. 直接回答問題
2. 簡潔明瞭
3. 如果資料多，提供摘要
4. 轉換代碼：部門(1=管理,2=資訊,3=業務,4=門診,5=健檢,6=檢驗,7=其他)
        """
        
        try:
            result = self.client.chat.completions.create(
                model="gpt-4o-mini",
                temperature=0,
                max_tokens=300,  # Limit for faster response
                messages=[
                    {"role": "system", "content": "你是數據分析助手，提供簡潔準確的回答。"},
                    {"role": "user", "content": response_prompt}
                ]
            )
            
            return result.choices[0].message.content
            
        except Exception as e:
            print(f"Error generating response: {e}")
            return f"找到 {total_records} 筆資料。"


# ========================================
# Optimized Main Bot Functions
# ========================================

@botapi.post("/botapi")
async def botmessage(request: MessageRequest):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    if not client:
        raise HTTPException(status_code=500, detail="OpenAI API key not set.")
    
    user_message = request.message

    # Simplified intent detection
    intent_prompt = f"""
判斷用戶意圖，只回答以下之一：
- query: 需要查詢資料庫資料
- answer: 詢問碳盤查相關知識
- others: 其他問題

問題：{user_message}
    """
    
    intent_response = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0,
        max_tokens=10,
        messages=[
            {"role": "system", "content": "你是意圖識別專家，只回答intent類型。"},
            {"role": "user", "content": intent_prompt}
        ]
    )
    
    intent = intent_response.choices[0].message.content.strip().lower()
    print(f"Intent: {intent}")

    if intent == "query":
        return await handle_query_intent(client, user_message)
    elif intent == "answer":
        return await handle_answer_intent_optimized(client, user_message)
    else:
        return {"response": "抱歉，碳智郎僅能回答資料庫中和碳盤查相關的問題"}


async def handle_query_intent(client, user_message):
    """Optimized query handler."""
    enhancer = SQLQueryEnhancer(client)
    
    try:
        sql_query = enhancer.generate_sql_with_context(user_message)
        print(f"Generated SQL: {sql_query}")
        
        parsed_records, metadata = enhancer.execute_query_with_metadata(sql_query)
        response = enhancer.generate_user_friendly_response(user_message, parsed_records, metadata)
        
        return {"response": response}
        
    except Exception as e:
        error_msg = str(e)
        print(f"Query error: {error_msg}")
        return {"response": f"查詢失敗：{error_msg}"}


# ========================================
# Optimized RAG Functions
# ========================================

def get_vectorstore_cached():
    """Get cached vectorstore."""
    global _vectorstore_cache
    if _vectorstore_cache:
        return _vectorstore_cache
    
    _vectorstore_cache = prepare_vectorstore()
    return _vectorstore_cache

def prepare_vectorstore():
    """Prepare vectorstore (unchanged but cached)."""
    persist_directory = "./RAG資訊/vectorstore_db"
    populated_flag = os.path.join(persist_directory, ".populated")

    os.makedirs(persist_directory, exist_ok=True)

    vectorstore = Chroma(
        collection_name="full_documents", 
        embedding_function=OpenAIEmbeddings(),
        persist_directory=persist_directory
    )

    if not os.path.exists(populated_flag):
        folder_path = './RAG資訊'
        all_pdfname = []

        for filename in os.listdir(folder_path):
            if filename.endswith(".pdf"):
                pdf_path = os.path.join(folder_path, filename)
                all_pdfname.append(pdf_path)

        for pdf_name in all_pdfname:
            pdf_text = extract_text_from_pdf(pdf_name)
            if not pdf_text.strip():
                continue

            child_splitter = RecursiveCharacterTextSplitter(chunk_size=2000)
            text_chunks = child_splitter.split_text(pdf_text)
            
            if not text_chunks:
                continue

            documents = [Document(page_content=chunk) for chunk in text_chunks if chunk.strip()]
            if documents:
                vectorstore.add_documents(documents)

        with open(populated_flag, "w") as f:
            f.write("populated")
        print("✅ PDF content added to vector database.")
    else:
        print("🔄 Vector database already populated")

    return vectorstore

def extract_text_from_pdf(file_path):
    """Extract text from PDF (unchanged)."""
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text
    return text

async def handle_answer_intent_optimized(client, user_message):
    """Optimized RAG handler with reduced processing time."""
    vectorstore = get_vectorstore_cached()
    
    # Reduce initial retrieval
    top_chunks = retrieve_top_k_chunks(vectorstore, user_message, k=5)  # Reduced from 7
    print(f"Retrieved {len(top_chunks)} chunks")

    # Simplified chunk selection - just use top 2 chunks without complex scoring
    final_chunks = top_chunks[:2]  # Take top 2 directly
    print(f"Using top 2 chunks without scoring for speed")
    
    # Simplified summarization
    final_answer = summarize_chunks_optimized(client, user_message, final_chunks)
    
    return {"response": final_answer}

def retrieve_top_k_chunks(vectorstore, user_query, k=5):
    """Retrieve chunks (unchanged)."""
    sub_docs = vectorstore.similarity_search(user_query, k=k)
    return [doc.page_content for doc in sub_docs]

def summarize_chunks_optimized(client, query, chunks):
    """Optimized summarization with reduced complexity."""
    if not chunks:
        return "No relevant information found."
    
    # Read table content for context
    tables_path = "./CreateTables.txt"
    table_content = ""
    try:
        with open(tables_path, 'r', encoding='utf-8') as file:
            table_content = file.read()
    except Exception as e:
        print(f"Error reading table content: {e}")
        table_content = ""

    # Simplified prompt
    combined_content = "\n\n".join(chunks)
    
    # Create system prompt with table content if available
    system_prompt = "基於提供的內容回答用戶問題，保持簡潔準確。並且**避免**直接以資料庫欄位名稱進行回答，請以人性化的方式進行回答"
    if table_content:
        system_prompt += f"\n\n資料庫結構參考：\n{table_content}"  # Limit table content size
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Faster model
            temperature=0.1,
            max_tokens=400,  # Limit response length
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"問題：{query}\n\n內容：{combined_content}"}
            ]
        )
        
        return response.choices[0].message.content
    
    except Exception as e:
        print(f"Summarization error: {str(e)}")
        return "處理回答時發生錯誤，請重試。"

# ========================================
# Legacy compatibility functions (simplified)
# ========================================

def parse_database_records(records, column_names=None):
    """Legacy function (simplified)."""
    if not records:
        return []
    
    parsed_records = []
    for record in records:
        parsed_record = {}
        for i, value in enumerate(record):
            if isinstance(value, Decimal):
                parsed_record[f'col_{i}'] = float(value)
            elif isinstance(value, datetime):
                parsed_record[f'col_{i}'] = value.strftime('%Y-%m-%d %H:%M:%S')
            else:
                parsed_record[f'col_{i}'] = str(value) if value is not None else None
        parsed_records.append(parsed_record)
    
    return parsed_records

def get_tables_content():
    """Get cached tables content."""
    enhancer = SQLQueryEnhancer(None)
    return enhancer.get_enhanced_tables_content()