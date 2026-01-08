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
from sqlalchemy.orm import relationship
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

    role = Column(String(20), default="user")  # user | admin


# ======================================================
# WORKOUT MODEL (UNCHANGED – CORE SOURCE OF TRUTH)
# ======================================================
class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE")
    )

    name = Column(String(100))
    age = Column(Integer)

    weight = Column(Integer)
    weight_unit = Column(String(10))

    height = Column(Integer)
    height_unit = Column(String(10))

    blood_group = Column(String(5))

    fitness_goal = Column(String(50))
    medical_condition = Column(String(50))
    workout_preference = Column(String(50))

    workout_plan = Column(Text)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    # 🧠 SAFE RELATIONSHIP (NO DB CHANGE)
    normalized_exercises = relationship(
        "NormalizedExercise",
        back_populates="workout",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


# ======================================================
# 🧠 NORMALIZED EXERCISE MEMORY (NEW – SAFE ADDITION)
# ======================================================
class NormalizedExercise(Base):
    __tablename__ = "normalized_exercises"

    id = Column(Integer, primary_key=True, index=True)

    workout_id = Column(
        Integer,
        ForeignKey("workouts.id", ondelete="CASCADE"),
        nullable=False
    )

    name = Column(String(255), nullable=False)
    sets = Column(Integer, nullable=True)
    reps = Column(String(50), nullable=True)
    rest = Column(String(50), nullable=True)

    # Relationship back to workout
    workout = relationship(
        "Workout",
        back_populates="normalized_exercises"
    )


# ======================================================
# DIET MODEL (UNCHANGED – SAFE)
# ======================================================
class Diet(Base):
    __tablename__ = "diets"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )

    name = Column(String(100))
    age = Column(Integer)

    weight = Column(Integer)
    weight_unit = Column(String(10))

    height = Column(Integer)
    height_unit = Column(String(10))

    blood_group = Column(String(5))

    fitness_goal = Column(String(50))
    medical_condition = Column(String(50))
    diet_preference = Column(String(50))

    diet_plan = Column(Text)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


# ======================================================
# WORKOUT TIPS HISTORY (UNCHANGED – SAFE)
# ======================================================
class WorkoutTipHistory(Base):
    __tablename__ = "workout_tip_history"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    workout_id = Column(
        Integer,
        ForeignKey("workouts.id", ondelete="SET NULL"),
        nullable=True
    )

    tips = Column(JSON, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
# ======================================================
# 🧠 AI INSIGHTS (LONG-TERM MEMORY)
# ======================================================
class AIInsight(Base):
    __tablename__ = "ai_insights"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    # optional reference (can grow later)
    source = Column(String(50), default="workout")

    # 🧠 Stored intelligence
    insights = Column(JSON, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
