from pydantic import BaseModel,Field
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langchain.agents import create_agent
import requests
from app.config import GITHUB_TOKEN,GROQ_API_KEY
class ListIssuesInput(BaseModel):
    owner:str=Field(description="Github username")
    repo:str=Field(description="repository name")
@tool("list_github_issues",args_schema=ListIssuesInput)
def list_github_issues(owner:str,repo:str)->str:
    """Fetch open issues for a given github repository, Use this when user ask about issues,bugs or apen tasks in a specific github repo."""
    token=GITHUB_TOKEN

    url=f"https://api.github.com/repos/{owner}/{repo}/issues"
    headers={
        "Authorization":f"Bearer {token}",
        "Accept":"application/vnd.github+json"
    }
    try:
        response=requests.get(url,headers=headers)
    except requests.exceptions.RequestException as e:
        return f"network error while contacting github :{e}"
    if response.status_code==404:
        return f"No repo found at {owner}/{repo}"
    elif response.status_code==401:
        return f"github authentication failed"
    elif response.status_code!=200:
        return f"GitHub API returned an unexpected error: {response.status_code}"
    data=response.json()
    if not data:
        return f"No open issus found for {owner}/{repo}"
    issue_lines=[]
    for issue in data:
       number=issue["number"]
       title=issue["title"]
       issue_lines.append(f"#{number}: {title}")
    result="\n".join(issue_lines)
    return result
@tool
def get_weather(city: str) -> str:
    """Get the current weather for a given city name."""
    return f"It is sunny in {city}."
llm=ChatOpenAI(
    model="openai/gpt-oss-20b",
    openai_api_key=GROQ_API_KEY,
    openai_api_base="https://api.groq.com/openai/v1"
)
llm_with_tools=llm.bind_tools([list_github_issues])
tools=[get_weather,list_github_issues]
agent=create_agent(
    model=llm,
    tools=tools,
    system_prompt="you are a helpful assistant with access to tools. Use them when needed to answer accurately"
)

if __name__=="__main__":
    questions=["what is the weather in kolkata?","what are the open issues in langchain-ai/langchain repo?","what is 15 times 23?"]
    for q in questions:
        print("Q: ",q)
        response = agent.invoke({"messages": [{"role": "user", "content": q}]})
        print("A:", response["messages"][-1].content)
        print("---")