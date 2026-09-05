# app/github_oauth_routes.py
import secrets
import requests
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session as DBSession
from app.db import SessionLocal
from app.models import GitHubCredential
from app.auth import get_current_user
from app.config import GITHUB_OAUTH_CLIENT_ID, GITHUB_OAUTH_CLIENT_SECRET
from app.auth import create_signin_handoff
router = APIRouter()
FRONTEND_URL = "http://localhost:5173"
GITHUB_REDIRECT_URI = "http://127.0.0.1:8000/auth/github/callback"

PENDING_GITHUB_STATES = {}  # state -> user_id
PENDING_GITHUB_SIGNIN_STATES = {} 

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/auth/github/login")
def github_login(request: Request, db: DBSession = Depends(get_db)):
    user = get_current_user(request, db)
    if not user:
        raise HTTPException(status_code=401, detail="Not logged in")

    state = secrets.token_urlsafe(24)
    PENDING_GITHUB_STATES[state] = user.id

    auth_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={GITHUB_OAUTH_CLIENT_ID}"
        f"&redirect_uri={GITHUB_REDIRECT_URI}"
        f"&scope=repo"
        f"&state={state}"
    )
    return RedirectResponse(auth_url)


@router.get("/auth/github/callback")
def github_callback(code: str, state: str, db: DBSession = Depends(get_db)):
    user_id = PENDING_GITHUB_STATES.pop(state, None)
    if not user_id:
        raise HTTPException(status_code=400, detail="Invalid or expired OAuth state")

    token_response = requests.post(
        "https://github.com/login/oauth/access_token",
        headers={"Accept": "application/json"},
        data={
            "client_id": GITHUB_OAUTH_CLIENT_ID,
            "client_secret": GITHUB_OAUTH_CLIENT_SECRET,
            "code": code,
            "redirect_uri": GITHUB_REDIRECT_URI,
        },
    ).json()

    access_token = token_response.get("access_token")
    if not access_token:
        raise HTTPException(status_code=400, detail="GitHub did not return an access token")

    existing = db.query(GitHubCredential).filter(GitHubCredential.user_id == user_id).first()
    if existing:
        existing.access_token = access_token
    else:
        db.add(GitHubCredential(user_id=user_id, access_token=access_token))
    db.commit()

    return RedirectResponse(f"{FRONTEND_URL}?github_connected=true")
@router.get("/auth/github/signin")
def github_signin():
    state = secrets.token_urlsafe(24)
    PENDING_GITHUB_SIGNIN_STATES[state] = True

    auth_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={GITHUB_OAUTH_CLIENT_ID}"
        f"&redirect_uri=http://127.0.0.1:8000/auth/github/signin/callback"
        f"&scope=read:user user:email"
        f"&state={state}"
    )
    return RedirectResponse(auth_url)


@router.get("/auth/github/signin/callback")
def github_signin_callback(code: str, state: str, db: DBSession = Depends(get_db)):
    if state not in PENDING_GITHUB_SIGNIN_STATES:
        raise HTTPException(status_code=400, detail="Invalid or expired sign-in state")
    PENDING_GITHUB_SIGNIN_STATES.pop(state)

    token_response = requests.post(
        "https://github.com/login/oauth/access_token",
        headers={"Accept": "application/json"},
        data={
            "client_id": GITHUB_OAUTH_CLIENT_ID,
            "client_secret": GITHUB_OAUTH_CLIENT_SECRET,
            "code": code,
            "redirect_uri": "http://127.0.0.1:8000/auth/github/signin/callback",
        },
    ).json()

    access_token = token_response.get("access_token")
    if not access_token:
        raise HTTPException(status_code=400, detail="GitHub did not return an access token")

    headers = {"Authorization": f"Bearer {access_token}"}
    emails = requests.get("https://api.github.com/user/emails", headers=headers).json()
    primary_email = next((e["email"] for e in emails if e.get("primary")), None)

    if not primary_email:
        raise HTTPException(status_code=400, detail="Could not retrieve a verified email from GitHub")

    from app.models import User
    user = db.query(User).filter(User.email == primary_email).first()
    if not user:
        user = User(email=primary_email, hashed_password=None)
        db.add(user)
        db.commit()
        db.refresh(user)

    handoff_token = create_signin_handoff(user.id)
    return RedirectResponse(f"{FRONTEND_URL}?signin_token={handoff_token}")