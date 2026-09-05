# app/google_oauth_routes.py
import os
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from google_auth_oauthlib.flow import Flow
from sqlalchemy.orm import Session as DBSession
from app.db import SessionLocal
from app.models import GoogleCredential
from app.auth import get_current_user, store_oauth_state, pop_oauth_state, create_signin_handoff
import json
import tempfile
router = APIRouter()
BASE_DIR = Path(__file__).resolve().parent.parent

def get_credentials_file_path():
    local_path = BASE_DIR / "credentials_web.json"
    if local_path.exists():
        return str(local_path)

    creds_json = os.getenv("GOOGLE_CREDENTIALS_JSON")
    if not creds_json:
        raise RuntimeError("Neither credentials_web.json nor GOOGLE_CREDENTIALS_JSON env var is available")

    tmp = tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False)
    tmp.write(creds_json)
    tmp.close()
    return tmp.name

CREDENTIALS_FILE = get_credentials_file_path()
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

SCOPES = [
    "https://www.googleapis.com/auth/tasks",
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/documents",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
]
REDIRECT_URI = "http://127.0.0.1:8000/auth/google/callback"
SIGNIN_SCOPES = ["openid", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"]
SIGNIN_REDIRECT_URI = "http://127.0.0.1:8000/auth/google/signin/callback"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/auth/google/signin")
def google_signin(db: DBSession = Depends(get_db)):
    flow = Flow.from_client_secrets_file(
        CREDENTIALS_FILE, scopes=SIGNIN_SCOPES, redirect_uri=SIGNIN_REDIRECT_URI
    )
    auth_url, state = flow.authorization_url(prompt="select_account")
    print("PRODUCTION AUTH URL:", auth_url)  # temporary debug
    store_oauth_state(db, state, {"code_verifier": flow.code_verifier})
    return RedirectResponse(auth_url)


@router.get("/auth/google/login")
def google_login(request: Request, db: DBSession = Depends(get_db)):
    user = get_current_user(request, db)
    if not user:
        raise HTTPException(status_code=401, detail="Not logged in")

    flow = Flow.from_client_secrets_file(
        CREDENTIALS_FILE, scopes=SCOPES, redirect_uri=REDIRECT_URI
    )
    auth_url, state = flow.authorization_url(access_type="offline", prompt="consent")
    store_oauth_state(db, state, {"user_id": user.id, "code_verifier": flow.code_verifier})
    return RedirectResponse(auth_url)


@router.get("/auth/google/callback")
def google_callback(code: str, state: str, db: DBSession = Depends(get_db)):
    pending = pop_oauth_state(db, state)
    if not pending:
        raise HTTPException(status_code=400, detail="Invalid or expired OAuth state")

    user_id = pending["user_id"]

    flow = Flow.from_client_secrets_file(
        CREDENTIALS_FILE, scopes=SCOPES, redirect_uri=REDIRECT_URI
    )
    flow.code_verifier = pending["code_verifier"]
    flow.fetch_token(code=code)
    creds = flow.credentials

    existing = db.query(GoogleCredential).filter(GoogleCredential.user_id == user_id).first()
    if existing:
        existing.token_json = creds.to_json()
    else:
        db.add(GoogleCredential(user_id=user_id, token_json=creds.to_json()))
    db.commit()

    return RedirectResponse(f"{FRONTEND_URL}?google_connected=true")


@router.get("/auth/google/signin/callback")
def google_signin_callback(code: str, state: str, db: DBSession = Depends(get_db)):
    pending = pop_oauth_state(db, state)
    if not pending:
        raise HTTPException(status_code=400, detail="Invalid or expired sign-in state")

    flow = Flow.from_client_secrets_file(
        CREDENTIALS_FILE, scopes=SIGNIN_SCOPES, redirect_uri=SIGNIN_REDIRECT_URI
    )
    flow.code_verifier = pending["code_verifier"]
    flow.fetch_token(code=code)

    import requests as pyrequests
    userinfo = pyrequests.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        headers={"Authorization": f"Bearer {flow.credentials.token}"},
    ).json()
    email = userinfo["email"]

    from app.models import User
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(email=email, hashed_password=None)
        db.add(user)
        db.commit()
        db.refresh(user)

    handoff_token = create_signin_handoff(db, user.id)
    return RedirectResponse(f"{FRONTEND_URL}?signin_token={handoff_token}")