from langchain_community.tools import DuckDuckGoSearchRun
web_search=DuckDuckGoSearchRun()
web_search.description=( "Search the web for current information, news, or general knowledge "
    "not related to the user's personal accounts (calendar, tasks, email, "
    "GitHub, docs). Use this for real-world facts or current events.")
if __name__=='__main__':
    print(web_search.invoke("What is the independence date of India?"))