import openai  # 正確引入 OpenAI 套件
import os
from dotenv import load_dotenv  # 用於載入環境變數
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastapi.concurrency import run_in_threadpool  # 用來執行同步程式碼
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.llms import OpenAI

# 載入環境變數
load_dotenv()

# 設置 FastAPI 路由
langchaingpt = APIRouter()

# 定義請求模型，用來接收前端傳來的訊息
class MessageRequest(BaseModel):
    message: str

@langchaingpt.post("/langchaingpt")
async def botmessage(request: MessageRequest):
    # 設置 OpenAI 的 API 金鑰
    openai.api_key = os.getenv("OPENAI_API_KEY")

    # 從請求中提取用戶的訊息
    user_message = request.message

    # 創建一個 LangChain LLM 實例，並設置生成模型的溫度
    llm = OpenAI(temperature=0.7, max_tokens=1000)  # 設置 max_tokens 來控制回應的長度

    # 定義模板
    prompt = PromptTemplate(input_variables=["user_message"], template="You are a helpful assistant. Respond to the following message: {user_message}")

    # 創建 LLMChain 實例，結合 prompt 和 LLM
    chain = LLMChain(llm=llm, prompt=prompt)

    try:
        # 使用 LangChain 生成回應
        response = await run_in_threadpool(chain.run, user_message)

        # 輸出生成的回應內容供日誌使用（調試用）
        print(f"Generated Response: {response}")

        # 返回生成的回應作為 JSON
        return {"response": response}

    except Exception as e:
        # 捕獲異常並輸出錯誤訊息
        print(f"Error occurred: {str(e)}")  # 打印錯誤訊息
        raise HTTPException(status_code=500, detail="An error occurred while processing your request. Please try again later.")
