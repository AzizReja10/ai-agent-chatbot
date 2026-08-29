import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage,ToolMessage
load_dotenv()

# @tool turns a plain Python function into something LangChain can describe
# to the LLM. The docstring becomes the tool's description — this is what
# the LLM reads to decide when to use it, so it must be precise.
@tool
def get_weather(city: str) -> str:
    """Get the current weather for a given city name."""
    return f"It is sunny in {city}."

llm = ChatOpenAI(
    model="nvidia/nemotron-3-ultra-550b-a55b:free",
    openai_api_key=os.getenv("OPENROUTER_API_KEY"),
    openai_api_base="https://openrouter.ai/api/v1",
)

# bind_tools() doesn't call the tool — it just attaches the tool's
# schema to the request so the LLM KNOWS the tool exists and can choose it.
llm_with_tools = llm.bind_tools([get_weather])

response = llm_with_tools.invoke("What's the weather like in Kolkata?")

print("Content:", response.content)
print("Tool calls:", response.tool_calls)
message=[HumanMessage(content="what is the weather in kolkata")]
ai_msg=llm_with_tools.invoke(message)
message.append(ai_msg)
for tool_call in ai_msg.tool_calls:
    result = get_weather.invoke(tool_call["args"])
    message.append(ToolMessage(content=result, tool_call_id=tool_call["id"]))
final_res=llm_with_tools.invoke(message)
print(final_res.content)