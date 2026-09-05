from langchain_community.tools import DuckDuckGoSearchRun
web_search=DuckDuckGoSearchRun()
web_search.description = (
    "Search the web for current information, news, or general knowledge "
    "not related to the user's personal accounts (calendar, tasks, email, "
    "GitHub, docs), NOT for weather (use get_weather instead), and NOT for "
    "GitHub repository details (use the GitHub tools instead). Use this only "
    "for real-world facts or current events with no other tool available."
)
if __name__=='__main__':
    print(web_search.invoke("What is the independence date of India?"))