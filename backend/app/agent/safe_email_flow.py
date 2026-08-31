from app.tools.gmail_tool import send_email as real_send_email
def is_confirmation(text:str)->bool:
    text =text.lower().strip()
    confirming_phrase=["yes","send it","confirm","go ahead","do it"]
    return any(phrase in text for phrase in confirming_phrase)
def find_pending_draft(messages):
    for m in reversed(messages):
        if hasattr(m,"tool_calls") and m.tool_calls:
            for tc in m.tool_calls:
                if tc["name"]=="draft_email":
                    return tc["args"]
    return None
def handle_user_turn(agent,prior_messages,user_text):
    pending_draft=find_pending_draft(prior_messages)
    if pending_draft and is_confirmation(user_text):
        result=real_send_email.invoke(pending_draft)
        return result,prior_messages
    new_messages=prior_messages+[{"role":"user","content":user_text}]
    response=agent.invoke({"messages":new_messages})
    return response["messages"][-1].content,response["messages"]
