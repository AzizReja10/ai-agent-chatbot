# app/github_oauth_routes.py
import requests
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session as DBSession
from app.db import SessionLocal
from app.models import GitHubCredential
from app.auth import get_current_user, store_oauth_state, pop_oauth_state, create_signin_handoff
from app.config import GITHUB_OAUTH_CLIENT_ID, GITHUB_OAUTH_CLIENT_SECRET

router = APIRouter()
FRONTEND_URL = "http://localhost:5173"
GITHUB_REDIRECT_URI = "http://127.0.0.1:8000/auth/github/callback"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/auth/github/signin")
def github_signin(db: DBSession = Depends(get_db)):
    import secrets
    state = secrets.token_urlsafe(24)
    store_oauth_state(db, state, {"mode": "signin"})

    auth_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={GITHUB_OAUTH_CLIENT_ID}"
        f"&redirect_uri={GITHUB_REDIRECT_URI}"
        f"&scope=read:user user:email"
        f"&state={state}"
    )
    return RedirectResponse(auth_url)


@router.get("/auth/github/login")
def github_login(request: Request, db: DBSession = Depends(get_db)):
    user = get_current_user(request, db)
    if not user:
        raise HTTPException(status_code=401, detail="Not logged in")

    import secrets
    state = secrets.token_urlsafe(24)
    store_oauth_state(db, state, {"mode": "connect", "user_id": user.id})

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
    pending = pop_oauth_state(db, state)
    if not pending:
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

    if pending["mode"] == "connect":
        user_id = pending["user_id"]
        existing = db.query(GitHubCredential).filter(GitHubCredential.user_id == user_id).first()
        if existing:
            existing.access_token = access_token
        else:
            db.add(GitHubCredential(user_id=user_id, access_token=access_token))
        db.commit()
        return RedirectResponse(f"{FRONTEND_URL}?github_connected=true")

    else:
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

        handoff_token = create_signin_handoff(db, user.id)
        return RedirectResponse(f"{FRONTEND_URL}?signin_token={handoff_token}")