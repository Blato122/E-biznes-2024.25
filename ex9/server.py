# from openai import AsyncOpenAI
from groq import AsyncGroq
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
import random

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

# define opening and closing phrases (4.0)
OPENING_PHRASES = [
    "Hello there! How can I help you today?",
    "Welcome! What can I do for you?",
    "Hi! I'm ready to assist you. What's your question?",
    "Good day! How may I be of service?",
    "Hey! Let me know what you need help with."
]

CLOSING_PHRASES = [
    "Goodbye! Have a great day!",
    "Farewell! Feel free to reach out if you need anything else.",
    "Thanks for chatting! See you next time.",
    "It was nice talking to you. Take care!",
    "Closing the chat now. Have a good one!"
]

# routes
@app.post("/chat", response_model=BotResponse)
async def chat(user_input: UserMessage):
    user_message = user_input.message

    if not user_message:
        return BotResponse(reply="", error="No message provided.")

    try:
        llm_response_content = await get_response(user_message)
        final_reply = llm_response_content

        user_message_lower = user_message.lower()
        closing_keywords = ["bye", "goodbye", "thank you", "thanks", "that's all", "appreciate it", "end chat", "finish"]
        
        # check if the user's message primarily indicates a closing intent
        # this is a simple check - more sophisticated NLP could be used for better accuracy
        is_closing_intent = any(keyword in user_message_lower for keyword in closing_keywords)
        
        if is_closing_intent: # heuristic: if message has a keyword
            if CLOSING_PHRASES:
                final_reply += " " + random.choice(CLOSING_PHRASES)

        return BotResponse(reply=final_reply)
    except Exception as e:
        print(f"Error in chat endpoint: {e}") # log the error
        return BotResponse(reply="", error="Sorry, I encountered an error processing your request.")

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