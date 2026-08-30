from langchain_core.tools import tool
from googleapiclient.discovery import build
from app.tools.google_auth import get_google_credentials

@tool
def list_google_tasks()->str:
    """List the user's pending tasks from their default Google Task List."""
    creds = get_google_credentials()
    service = build("tasks", "v1", credentials=creds)
    results = service.tasks().list(tasklist="@default").execute()
    items = results.get("items", [])
    if not items:
        return "no pending tasks found."
    task_lines=[]
    for item in items:
        title=item.get("title","(untitled)")
        status=item.get("status","unknown")
        task_lines.append(f"- {title} [{status}]")
    return "\n".join(task_lines)
if __name__=="__main__":
    print(list_google_tasks.invoke({}))