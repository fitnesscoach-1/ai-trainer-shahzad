from fastapi import (
    FastAPI,
    Depends,
    HTTPException,
    status,
    Form,
    Body,
)
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# =========================
# LOCAL IMPORTS (PRESERVED)
# =========================
import models
import schemas
import auth
from database import SessionLocal, engine
from email_service import send_contact_email
from openai_service import (
    generate_ai_workout,
    generate_ai_diet,
)

# 🧠 AI MEMORY
from app.core.workout_normalizer import normalize_workout_plan
from app.core.ai_insight_engine import generate_ai_insights

# =========================
# APP INIT
# =========================
app = FastAPI(
    title="AI Trainer Shahzad API",
    version="1.0.0",
)

# =========================
# CORS (PRESERVED)
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "http://localhost:5178",
        "http://localhost:5179",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://127.0.0.1:5176",
        "http://127.0.0.1:5177",
        "http://127.0.0.1:5178",
        "http://127.0.0.1:5179",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# DATABASE
# =========================
models.Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =========================
# AUTH
# =========================
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    payload = auth.verify_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )

    user = (
        db.query(models.User)
        .filter(models.User.email == payload.get("sub"))
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user

# =========================
# AUTH ROUTES (UNCHANGED)
# =========================
@app.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = models.User(
        email=user.email,
        password=auth.hash_password(user.password),
        first_name=user.first_name,
        last_name=user.last_name,
        username=user.username,
        phone=user.phone,
        address=user.address,
        zip_code=user.zip_code,
        country=user.country,
        profile_image=user.profile_image,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully"}


@app.post("/login", response_model=schemas.Token)
def login(
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db),
):
    user = db.query(models.User).filter(models.User.email == username).first()

    if not user or not auth.verify_password(password, user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = auth.create_access_token(data={"sub": user.email})

    return {"access_token": token, "token_type": "bearer"}

# =========================
# PROFILE
# =========================
@app.get("/me", response_model=schemas.UserResponse)
def get_profile(current_user: models.User = Depends(get_current_user)):
    return current_user

# =========================
# WORKOUT GENERATION
# =========================
@app.post("/workouts/generate", response_model=schemas.WorkoutResponse)
def generate_workout(
    data: schemas.WorkoutCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workout_text = generate_ai_workout(data)

    workout = models.Workout(
        user_id=current_user.id,
        **data.dict(),
        workout_plan=workout_text,
    )

    db.add(workout)
    db.commit()
    db.refresh(workout)

    return workout

# =========================
# 🧠 WORKOUT MEMORY
# =========================
@app.get("/workouts/memory")
def get_workouts_with_memory(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workouts = (
        db.query(models.Workout)
        .filter(models.Workout.user_id == current_user.id)
        .order_by(models.Workout.created_at.desc())
        .all()
    )

    return [
        {
            "id": w.id,
            "created_at": w.created_at,
            "name": w.name,
            "fitness_goal": w.fitness_goal,
            "workout_plan": w.workout_plan,
            "normalized_exercises": normalize_workout_plan(w.workout_plan),
        }
        for w in workouts
    ]

# =========================
# 🧠 AI INSIGHTS (SINGLE SOURCE OF TRUTH)
# =========================
@app.get("/workouts/insights")
def get_workout_insights(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workouts = (
        db.query(models.Workout)
        .filter(models.Workout.user_id == current_user.id)
        .order_by(models.Workout.created_at.desc())
        .limit(10)
        .all()
    )

    normalized_sets = [
        normalize_workout_plan(w.workout_plan)
        for w in workouts
    ]

    insights = generate_ai_insights(normalized_sets)

    # 🧠 SAVE LONG-TERM MEMORY
    memory = models.AIInsight(
        user_id=current_user.id,
        source="workout",
        insights=insights,
    )

    db.add(memory)
    db.commit()

    return {
        "insights": insights,
        "saved": True,
    }

# =========================
# DELETE WORKOUT
# =========================
@app.delete("/workouts/{workout_id}")
def delete_workout(
    workout_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    workout = (
        db.query(models.Workout)
        .filter(
            models.Workout.id == workout_id,
            models.Workout.user_id == current_user.id,
        )
        .first()
    )

    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")

    db.delete(workout)
    db.commit()

    return {"message": "Workout deleted successfully"}

# =========================
# DIET (UNCHANGED)
# =========================
@app.post("/diet/generate", response_model=schemas.DietResponse)
def generate_diet(
    data: schemas.DietCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    diet_text = generate_ai_diet(data)

    diet = models.Diet(
        user_id=current_user.id,
        **data.dict(),
        diet_plan=diet_text,
    )

    db.add(diet)
    db.commit()
    db.refresh(diet)

    return diet


@app.get("/diets", response_model=list[schemas.DietResponse])
def get_diets(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(models.Diet)
        .filter(models.Diet.user_id == current_user.id)
        .order_by(models.Diet.created_at.desc())
        .all()
    )

# =========================
# CONTACT
# =========================
@app.post("/contact")
def contact(
    name: str = Body(...),
    email: str = Body(...),
    message: str = Body(...),
):
    if not send_contact_email(name, email, message):
        raise HTTPException(status_code=500, detail="Failed to send email")

    return {"message": "Message sent successfully"}

# =========================
# EXTRA ROUTERS (PRESERVED)
# =========================
import workout_tips
import workout_tip_history

app.include_router(workout_tips.router)
app.include_router(workout_tip_history.router)
