from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# =========================
# DATABASE CONFIG
# =========================
DATABASE_URL = "mysql+pymysql://root:Niazi%401985__@localhost/auth_db"

# =========================
# ENGINE
# =========================
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,      # prevents stale connections
)

# =========================
# SESSION
# =========================
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# =========================
# BASE MODEL
# =========================
Base = declarative_base()

# =========================
# DB DEPENDENCY (REQUIRED)
# =========================
def get_db():
    """
    FastAPI dependency.
    Creates a DB session per request and
    safely closes it afterwards.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
