from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from typing import Optional, Dict

# ---------------- Password Hashing ----------------
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password: str) -> str:
    """
    Hash password safely.
    bcrypt max length is 72 chars.
    """
    return pwd_context.hash(password[:72])

def verify_password(password: str, hashed: str) -> bool:
    """
    Verify password against hashed value.
    """
    return pwd_context.verify(password[:72], hashed)


# ---------------- JWT Settings ----------------
# ⚠️ IMPORTANT: Move this to ENV in production
SECRET_KEY = "your_secret_key_here_change_this"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# ---------------- JWT Functions ----------------
def create_access_token(
    data: Dict[str, str],
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create JWT access token.
    """
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


def verify_token(token: str) -> Optional[Dict]:
    """
    Verify JWT token and return payload.
    """
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        return payload
    except JWTError:
        return None
