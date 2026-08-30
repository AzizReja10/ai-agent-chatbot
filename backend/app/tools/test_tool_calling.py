from langchain_core.tools import tool


# @tool turns a plain Python function into something LangChain can describe
# to the LLM. The docstring becomes the tool's description — this is what
# the LLM reads to decide when to use it, so it must be precise.
@tool
def get_weather(city: str) -> str:
    """Get the current weather for a given city name."""
    return f"It is sunny in {city}."