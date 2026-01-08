from collections import Counter
from typing import List, Dict


def generate_ai_insights(
    normalized_workouts: List[List[Dict]]
) -> Dict:
    """
    Input:
    [
      [ {exercise}, {exercise} ],
      [ {exercise}, {exercise} ],
    ]

    Output:
    Structured AI coaching insights (stable + DB-safe)
    """

    if not normalized_workouts:
        return {
            "coach": "Aria",
            "title": "AI Training Insight",
            "warmup": ["Log more workouts to unlock personalized insights."],
            "workout": [],
            "recovery": [],
        }

    # =========================
    # FLATTEN EXERCISES
    # =========================
    all_exercises: List[str] = []

    for workout in normalized_workouts:
        for ex in workout:
            name = ex.get("name")
            if name:
                all_exercises.append(name.lower())

    frequency = Counter(all_exercises)

    # =========================
    # INSIGHT BUCKETS
    # =========================
    warmup: List[str] = []
    workout: List[str] = []
    recovery: List[str] = []

    for name, count in frequency.items():
        if count >= 4:
            recovery.append(
                f"{name.title()} appears very frequently. Consider adding rest or reducing volume."
            )
        elif count >= 2:
            workout.append(
                f"{name.title()} shows consistent training. Progressive overload is recommended."
            )

    # =========================
    # FALLBACK RULES
    # =========================
    if not warmup:
        warmup.append(
            "Always include 5–10 minutes of warm-up before heavy exercises."
        )

    if not workout:
        workout.append(
            "Your workout variety is balanced. Maintain consistent intensity."
        )

    if not recovery:
        recovery.append(
            "Recovery balance looks healthy. Continue monitoring fatigue levels."
        )

    # =========================
    # COACH SELECTION (SMART)
    # =========================
    coach = "Atlas" if len(recovery) > len(workout) else "Aria"

    return {
        "coach": coach,
        "title": "AI Training Insight",
        "warmup": warmup,
        "workout": workout,
        "recovery": recovery,
    }
