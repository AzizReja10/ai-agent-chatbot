from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from app.config import OPENROUTER_API_KEY
from app.config import GROQ_API_KEY
from app.tools.github_tool import list_github_issues
# from app.tools.test_tool_calling import get_weather
from app.tools.tasks_tool import list_google_tasks
from app.tools.calender_tool import list_upcoming_events
from app.tools.docs_tool import read_google_docs
from app.tools.gmail_tool import list_recent_emails,draft_email,send_email
def build_agent():
    llm=ChatOpenAI(
        model="openai/gpt-oss-120b",
        openai_api_key=GROQ_API_KEY,
        openai_api_base="https://api.groq.com/openai/v1"
    )
    tools=[
        list_github_issues,
        list_google_tasks,
        list_upcoming_events,
        read_google_docs,
        list_recent_emails,
        draft_email,
    ]
    agent = create_agent(
        model=llm,
        tools=tools,
        system_prompt="You are a helpful assistant with access to tools. Use them "
            "when needed to answer accurately. IMPORTANT: when the user "
            "asks you to email someone, ALWAYS call draft_email first and "
            "show the draft. NEVER call send_email until the user has "
            "explicitly confirmed in a separate message that the draft "
            "should be sent."
    )
    return agent