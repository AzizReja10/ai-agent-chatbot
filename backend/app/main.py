from fastapi import FastAPI
from pydantic import BaseModel
from app.agent.agent_factory import build_agent
from fastapi.responses import StreamingResponse
from app.agent.safe_action_flow import find_pending_draft,is_confirmation,draft_to_action as DRAFT_TO_ACTION,handle_user_turn
from langchain_core.messages import HumanMessage,AIMessage
from fastapi.middleware.cors import CORSMiddleware
import json
app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
agent=build_agent()

class ChatRequest(BaseModel):
    thread_id:str
    message:str
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
        yield f"data: {json.dumps({'type':'done'})}"
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
async def chat_stream(request:ChatRequest):
    return StreamingResponse(
        event_generator(request.thread_id,request.message),
        media_type="text/event-stream"
    )
@app.post("/chat",response_model=ChatResponse)
def chat(request:ChatRequest):
    reply=handle_user_turn(agent,request.thread_id,request.message)
    return ChatResponse(reply=reply)