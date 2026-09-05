from fastapi import FastAPI
from pydantic import BaseModel
from app.agent.agent_factory import build_agent
from fastapi.responses import StreamingResponse
from app.agent.safe_action_flow import find_pending_draft,is_confirmation,draft_to_action as DRAFT_TO_ACTION,handle_user_turn
from langchain_core.messages import HumanMessage,AIMessage
from fastapi.middleware.cors import CORSMiddleware
import json
from app.auth import PENDING_SIGNIN_TOKENS
from app.models import Session as SessionModel
from fastapi import Depends, HTTPException, Response, Request
from sqlalchemy.orm import Session as DBSession
from app.db import Base, engine, SessionLocal
from app.google_oauth_routes import router as google_oauth_router
from app import models  # noqa: F401
from app.user_context import current_user_id
from app.models import User
from app.auth import hash_password, verify_password, create_session, get_current_user
from app.github_oauth_routes import router as github_oauth_router
app=FastAPI()
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class SignupRequest(BaseModel):
    email: str
    password: str
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
agent=build_agent()
app.include_router(github_oauth_router)
app.include_router(google_oauth_router)
class ChatRequest(BaseModel):
    message: str 
class ChatResponse(BaseModel):
    reply:str
async def event_generator(thread_id: str, message: str):
    config = {"configurable": {"thread_id": thread_id}}

    state = agent.get_state(config)
    prior_messages = state.values.get("messages", [])
    pending = find_pending_draft(prior_messages)

    if pending and is_confirmation(message):
        draft_name, args = pending
        real_action = DRAFT_TO_ACTION[draft_name]
        result = real_action.invoke(args)

        agent.update_state(config, {
            "messages": [HumanMessage(content=message), AIMessage(content=result)]
        })

        yield f"data: {json.dumps({'type':'token','content':result})}\n\n"
        yield f"data: {json.dumps({'type':'done'})}\n\n"
        return

    full_response = ""
    tool_call_record = None  # will hold (name, args, tool_call_id) if a draft tool fires

    async for event in agent.astream_events(
    {"messages": [{"role": "user", "content": message}]},
    config=config,
    version="v2",
):
        if event["event"] == "on_tool_start":
            yield f"data: {json.dumps({'type': 'tool_start', 'name': event.get('name'), 'args': event['data'].get('input', {})})}\n\n"
            if event.get("name") in DRAFT_TO_ACTION:
                tool_call_record = {"name": event["name"], "args": event["data"]["input"]}

        if event["event"] == "on_tool_end":
            yield f"data: {json.dumps({'type': 'tool_end', 'name': event.get('name')})}\n\n"

        if event["event"] == "on_chat_model_stream":
            chunk = event["data"]["chunk"]
            if chunk.content:
                full_response += chunk.content
                yield f"data: {json.dumps({'type': 'token', 'content': chunk.content})}\n\n"

    new_messages = [HumanMessage(content=message)]
    if tool_call_record:
        import uuid
        new_messages.append(AIMessage(
            content="",
            tool_calls=[{
                "name": tool_call_record["name"],
                "args": tool_call_record["args"],
                "id": f"call_{uuid.uuid4()}",
            }],
        ))
    new_messages.append(AIMessage(content=full_response))
    agent.update_state(config, {"messages": new_messages})

    yield f"data: {json.dumps({'type': 'done'})}\n\n"
@app.post("/chat/stream")
async def chat_stream(request: ChatRequest, http_request: Request, db: DBSession = Depends(get_db)):
    user = get_current_user(http_request, db)
    if not user:
        raise HTTPException(status_code=401, detail="Not logged in")

    current_user_id.set(user.id)  # <-- this line was missing here

    thread_id = f"user-{user.id}"
    return StreamingResponse(
        event_generator(thread_id, request.message),
        media_type="text/event-stream",
    )
# app/main.py — updated /chat and /chat/stream

@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest, http_request: Request, db: DBSession = Depends(get_db)):
    user = get_current_user(http_request, db)
    if not user:
        raise HTTPException(status_code=401, detail="Not logged in")

    current_user_id.set(user.id)  # <-- every tool call during this request can now read this

    thread_id = f"user-{user.id}"
    reply = handle_user_turn(agent, thread_id, request.message)
    return ChatResponse(reply=reply)
@app.post("/auth/signup")
def signup(request: SignupRequest, response: Response, db: DBSession = Depends(get_db)):
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(email=request.email, hashed_password=hash_password(request.password))
    db.add(user)
    db.commit()
    db.refresh(user)

    session_id = create_session(db, user.id)
    response.set_cookie(
    key="session_id",
    value=session_id,
    httponly=True,
    samesite="lax",
    max_age=60 * 60 * 24 * 7,  # 7 days
)
    return {"email": user.email}

@app.post("/auth/login")
def login(request: SignupRequest, response: Response, db: DBSession = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    session_id = create_session(db, user.id)
    response.set_cookie(
    key="session_id",
    value=session_id,
    httponly=True,
    samesite="lax",
    max_age=60 * 60 * 24 * 7,  # 7 days
)
    return {"email": user.email}
# app/main.py
@app.post("/auth/logout")
def logout(request: Request, response: Response, db: DBSession = Depends(get_db)):
    session_id = request.cookies.get("session_id")
    if session_id:
        db.query(SessionModel).filter(SessionModel.id == session_id).delete()
        db.commit()

    response.delete_cookie("session_id")
    return {"logged_out": True}
# app/main.py — update the /auth/me route
@app.get("/auth/me")
def me(request: Request, db: DBSession = Depends(get_db)):
    user = get_current_user(request, db)
    if not user:
        raise HTTPException(status_code=401, detail="Not logged in")
    return {"id": user.id, "email": user.email}
@app.get("/debug/google-creds/{user_id}")
def debug_google_creds(user_id: int, db: DBSession = Depends(get_db)):
    from app.models import GoogleCredential
    cred = db.query(GoogleCredential).filter(GoogleCredential.user_id == user_id).first()
    return {"found": cred is not None, "token_json_length": len(cred.token_json) if cred else 0}
# app/main.py
@app.get("/auth/github/status")
def github_status(request: Request, db: DBSession = Depends(get_db)):
    user = get_current_user(request, db)
    if not user:
        raise HTTPException(status_code=401, detail="Not logged in")
    from app.models import GitHubCredential
    connected = db.query(GitHubCredential).filter(GitHubCredential.user_id == user.id).first() is not None
    return {"connected": connected}
@app.post("/auth/finalize")
def finalize_signin(token: str, response: Response, db: DBSession = Depends(get_db)):
    user_id = PENDING_SIGNIN_TOKENS.pop(token, None)
    if not user_id:
        raise HTTPException(status_code=400, detail="Invalid or expired sign-in token")

    session_id = create_session(db, user_id)
    response.set_cookie(key="session_id", value=session_id, httponly=True, samesite="lax", max_age=60 * 60 * 24 * 7)
    return {"ok": True}