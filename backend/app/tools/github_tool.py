# app/tools/github_tool.py
from pydantic import BaseModel, Field
from langchain_core.tools import tool
import requests
from app.user_context import current_user_id
from app.db import SessionLocal
from app.models import GitHubCredential
import re
from urllib.parse import urlparse

class GitHubNotConnectedError(Exception):
    pass

def parse_repo_identifier(repo: str) -> tuple[str, str]:
    """Accepts either 'owner/repo' or a full GitHub URL, returns (owner, repo)."""
    repo = repo.strip()
    if repo.startswith("http"):
        path = urlparse(repo).path.strip("/")
        parts = path.split("/")
        if len(parts) >= 2:
            return parts[0], parts[1]
        raise ValueError("Could not parse owner/repo from that URL.")
    if "/" in repo:
        owner, name = repo.split("/", 1)
        return owner, name
    raise ValueError("Provide either 'owner/repo' or a full GitHub URL.")
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

class RepoInfoInput(BaseModel):
    repo: str = Field(description="A GitHub repo as 'owner/repo', or a full GitHub URL like https://github.com/owner/repo")
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
@tool("get_github_repo_info", args_schema=RepoInfoInput)
def get_github_repo_info(repo: str) -> str:
    """Get general information about a GitHub repository — its description,
    primary language, star count, and topics. Use this whenever the user
    shares a GitHub repo URL or asks to know more about / summarize a repo,
    as opposed to asking specifically about its issues."""
    try:
        token = get_github_token()
    except GitHubNotConnectedError as e:
        return str(e)

    try:
        owner, name = parse_repo_identifier(repo)
    except ValueError as e:
        return str(e)

    url = f"https://api.github.com/repos/{owner}/{name}"
    headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json"}

    try:
        response = requests.get(url, headers=headers)
    except requests.exceptions.RequestException as e:
        return f"Network error while contacting GitHub: {e}"

    if response.status_code == 404:
        return f"No repository found at {owner}/{name}."
    elif response.status_code != 200:
        return f"GitHub API returned an unexpected error: {response.status_code}"

    data = response.json()
    description = data.get("description") or "(no description provided)"
    language = data.get("language") or "unknown"
    stars = data.get("stargazers_count", 0)
    topics = ", ".join(data.get("topics", [])) or "none"

    return (
        f"Repo: {owner}/{name}\n"
        f"Description: {description}\n"
        f"Primary language: {language}\n"
        f"Stars: {stars}\n"
        f"Topics: {topics}"
    )