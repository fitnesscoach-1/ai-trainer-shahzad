from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from auth import get_current_user
from models import Workout, WorkoutTipHistory
from schemas import (
    WorkoutTipsSave,
    WorkoutTipHistoryResponse,
)

# =========================
# ROUTER
# =========================
router = APIRouter(
    prefix="/workout-history",
    tags=["Workout Tips History"]
)

# =========================
# SAVE WORKOUT TIPS
# =========================
@router.post(
    "/save-tips",
    response_model=WorkoutTipHistoryResponse
)
def save_workout_tips(
    data: WorkoutTipsSave,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """
    Save AI-generated workout tips for the logged-in user.

    - Preserves existing workout linkage
    - Stores structured tips (warmup / workout / recovery)
    - Returns saved record safely
    """

    # 🔹 Get latest workout (optional association)
    workout = (
        db.query(Workout)
        .filter(Workout.user_id == user.id)
        .order_by(Workout.created_at.desc())
        .first()
    )

    # 🔹 Create DB record
    record = WorkoutTipHistory(
        user_id=user.id,
        workout_id=workout.id if workout else None,
        tips=data.tips,
    )

    # 🔹 Persist safely
    db.add(record)
    db.commit()
    db.refresh(record)

    return record
