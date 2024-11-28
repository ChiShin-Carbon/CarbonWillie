import openai  # Correct import for the OpenAI package
import os
from dotenv import load_dotenv  # Import for loading environment variables

# Load environment variables from a .env file
load_dotenv()

# Set your API key from the environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

completion = openai.ChatCompletion.create(
    model="gpt-4",  # Use a valid model like 'gpt-4' or 'gpt-3.5-turbo'
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {
            "role": "user",
            "content": "請問碳盤查是什麼?"
        }
    ]
)

# Print the response from the model
print(completion.choices[0].message['content'])
