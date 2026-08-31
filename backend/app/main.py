from fastapi import FastAPI
from pydantic import BaseModel
from app.agent.agent_factory import build_agent
from app.agent.safe_action_flow import handle_user_turn

app=FastAPI()
agent=build_agent()

class ChatRequest(BaseModel):
    thread_id:str
    message:str
class ChatResponse(BaseModel):
    reply:str
@app.post("/chat",response_model=ChatResponse)
def chat(request:ChatRequest):
    reply=handle_user_turn(agent,request.thread_id,request.message)
    return ChatResponse(reply=reply)