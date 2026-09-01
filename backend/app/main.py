from fastapi import FastAPI
from pydantic import BaseModel
from app.agent.agent_factory import build_agent
from fastapi.responses import StreamingResponse
from app.agent.safe_action_flow import find_pending_draft,is_confirmation,draft_to_action as DRAFT_TO_ACTION,handle_user_turn
from langchain_core.messages import HumanMessage,AIMessage
app=FastAPI()
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

        yield f"data: {result}\n\n"
        yield "data: [DONE]\n\n"
        return

    full_response = ""
    tool_call_record = None  # will hold (name, args, tool_call_id) if a draft tool fires

    async for event in agent.astream_events(
    {"messages": [{"role": "user", "content": message}]},
    config=config,
    version="v2",
):
        if event["event"] == "on_tool_start":
            print("TOOL START:", event.get("name"), "| in DRAFT_TO_ACTION?", event.get("name") in DRAFT_TO_ACTION)

        if event["event"] == "on_tool_start" and event.get("name") in DRAFT_TO_ACTION:
            tool_call_record = {
                "name": event["name"],
                "args": event["data"]["input"],
            }

        if event["event"] == "on_chat_model_stream":
            chunk = event["data"]["chunk"]
            if chunk.content:
                full_response += chunk.content
                yield f"data: {chunk.content}\n\n"

    # Persist history properly, INCLUDING the tool call if one happened
    new_messages = [HumanMessage(content=message)]

    if tool_call_record:
        import uuid
        call_id = f"call_{uuid.uuid4()}"
        new_messages.append(AIMessage(
            content="",
            tool_calls=[{
                "name": tool_call_record["name"],
                "args": tool_call_record["args"],
                "id": call_id,
            }],
        ))
        # We don't have the exact ToolMessage content here without re-deriving it,
        # but find_pending_draft only needs the AIMessage.tool_calls to work.

    new_messages.append(AIMessage(content=full_response))

    agent.update_state(config, {"messages": new_messages})

    yield "data: [DONE]\n\n"
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