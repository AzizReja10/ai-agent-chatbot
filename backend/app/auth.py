# app/auth.py
import secrets
import bcrypt
from sqlalchemy.orm import Session as DBSession
from app.models import User, Session as SessionModel


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
    db.add(SessionModel(id=session_id, user_id=user_id))
    db.commit()
    return session_id


def get_current_user(request, db: DBSession):
    session_id = request.cookies.get("session_id")
    if not session_id:
        return None

    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session:
        return None

    return db.query(User).filter(User.id == session.user_id).first()