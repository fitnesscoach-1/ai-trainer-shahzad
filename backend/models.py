from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    DateTime,
    JSON,
)
from sqlalchemy.sql import func
from database import Base

# ======================================================
# USER MODEL (OLD DATA PRESERVED – NO BREAKING CHANGES)
# ======================================================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password = Column(String(255))

    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    username = Column(String(100), unique=True, nullable=True)
    phone = Column(String(30), nullable=True)
    address = Column(String(255), nullable=True)
    zip_code = Column(String(20), nullable=True)
    country = Column(String(100), nullable=True)
    profile_image = Column(String(255), nullable=True)

    # role system (already used)
    role = Column(String(20), default="user")  # user | admin


# ======================================================
# WORKOUT MODEL (MATCHES Workout.tsx EXACTLY)
# ======================================================
class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)

    # 🔗 Link to logged-in user
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))

    # ========== FORM DATA ==========
    name = Column(String(100))
    age = Column(Integer)

    weight = Column(Integer)
    weight_unit = Column(String(10))        # kg | lbs

    height = Column(Integer)
    height_unit = Column(String(10))        # cm | inches

    blood_group = Column(String(5))

    fitness_goal = Column(String(50))       # weight loss, muscle transformation
    medical_condition = Column(String(50))  # none, diabetes, bp
    workout_preference = Column(String(50)) # strength, cardio, balanced

    # ========== AI RESULT ==========
    workout_plan = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ======================================================
# DIET MODEL (NEW – MATCHES Diet.tsx & MySQL TABLE)
# ======================================================
class Diet(Base):
    __tablename__ = "diets"

    id = Column(Integer, primary_key=True, index=True)

    # 🔗 Link to logged-in user
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )

    # ========== FORM DATA ==========
    name = Column(String(100))
    age = Column(Integer)

    weight = Column(Integer)
    weight_unit = Column(String(10))        # kg | lbs

    height = Column(Integer)
    height_unit = Column(String(10))        # cm | inches

    blood_group = Column(String(5))

    fitness_goal = Column(String(50))
    medical_condition = Column(String(50))
    diet_preference = Column(String(50))

    # ========== AI RESULT ==========
    diet_plan = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ======================================================
# WORKOUT TIPS HISTORY (NEW – SAFE ADDITION)
# ======================================================
class WorkoutTipHistory(Base):
    __tablename__ = "workout_tip_history"

    id = Column(Integer, primary_key=True, index=True)

    # 🔗 Link to logged-in user
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    # 🔗 Optional link to workout
    workout_id = Column(
        Integer,
        ForeignKey("workouts.id", ondelete="SET NULL"),
        nullable=True
    )

    # 🧠 Stored AI tips (warmup / workout / recovery)
    tips = Column(JSON, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
