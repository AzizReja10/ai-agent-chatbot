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
# app/tools/tasks_tool.py — add this function

@tool
def create_google_task(title: str, notes: str = "", due: str = "") -> str:
    """Create a new Google Task. due, if provided, must be an RFC 3339
    date like '2026-09-10T00:00:00Z'. Use this when the user asks to
    add, create, or remember a to-do item."""
    creds = get_google_credentials()
    service = build("tasks", "v1", credentials=creds)

    task_body = {"title": title, "notes": notes}
    if due:
        task_body["due"] = due

    try:
        created = service.tasks().insert(tasklist="@default", body=task_body).execute()
    except Exception as e:
        return f"Failed to create task: {e}"

    return f"Task '{title}' created."
if __name__ == "__main__":
    print(create_google_task.invoke({"title": "Test Task", "notes": "Testing create tool"}))