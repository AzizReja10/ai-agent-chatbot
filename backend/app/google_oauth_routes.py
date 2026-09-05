# app/google_oauth_routes.py
import os
import secrets
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import RedirectResponse
# pyrefly: ignore [missing-import]
from google_auth_oauthlib.flow import Flow
from sqlalchemy.orm import Session as DBSession
from app.db import SessionLocal
from app.models import GoogleCredential
from app.auth import create_session, get_current_user

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent
CREDENTIALS_FILE = str(BASE_DIR / "credentials_web.json")
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

PENDING_STATES = {}  # state -> {"user_id": ..., "code_verifier": ...}
PENDING_SIGNIN_STATES = {}  # state -> code_verifier
PENDING_SIGNIN_TOKENS = {}  # one-time handoff token -> user_id


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/auth/google/signin")
def google_signin():
    flow = Flow.from_client_secrets_file(
        CREDENTIALS_FILE, scopes=SIGNIN_SCOPES, redirect_uri=SIGNIN_REDIRECT_URI
    )
    auth_url, state = flow.authorization_url(prompt="select_account")
    PENDING_SIGNIN_STATES[state] = flow.code_verifier
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

    PENDING_STATES[state] = {"user_id": user.id, "code_verifier": flow.code_verifier}

    return RedirectResponse(auth_url)


@router.get("/auth/google/callback")
def google_callback(request: Request, code: str, state: str, db: DBSession = Depends(get_db)):
    pending = PENDING_STATES.pop(state, None)
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
    code_verifier = PENDING_SIGNIN_STATES.pop(state, None)
    if not code_verifier:
        raise HTTPException(status_code=400, detail="Invalid or expired sign-in state")

    flow = Flow.from_client_secrets_file(
        CREDENTIALS_FILE, scopes=SIGNIN_SCOPES, redirect_uri=SIGNIN_REDIRECT_URI
    )
    flow.code_verifier = code_verifier
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

    handoff_token = secrets.token_urlsafe(24)
    PENDING_SIGNIN_TOKENS[handoff_token] = user.id

    return RedirectResponse(f"{FRONTEND_URL}?signin_token={handoff_token}")


@router.post("/auth/google/finalize")
def finalize_signin(token: str, response: Response, db: DBSession = Depends(get_db)):
    user_id = PENDING_SIGNIN_TOKENS.pop(token, None)
    if not user_id:
        raise HTTPException(status_code=400, detail="Invalid or expired sign-in token")

    session_id = create_session(db, user_id)
    response.set_cookie(key="session_id", value=session_id, httponly=True, samesite="lax", max_age=60 * 60 * 24 * 7)
    return {"ok": True}