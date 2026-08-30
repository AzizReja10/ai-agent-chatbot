from app.agent.agent_factory import build_agent
agent=build_agent()
question=[
   "summarize my sbTask doc in 3 sentences"
]
for q in question:
    print("Q :",q)
    response=agent.invoke({"messages":[{"role":"user","content":q}]})
    print("A :",response["messages"][-1].content)
    print("-------------")