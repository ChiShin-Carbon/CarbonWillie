import openai  # Correct import for the OpenAI package
import os
from dotenv import load_dotenv  # Import for loading environment variables

# Load environment variables from a .env file
load_dotenv()

# Set your API key from the environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

# Create a completion request with a valid model name
from openai import OpenAI
client = OpenAI()

completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": ""},
        {
            "role": "user",
            "content": "請問碳盤查是什麼?"
        }
    ]
)

print(completion.choices[0].message)