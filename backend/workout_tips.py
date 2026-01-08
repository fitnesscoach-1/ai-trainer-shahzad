import os
import json
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from openai import OpenAI

from database import get_db
from models import Workout
from auth import get_current_user
from schemas import WorkoutTipsResponse

# =========================
# ROUTER
# =========================
router = APIRouter(tags=["Workout Tips"])

# =========================
# OPENAI CLIENT
# =========================
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ======================================================
# 🔹 INTERNAL HELPER (REUSED — SAFE)
# ======================================================
def generate_tips_from_plan(plan: str) -> dict:
    """
    Generate structured workout tips from a workout plan.
    Shared by multiple endpoints.
    """

    prompt = f"""
You are an AI fitness coach.

Generate workout tips in JSON ONLY.

Rules:
- Exactly 3 tips for warmup
- Exactly 3 tips for workout
- Exactly 3 tips for recovery
- Each tip must be a short sentence
- Use simple language
- No emojis
- No markdown
- No headings
- No extra text

Output format:
{{
  "warmup": ["...", "...", "..."],
  "workout": ["...", "...", "..."],
  "recovery": ["...", "...", "..."]
}}

Workout plan:
{plan}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.6,
    )

    raw = response.choices[0].message.content

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="AI response could not be parsed. Please try again."
        )

# ======================================================
# 1️⃣ GET LATEST WORKOUT TIPS (PRESERVED)
# ======================================================
@router.get(
    "/workout-tips",
    response_model=WorkoutTipsResponse
)
def get_latest_workout_tips(
    regenerate: bool = Query(
        default=False,
        description="Force regenerate tips using OpenAI"
    ),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """
    Generate AI workout tips based on the user's
    most recently generated workout plan.
    """

    workout = (
        db.query(Workout)
        .filter(Workout.user_id == user.id)
        .order_by(Workout.created_at.desc())
        .first()
    )

    if not workout:
        raise HTTPException(
            status_code=404,
            detail="No workout found. Generate a workout first."
        )

    data = generate_tips_from_plan(workout.workout_plan)

    return WorkoutTipsResponse(
        warmup=data.get("warmup", [])[:3],
        workout=data.get("workout", [])[:3],
        recovery=data.get("recovery", [])[:3],
        created_at=datetime.utcnow(),
    )

# ======================================================
# 2️⃣ GET WORKOUT TIPS BY WORKOUT ID (🔥 REQUIRED BY UI)
# ======================================================
@router.get(
    "/workout-tips/{workout_id}",
    response_model=WorkoutTipsResponse
)
def get_workout_tips_by_workout_id(
    workout_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """
    Used by:
    - WorkoutMemory → View Tips button
    """

    workout = (
        db.query(Workout)
        .filter(
            Workout.id == workout_id,
            Workout.user_id == user.id,
        )
        .first()
    )

    if not workout:
        raise HTTPException(
            status_code=404,
            detail="Workout not found"
        )

    data = generate_tips_from_plan(workout.workout_plan)

    return WorkoutTipsResponse(
        warmup=data.get("warmup", [])[:3],
        workout=data.get("workout", [])[:3],
        recovery=data.get("recovery", [])[:3],
        created_at=datetime.utcnow(),
    )
