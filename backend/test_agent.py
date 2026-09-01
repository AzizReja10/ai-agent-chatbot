# check_state.py
from app.agent.agent_factory import build_agent
from app.agent.safe_action_flow import find_pending_draft

agent = build_agent()

config = {"configurable": {"thread_id": "stream-gate-test"}}
state = agent.get_state(config)
print(find_pending_draft(state.values.get("messages", [])))