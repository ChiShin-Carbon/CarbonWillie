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

# Load environment variables
load_dotenv()

# Initialize FastAPI router
botapi = APIRouter(tags=["bot"])

# Define a request model for the incoming data
class MessageRequest(BaseModel):
    message: str


# ========================================
# Enhanced SQL Query Generation Class
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
    
    def get_enhanced_tables_content(self) -> str:
        """Read and return enhanced database tables information with examples."""
        tables_path = "./CreateTables.txt"
        try:
            with open(tables_path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Add common query patterns and examples
            enhanced_content = content + """
            
# ========================================
# 常用查詢模式和範例 (Common Query Patterns and Examples)
# ========================================

# 1. 時間範圍查詢範例：
# SELECT * FROM Vehicle WHERE Doc_date BETWEEN '2024-01-01' AND '2024-12-31'
# SELECT * FROM Electricity_Usage WHERE period_start >= '2024-01-01' AND period_end <= '2024-12-31'

# 2. 聚合查詢範例：
# SELECT SUM(liters) as total_fuel FROM Vehicle WHERE YEAR(Doc_date) = 2024
# SELECT COUNT(*) as record_count FROM users WHERE department = 1

# 3. 跨表查詢範例：
# SELECT u.username, v.liters, v.Doc_date 
# FROM users u JOIN Vehicle v ON u.user_id = v.user_id

# 4. 排放量計算範例：
# SELECT es.remark, SUM(qi.emission_equivalent) as total_emissions
# FROM Emission_Source es 
# JOIN Quantitative_Inventory qi ON es.source_id = qi.source_id
# GROUP BY es.source_id, es.remark

# 5. 月份統計範例：
# SELECT YEAR(Doc_date) as year, MONTH(Doc_date) as month, SUM(liters) as monthly_fuel
# FROM Vehicle 
# GROUP BY YEAR(Doc_date), MONTH(Doc_date)
# ORDER BY year, month

# 重要提醒：
# - 使用 YEAR(), MONTH(), DAY() 函數處理日期
# - 金額和數量欄位通常是 DECIMAL 類型
# - 外鍵關聯：user_id 連接 users 表，business_id 連接 Company_Info 表
# - 日期格式：'YYYY-MM-DD'
# - 布林值：0=否/False, 1=是/True

# 部門代碼對照：1=管理部門, 2=資訊部門, 3=業務部門, 4=門診部門, 5=健檢部門, 6=檢驗部門, 7=其他
# 職位代碼對照：1=總經理, 2=副總經理, 3=主管, 4=副主管, 5=組長, 6=其他
# 角色權限對照：0=系統管理員, 1=顧問, 2=企業用戶
            """
            return enhanced_content
        except Exception as e:
            print(f"Error reading tables content: {e}")
            return ""

    def generate_sql_with_context(self, user_message: str) -> str:
        """Generate SQL query with enhanced context and error handling."""
        tables_content = self.get_enhanced_tables_content()
        
        # Enhanced system prompt with more specific instructions
        system_prompt = f"""
你是一個專業的SQL查詢生成專家，專門處理碳排放管理系統的資料庫查詢。

重要指示：
1. **只回傳可執行的SQL查詢語句**，不要包含任何markdown格式、解釋文字或前後綴
2. **根據問題選擇合適的欄位**，避免不必要的 SELECT *
3. **正確使用日期格式**：'YYYY-MM-DD'，使用 YEAR(), MONTH(), DAY() 函數處理日期查詢
4. **適當使用聚合函數**：SUM(), COUNT(), AVG(), MAX(), MIN()
5. **正確處理JOIN關聯**：
   - users.user_id ↔ 其他表的 user_id
   - Company_Info.business_id ↔ users.business_id
   - Baseline.baseline_id ↔ Emission_Source.baseline_id
6. **使用英文標點符號**，避免中文標點
7. **處理模糊查詢**：使用 LIKE '%keyword%'
8. **排序和分組**：適當使用 ORDER BY 和 GROUP BY

常見查詢類型對應：
- "多少" → COUNT() 或 SUM()
- "平均" → AVG()
- "最大/最小" → MAX()/MIN()
- "趨勢/每月/每年" → GROUP BY YEAR(), MONTH()
- "範圍/期間" → BETWEEN 或 >= AND <=
- "包含/含有" → LIKE '%keyword%'

代碼對照表：
- 部門：1=管理部門, 2=資訊部門, 3=業務部門, 4=門診部門, 5=健檢部門, 6=檢驗部門, 7=其他
- 職位：1=總經理, 2=副總經理, 3=主管, 4=副主管, 5=組長, 6=其他
- 角色：0=系統管理員, 1=顧問, 2=企業用戶

資料庫結構：
{tables_content}

請根據用戶問題生成精確的SQL查詢：
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o",
                temperature=0.1,  # Low temperature for consistency
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ]
            )
            
            sql_query = response.choices[0].message.content.strip()
            
            # Clean and sanitize the SQL query
            sql_query = self.sanitize_sql_query(sql_query)
            
            return sql_query
            
        except Exception as e:
            print(f"Error generating SQL: {e}")
            raise Exception("SQL生成失敗，請重新嘗試")

    def sanitize_sql_query(self, sql_query: str) -> str:
        """Clean and sanitize the SQL query."""
        # Remove markdown formatting
        sql_query = re.sub(r'```sql\n?|```\n?|```', '', sql_query)
        
        # Replace Chinese punctuation with English
        replacements = {
            '，': ',',
            '；': ';',
            '：': ':',
            '"': '"',
            '"': '"',
            ''': "'",
            ''': "'",
            '（': '(',
            '）': ')'
        }
        
        for chinese, english in replacements.items():
            sql_query = sql_query.replace(chinese, english)
        
        # Remove extra whitespace and newlines
        sql_query = ' '.join(sql_query.split())
        
        # Basic SQL injection prevention (whitelist approach)
        dangerous_keywords = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'CREATE', 'EXEC', 'EXECUTE']
        sql_upper = sql_query.upper()
        
        for keyword in dangerous_keywords:
            if keyword in sql_upper:
                # Allow only specific safe UPDATE/INSERT patterns if needed
                if keyword in ['UPDATE', 'INSERT'] and 'SET' not in sql_upper:
                    continue
                else:
                    raise Exception(f"不允許執行 {keyword} 操作")
        
        return sql_query

    def execute_query_with_metadata(self, sql_query: str) -> Tuple[List[Dict], Dict]:
        """Execute query and return results with metadata."""
        conn = connectDB()
        if not conn:
            raise Exception("無法連接到資料庫")
        
        try:
            cursor = conn.cursor()
            cursor.execute(sql_query)
            
            # Get column information
            column_info = []
            if cursor.description:
                column_info = [{"name": desc[0], "type": str(desc[1])} for desc in cursor.description]
            
            # Fetch results
            raw_records = cursor.fetchall()
            
            # Parse records with enhanced type handling
            parsed_records = self.parse_database_records_enhanced(raw_records, column_info)
            
            # Generate metadata
            metadata = {
                "total_records": len(raw_records),
                "columns": column_info,
                "query_type": self.analyze_query_type(sql_query),
                "execution_time": datetime.now().isoformat()
            }
            
            return parsed_records, metadata
            
        except Exception as e:
            # Enhanced error handling with suggestions
            error_msg = str(e).lower()
            suggestion = self.get_error_suggestion(error_msg)
            raise Exception(f"查詢執行錯誤: {suggestion}")
        finally:
            conn.close()

    def parse_database_records_enhanced(self, records: List[tuple], column_info: List[Dict]) -> List[Dict]:
        """Enhanced parsing of database records with proper type handling."""
        if not records:
            return []
        
        parsed_records = []
        for record in records:
            parsed_record = {}
            for i, value in enumerate(record):
                column_name = column_info[i]["name"] if i < len(column_info) else f"col_{i}"
                
                # Enhanced type conversion
                if value is None:
                    parsed_record[column_name] = None
                elif isinstance(value, Decimal):
                    parsed_record[column_name] = float(value)
                elif isinstance(value, datetime):
                    parsed_record[column_name] = value.strftime('%Y-%m-%d %H:%M:%S')
                elif hasattr(value, 'date') and callable(getattr(value, 'date')):
                    parsed_record[column_name] = value.strftime('%Y-%m-%d')
                elif isinstance(value, bool):
                    parsed_record[column_name] = "是" if value else "否"
                elif isinstance(value, (int, float)):
                    parsed_record[column_name] = value
                else:
                    parsed_record[column_name] = str(value)
            
            parsed_records.append(parsed_record)
        
        return parsed_records

    def analyze_query_type(self, sql_query: str) -> str:
        """Analyze the type of SQL query for better response formatting."""
        sql_upper = sql_query.upper()
        
        if "COUNT(" in sql_upper:
            return "計數查詢"
        elif "SUM(" in sql_upper:
            return "總和查詢"
        elif "AVG(" in sql_upper:
            return "平均值查詢"
        elif "GROUP BY" in sql_upper:
            return "分組統計查詢"
        elif "JOIN" in sql_upper:
            return "關聯查詢"
        elif "ORDER BY" in sql_upper:
            return "排序查詢"
        else:
            return "一般查詢"

    def get_error_suggestion(self, error_msg: str) -> str:
        """Provide helpful suggestions based on error messages."""
        for error_pattern, suggestion in self.common_errors.items():
            if error_pattern in error_msg:
                return suggestion
        
        if "conversion failed" in error_msg:
            return "數據類型轉換失敗，請檢查日期格式或數值格式"
        elif "timeout" in error_msg:
            return "查詢超時，請嘗試縮小查詢範圍"
        else:
            return "查詢執行失敗，請檢查SQL語法或聯絡系統管理員"

    def generate_user_friendly_response(self, user_message: str, parsed_records: List[Dict], 
                                      metadata: Dict) -> str:
        """Generate a user-friendly response based on query results."""
        
        # Enhanced response generation prompt
        response_prompt = f"""
根據用戶問題和查詢結果，生成一個清晰、有意義的回答。

用戶問題：{user_message}
查詢類型：{metadata.get('query_type', '一般查詢')}
結果筆數：{metadata.get('total_records', 0)}
欄位資訊：{[col['name'] for col in metadata.get('columns', [])]}

查詢結果：
{json.dumps(parsed_records, ensure_ascii=False, indent=2) if parsed_records else '無資料'}

請按照以下要求生成回答：

1. **直接回答用戶問題**，避免顯示原始資料庫格式
2. **數據摘要**：如果有多筆資料，提供重點摘要
3. **數值格式化**：
   - 金額：添加千分位逗號
   - 日期：使用易讀格式
   - 布林值：使用"是/否"
4. **結構化呈現**：
   - 統計結果：使用清楚的數字表達
   - 列表資料：使用條列或表格格式
   - 趨勢資料：描述變化趨勢
5. **上下文解釋**：適當解釋結果的意義
6. **無資料處理**：如果沒有找到資料，說明原因並建議替代方案
7. **代碼轉換**：將數字代碼轉換為有意義的描述
   - 部門代碼：1=管理部門, 2=資訊部門, 3=業務部門, 4=門診部門, 5=健檢部門, 6=檢驗部門, 7=其他
   - 職位代碼：1=總經理, 2=副總經理, 3=主管, 4=副主管, 5=組長, 6=其他
   - 角色代碼：0=系統管理員, 1=顧問, 2=企業用戶

特別注意：
- 避免顯示技術性欄位名稱（如col_0, col_1）
- 提供實用的洞察和建議
        """
        
        try:
            result = self.client.chat.completions.create(
                model="gpt-4o",
                temperature=0.2,
                messages=[
                    {"role": "system", "content": "你是專業的數據分析助手，擅長將資料庫查詢結果轉換為清晰易懂的商業洞察。請提供實用、準確且易於理解的回答。"},
                    {"role": "user", "content": response_prompt}
                ]
            )
            
            return result.choices[0].message.content
            
        except Exception as e:
            print(f"Error generating response: {e}")
            # Fallback to basic response
            return self.generate_fallback_response(parsed_records, metadata)

    def generate_fallback_response(self, parsed_records: List[Dict], metadata: Dict) -> str:
        """Generate a basic fallback response when AI response generation fails."""
        if not parsed_records:
            return "查詢完成，但沒有找到符合條件的資料。"
        
        total_records = metadata.get('total_records', len(parsed_records))
        
        if total_records == 1:
            return f"找到 1 筆資料：{parsed_records[0]}"
        elif total_records <= 5:
            response = f"找到 {total_records} 筆資料：\n"
            for i, record in enumerate(parsed_records, 1):
                response += f"{i}. {record}\n"
            return response
        else:
            response = f"找到 {total_records} 筆資料，顯示前 3 筆：\n"
            for i, record in enumerate(parsed_records[:3], 1):
                response += f"{i}. {record}\n"
            response += f"... 還有 {total_records - 3} 筆資料"
            return response


# ========================================
# Main Bot Functions
# ========================================

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
    enhancer = SQLQueryEnhancer(None)  # We only need the file reading functionality
    return enhancer.get_enhanced_tables_content()


# Enhanced Query Handler (replaces the original one)
async def handle_query_intent(client, user_message):
    """Enhanced handler for database query intent."""
    enhancer = SQLQueryEnhancer(client)
    
    try:
        # Generate SQL query
        sql_query = enhancer.generate_sql_with_context(user_message)
        print(f"Generated SQL: {sql_query}")
        
        # Execute query with metadata
        parsed_records, metadata = enhancer.execute_query_with_metadata(sql_query)
        
        # Generate user-friendly response
        response = enhancer.generate_user_friendly_response(user_message, parsed_records, metadata)
        
        return {"response": response}
        
    except Exception as e:
        error_msg = str(e)
        print(f"Error in enhanced query handling: {error_msg}")
        
        # Provide specific error responses
        if "不允許執行" in error_msg:
            return {"response": "抱歉，為了安全考量，不允許執行此類操作。"}
        elif "無法連接" in error_msg:
            return {"response": "抱歉，目前無法連接到資料庫，請稍後再試。"}
        elif "SQL生成失敗" in error_msg:
            return {"response": "抱歉，無法理解您的問題，請嘗試重新表述。"}
        else:
            return {"response": f"處理查詢時發生錯誤：{error_msg}。請嘗試重新表述您的問題。"}


# ========================================
# Legacy Functions (kept for compatibility)
# ========================================

def parse_database_records(records, column_names=None):
    """
    Parse database records into a more readable format.
    (Legacy function - kept for compatibility)
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
    (Legacy function - kept for compatibility)
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


# ========================================
# RAG-based Answer Functions (unchanged)
# ========================================

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