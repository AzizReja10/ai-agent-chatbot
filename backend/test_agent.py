from app.agent.agent_factory import build_agent
agent=build_agent()
response=agent.invoke({"messages":[{"role":"user","content":"what are the open issues in the langchain-ai/langchain repo?"}]})
print(response["messages"][-1].content)