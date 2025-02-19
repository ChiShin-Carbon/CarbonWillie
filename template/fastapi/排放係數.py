import os
from mistralai import Mistral

api_key = os.environ["MISTRAL_API_KEY"]
model = "codestral-latest"

client = Mistral(api_key=api_key)

chat_response = client.chat.complete(
    model= model,
    messages = [
        {
            "role": "user",
            "content": "中華民國一百十四年電力排碳係數 公斤CO2e/度 "
        },
    ]
)
print(chat_response.choices[0].message.content)