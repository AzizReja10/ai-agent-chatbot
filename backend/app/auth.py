# app/auth.py
import secrets
import bcrypt
import json
from app.models import OAuthState
from sqlalchemy.orm import Session as DBSession
from app.models import User, Session as SessionModel
from datetime import datetime, timezone, timedelta

SESSION_LIFETIME = timedelta(days=7)
def hash_password(password: str) -> str:
    pwd_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    pwd_bytes = password.encode("utf-8")[:72]
    hashed_bytes = hashed.encode("utf-8")
    return bcrypt.checkpw(pwd_bytes, hashed_bytes)


def create_session(db: DBSession, user_id: int) -> str:
    session_id = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + SESSION_LIFETIME
    db.add(SessionModel(id=session_id, user_id=user_id, expires_at=expires_at))
    db.commit()
    return session_id


def get_current_user(request, db: DBSession):
    session_id = request.cookies.get("session_id")
    if not session_id:
        return None

    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session:
        return None

    expires_at = session.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at < datetime.now(timezone.utc):
        db.delete(session)  # clean up expired sessions as we encounter them
        db.commit()
        return None

    return db.query(User).filter(User.id == session.user_id).first()


def store_oauth_state(db: DBSession, key: str, payload: dict):
    db.add(OAuthState(id=key, payload_json=json.dumps(payload)))
    db.commit()


# app/auth.py
def pop_oauth_state(db: DBSession, key: str):
    record = db.query(OAuthState).filter(OAuthState.id == key).first()
    if not record:
        return None
    payload = json.loads(record.payload_json)

    deleted_count = db.query(OAuthState).filter(OAuthState.id == key).delete()
    db.commit()

    if deleted_count == 0:
        # Someone else already consumed this token in a race — treat as invalid
        return None

    return payload


def create_signin_handoff(db: DBSession, user_id: int) -> str:
    token = secrets.token_urlsafe(24)
    store_oauth_state(db, token, {"user_id": user_id})
    return token