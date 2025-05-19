import streamlit as st
import requests
import json

BACKEND_URL = "http://127.0.0.1:8000/chat" # URL of the FastAPI backend

st.set_page_config(page_title="Chatbot", layout="centered")
st.title("E-biznes ex9")

# initialize chat history in session state if it doesn't exist
if "messages" not in st.session_state:
    st.session_state.messages = []

# display past messages
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# get user input
user_prompt = st.chat_input("What's on your mind?")

if user_prompt:
    # add user message to chat history and display it
    st.session_state.messages.append({"role": "user", "content": user_prompt})
    with st.chat_message("user"):
        st.markdown(user_prompt)

    # send message to backend and get response
    try:
        payload = {"message": user_prompt}
        response = requests.post(BACKEND_URL, json=payload)
        response.raise_for_status() # raise an exception for HTTP errors (4xx or 5xx)
        
        bot_response_data = response.json()
        bot_reply = bot_response_data.get("reply")
        bot_error = bot_response_data.get("error")

        if bot_error:
            assistant_response = f"Error: {bot_error}"
        elif bot_reply:
            assistant_response = bot_reply
        else:
            assistant_response = "Sorry, I didn't get a valid response."

    except requests.exceptions.RequestException as e:
        assistant_response = f"Error connecting to the backend: {e}"
    except json.JSONDecodeError:
        assistant_response = "Error: Could not decode the response from the backend."
    except Exception as e:
        assistant_response = f"An unexpected error occurred: {e}"

    # add assistant response to chat history and display it
    st.session_state.messages.append({"role": "assistant", "content": assistant_response})
    with st.chat_message("assistant"):
        st.markdown(assistant_response)
    
    # uncomment to rerun the app after each message
    # st.rerun()