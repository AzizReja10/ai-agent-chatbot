# app/tools/github_tool.py
from pydantic import BaseModel, Field
from langchain_core.tools import tool
import requests
from app.user_context import current_user_id
from app.db import SessionLocal
from app.models import GitHubCredential


class GitHubNotConnectedError(Exception):
    pass


def get_github_token():
    user_id = current_user_id.get()
    if user_id is None:
        raise RuntimeError("No user context set")

    db = SessionLocal()
    try:
        record = db.query(GitHubCredential).filter(GitHubCredential.user_id == user_id).first()
        if not record:
            raise GitHubNotConnectedError("You haven't connected your GitHub account yet. Please connect it to use this feature.")
        return record.access_token
    finally:
        db.close()


class ListIssuesInput(BaseModel):
    owner: str = Field(description="GitHub username or organization that owns the repo")
    repo: str = Field(description="Repository name, without the owner prefix")


@tool("list_github_issues", args_schema=ListIssuesInput)
def list_github_issues(owner: str, repo: str) -> str:
    """Fetch open issues for a given GitHub repository. Use this when the
    user asks about issues, bugs, or open tasks in a specific GitHub repo."""
    try:
        token = get_github_token()
    except GitHubNotConnectedError as e:
        return str(e)

    url = f"https://api.github.com/repos/{owner}/{repo}/issues"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json"
    }

    try:
        response = requests.get(url, headers=headers)
    except requests.exceptions.RequestException as e:
        return f"Network error while contacting GitHub: {e}"

    if response.status_code == 404:
        return f"No repository found at {owner}/{repo}. Check the owner and repo name."
    elif response.status_code == 401:
        return "GitHub authentication failed — your connected account may need to be reconnected."
    elif response.status_code != 200:
        return f"GitHub API returned an unexpected error: {response.status_code}"

    data = response.json()

    if not data:
        return f"No open issues found in {owner}/{repo}."

    issue_lines = []
    for issue in data:
        number = issue["number"]
        title = issue["title"]
        issue_lines.append(f"#{number}: {title}")

    return "\n".join(issue_lines)