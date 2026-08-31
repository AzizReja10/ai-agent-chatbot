from app.agent.agent_factory import build_agent
from app.agent.safe_action_flow import handle_user_turn

agent = build_agent()
thread_id="test-conversation-1"
print("Turn 1:", handle_user_turn(agent, thread_id, "email rejaaziz686@gmail.com with subject 'Test2' saying hi again"))
print("Turn 2:", handle_user_turn(agent, thread_id, "yes, send it"))
print("Turn 3:", handle_user_turn(agent, thread_id, "what did I just send?"))