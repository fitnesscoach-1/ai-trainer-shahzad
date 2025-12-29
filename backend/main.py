from fastapi import FastAPI, Depends, HTTPException, status, Form
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Body

from email_service import send_contact_email

import models
import schemas
import auth
from database import SessionLocal, engine

from openai_service import (
    generate_ai_workout,
    generate_ai_diet,
)

# =========================
# APP INIT
# =========================
app = FastAPI()

# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

    user = db.query(models.User).filter(
        models.User.email == payload.get("sub")
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

# =========================
# AUTH ROUTES
# =========================
@app.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = auth.hash_password(user.password)

    new_user = models.User(
        email=user.email,
        password=hashed_password,
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
    db_user = db.query(models.User).filter(
        models.User.email == username
    ).first()

    if not db_user or not auth.verify_password(password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = auth.create_access_token(
        data={"sub": db_user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

# =========================
# PROFILE
# =========================
@app.get("/me", response_model=schemas.UserResponse)
def get_profile(current_user: models.User = Depends(get_current_user)):
    return current_user

# =========================
# WORKOUT
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
        name=data.name,
        age=data.age,
        weight=data.weight,
        weight_unit=data.weight_unit,
        height=data.height,
        height_unit=data.height_unit,
        blood_group=data.blood_group,
        fitness_goal=data.fitness_goal,
        medical_condition=data.medical_condition,
        workout_preference=data.workout_preference,
        workout_plan=workout_text,
    )

    db.add(workout)
    db.commit()
    db.refresh(workout)

    return workout

@app.get("/workouts", response_model=list[schemas.WorkoutResponse])
def get_workouts(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(models.Workout)
        .filter(models.Workout.user_id == current_user.id)
        .order_by(models.Workout.created_at.desc())
        .all()
    )

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
# DIET
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
        name=data.name,
        age=data.age,
        weight=data.weight,
        weight_unit=data.weight_unit,
        height=data.height,
        height_unit=data.height_unit,
        blood_group=data.blood_group,
        fitness_goal=data.fitness_goal,
        medical_condition=data.medical_condition,
        diet_preference=data.diet_preference,
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
# CONTACT (NEW – REQUIRED)
# =========================
@app.post("/contact")
def contact(
    name: str = Body(...),
    email: str = Body(...),
    message: str = Body(...),
):
    sent = send_contact_email(
        name=name,
        email=email,
        message=message,
    )

    if not sent:
        raise HTTPException(status_code=500, detail="Failed to send email")

    return {"message": "Message sent successfully"}
