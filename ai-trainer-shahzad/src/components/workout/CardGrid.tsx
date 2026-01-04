import "./CardGrid.css";
import AIWorkoutCard from "./AIWorkoutCard";
import WorkoutHistoryCard from "./WorkoutHistoryCard";
import WorkoutTipsCard from "./WorkoutTipsCard";

export default function CardGrid() {
  return (
    <div className="card-grid">
      <AIWorkoutCard />
      <WorkoutHistoryCard />
      <WorkoutTipsCard />
    </div>
  );
}
