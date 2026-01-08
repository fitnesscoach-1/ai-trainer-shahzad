import { useState } from "react";
import { workoutGoals } from "../../data/workoutGoals";
import WorkoutGoalCard from "./WorkoutGoalCard";
import "./WorkoutGoalSelector.css";


interface Props {
  onSelect: (goal: string) => void;
}

export default function WorkoutGoalSelector({ onSelect }: Props) {
  const [selected, setSelected] = useState("strength");

  const handleSelect = (goalId: string) => {
    setSelected(goalId);
    onSelect(goalId);
  };

  return (
    <div className="goal-grid">
      {workoutGoals.map((goal) => (
        <WorkoutGoalCard
          key={goal.id}
          title={goal.title}
          subtitle={goal.subtitle}
          image={goal.image}
          selected={selected === goal.id}
          onClick={() => handleSelect(goal.id)}
        />
      ))}
    </div>
  );
}
