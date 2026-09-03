import os
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

scopes = [
    "https://www.googleapis.com/auth/tasks",  # already full read/write, no change needed
    "https://www.googleapis.com/auth/calendar",  # was calendar.readonly — full access now
    "https://www.googleapis.com/auth/documents",  # was documents.readonly — full access now
    "https://www.googleapis.com/auth/drive",  # was drive.readonly — needed to create new Docs, not just find existing ones
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
]
PROJECT_ROOT = Path(__file__).resolve().parents[3]
TOKEN_PATH = PROJECT_ROOT / "token.json"
CREDENTIAL_PATH = PROJECT_ROOT / "credential.json"


def get_google_credentials():
    creds = None
    if TOKEN_PATH.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_PATH), scopes)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not CREDENTIAL_PATH.exists():
                raise FileNotFoundError(
                    f"Google OAuth client secrets file not found at {CREDENTIAL_PATH}. "
                    "Place credential.json in the project root."
                )
            flow = InstalledAppFlow.from_client_secrets_file(str(CREDENTIAL_PATH), scopes)
            creds = flow.run_local_server(port=0)

        with TOKEN_PATH.open("w", encoding="utf-8") as token_file:
            token_file.write(creds.to_json())

    return creds


if __name__ == "__main__":
    creds = get_google_credentials()
    print("got credentials: ", creds.valid)
