from app.agent.agent_factory import build_agent
if __name__ == "__main__":
    agent = build_agent()

    r1 = agent.invoke({"messages": [
        {"role": "user", "content": "email rejaaziz686@gmail.com with subject 'Test' saying hello"}
    ]})
    print("=== TURN 1 FULL TRACE ===")
    for m in r1["messages"]:
        print(type(m).__name__, "-", getattr(m, "content", None))
    print()

    r2 = agent.invoke({"messages": r1["messages"] + [
        {"role": "user", "content": "yes, send it"}
    ]})
    print("=== TURN 2 FULL TRACE ===")
    for m in r2["messages"]:
        print(type(m).__name__, "-", getattr(m, "content", None))