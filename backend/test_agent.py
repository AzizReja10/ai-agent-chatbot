from app.agent.agent_factory import build_agent
from app.agent.safe_email_flow import handle_user_turn

agent = build_agent()
reply1, messages = handle_user_turn(agent, [], "send a slack message to #social saying hello team")
print("Turn 1:", reply1)

reply2, messages = handle_user_turn(agent, messages, "no,do not send it")
print("Turn 2:", reply2)