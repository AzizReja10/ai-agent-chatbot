from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from app.config import OPENROUTER_API_KEY
from app.config import GROQ_API_KEY
from app.tools.github_tool import list_github_issues
from app.tools.test_tool_calling import get_weather
def build_agent():
    llm=ChatOpenAI(
        model="openai/gpt-oss-20b",
        openai_api_key=GROQ_API_KEY,
        openai_api_base="https://api.groq.com/openai/v1"
    )
    tools=[list_github_issues,get_weather]
    agent=create_agent(model=llm,tools=tools,system_prompt="you are a helpful assistant with access to tools. Use them when needed to answer accurately.")
    return agent