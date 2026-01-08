from typing import List, Dict

def normalize_workout_plan(plan: str) -> List[Dict]:
    if not plan:
        return []

    normalized = []

    lines = plan.split("\n")
    for line in lines:
        line = line.strip()
        if not line:
            continue

        normalized.append({
            "name": line,
            "sets": None,
            "reps": None,
            "rest": None,
        })

    return normalized
