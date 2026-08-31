from app.tools.gmail_tool import send_email as real_send_email
from app.tools.slack_tool import send_slack_message as real_send_slack_message
from langchain_core.messages import HumanMessage, AIMessage
draft_to_action={
    "draft_email":real_send_email,
    "draft_slack_message":real_send_slack_message
}
def is_confirmation(text:str)->bool:
    text=text.lower().strip()
    confirmaing_phrases=["yes","send it","confirm","go ahead","do it"]
    return any(phrases in text for phrases in confirmaing_phrases)
def find_pending_draft(message):
    for m in reversed(message):
        if hasattr(m,"tool_calls") and m.tool_calls:
            for tc in m.tool_calls:
                if tc["name"] in draft_to_action:
                    return tc["name"],tc["args"]
    return None
def handle_user_turn(agent, thread_id, user_text):
    config = {"configurable": {"thread_id": thread_id}}

    state = agent.get_state(config)
    prior_messages = state.values.get("messages", [])

    pending = find_pending_draft(prior_messages)

    if pending and is_confirmation(user_text):
        draft_name, args = pending
        real_action = draft_to_action[draft_name]
        result = real_action.invoke(args)

        # Manually record what happened, so the agent's memory stays accurate
        agent.update_state(config, {
            "messages": [
                HumanMessage(content=user_text),
                AIMessage(content=result),
            ]
        })
        return result

    response = agent.invoke(
        {"messages": [{"role": "user", "content": user_text}]},
        config=config,
    )
    return response["messages"][-1].content