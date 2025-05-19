# from openai import AsyncOpenAI
from groq import AsyncGroq
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

# load environment variables from .env file (GROQ_API_KEY)
load_dotenv()

# define the data model for the user message and bot response
class UserMessage(BaseModel):
    message: str

class BotResponse(BaseModel):
    reply: str
    error: Optional[str] = None

# set up FastAPI app and Groq client 
# (Groq client will automatically use the OPENAI_API_KEY from the environment)
app = FastAPI()
groq = AsyncGroq()

# routes
@app.post("/chat", response_model=BotResponse)
async def chat(user_input: UserMessage):
    user_message = user_input.message

    if not user_message:
        return BotResponse(reply="", error="No message provided.")

    chat_response = await get_response(user_message)

    return BotResponse(reply=chat_response)

# helper functions
async def get_response(user_message: str) -> str:
    try:
        chat_completion = await groq.chat.completions.create(
            # llama-3.3-70b-versatile
            model="meta-llama/llama-4-maverick-17b-128e-instruct",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_message}
            ]
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        print(f"Error calling API: {e}")
        raise # re-raise to be handled by the route