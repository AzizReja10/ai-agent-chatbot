import os
from pathlib import Path
import json
from google.auth.transport.requests import Request as GoogleRequest
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from app.user_context import current_user_id
from app.db import SessionLocal
from app.models import GoogleCredential

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
class GoogleNotConnectedError(Exception):
    pass

def get_google_credentials():
    user_id = current_user_id.get()
    if user_id is None:
        raise RuntimeError("No user context set — get_google_credentials() called outside a request")

    db = SessionLocal()
    try:
        record = db.query(GoogleCredential).filter(GoogleCredential.user_id == user_id).first()
        if not record:
            raise RuntimeError("This user hasn't connected a Google account yet.")

        creds = Credentials.from_authorized_user_info(json.loads(record.token_json))

        if creds.expired and creds.refresh_token:
            creds.refresh(GoogleRequest())
            record.token_json = creds.to_json()  # save the refreshed token back
            db.commit()

        return creds
    finally:
        db.close()
def get_google_credentials():
    user_id = current_user_id.get()
    if user_id is None:
        raise RuntimeError("No user context set — get_google_credentials() called outside a request")

    db = SessionLocal()
    try:
        record = db.query(GoogleCredential).filter(GoogleCredential.user_id == user_id).first()
        if not record:
            raise GoogleNotConnectedError("You haven't connected your Google account yet. Please connect it to use this feature.")

        creds = Credentials.from_authorized_user_info(json.loads(record.token_json))

        if creds.expired and creds.refresh_token:
            creds.refresh(GoogleRequest())
            record.token_json = creds.to_json()
            db.commit()

        return creds
    finally:
        db.close()
        
if __name__ == "__main__":
    creds = get_google_credentials()
    print("got credentials: ", creds.valid)
