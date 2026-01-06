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

# =========================
# GET WORKOUT TIPS
# =========================
@router.get(
    "/workout-tips",
    response_model=WorkoutTipsResponse
)
def get_workout_tips(
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

    Returns structured tips:
    - warmup (3 tips)
    - workout (3 tips)
    - recovery (3 tips)
    """

    # =========================
    # 1️⃣ Fetch latest workout
    # =========================
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

    # =========================
    # 2️⃣ Build STRICT AI prompt
    # =========================
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
{workout.workout_plan}
"""

    # =========================
    # 3️⃣ Call OpenAI
    # =========================
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.6,
    )

    raw_content = response.choices[0].message.content

    # =========================
    # 4️⃣ Parse AI response safely
    # =========================
    try:
        data = json.loads(raw_content)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="AI response could not be parsed. Please try again."
        )

    # =========================
    # 5️⃣ Return structured response
    # =========================
    return WorkoutTipsResponse(
        warmup=data.get("warmup", [])[:3],
        workout=data.get("workout", [])[:3],
        recovery=data.get("recovery", [])[:3],
        created_at=datetime.utcnow()
    )
