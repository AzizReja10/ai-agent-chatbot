# check_state.py
from app.agent.agent_factory import build_agent
agent = build_agent()
questions = [
    "what tasks do I have?",
    "add a task to buy groceries",
    "schedule a meeting called 'Standup' tomorrow at 10am for 30 minutes",
    "add a note to my sbTask doc saying 'remember to review labels'",
]

config = {"configurable": {"thread_id": "write-tools-test"}}

for q in questions:
    print("Q:", q)
    response = agent.invoke({"messages": [{"role": "user", "content": q}]}, config=config)
    print("A:", response["messages"][-1].content)
    print("---")