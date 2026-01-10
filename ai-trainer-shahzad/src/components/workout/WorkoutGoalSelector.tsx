import { useState } from "react";
import { workoutGoals } from "../../data/workoutGoals";
import WorkoutGoalCard from "./WorkoutGoalCard";
import "./WorkoutGoalSelector.css";

/* ===============================
   PROPS (PRESERVED)
================================ */
interface Props {
  onSelect: (goal: string) => void;
}

/* ===============================
   COMPONENT
================================ */
export default function WorkoutGoalSelector({ onSelect }: Props) {
  /* 🔒 PRESERVED STATE LOGIC */
  const [selected, setSelected] = useState<string>("strength");

  /* ===============================
     HANDLERS (PRESERVED)
  ================================ */
  const handleSelect = (goalId: string) => {
    setSelected(goalId);
    onSelect(goalId);
  };

  /* ===============================
     RENDER
  ================================ */
  return (
    <div
      className="goal-grid"
      role="radiogroup"
      aria-label="Select fitness goal"
    >
      {workoutGoals.map((goal) => (
        <WorkoutGoalCard
          key={goal.id}

          /* 🔥 REQUIRED FOR THEMES (SAFE ADDITION) */
          goalId={goal.id}

          /* 🔒 OLD DATA — PRESERVED */
          title={goal.title}
          subtitle={goal.subtitle}
          image={goal.image}

          /* 🔒 OLD SELECTION LOGIC — PRESERVED */
          selected={selected === goal.id}

          /* 🔒 OLD CLICK FLOW — PRESERVED */
          onClick={() => handleSelect(goal.id)}

          /* ✅ ACCESSIBILITY (SAFE ADDITION) */
          role="radio"
          ariaChecked={selected === goal.id}
        />
      ))}
    </div>
  );
}
