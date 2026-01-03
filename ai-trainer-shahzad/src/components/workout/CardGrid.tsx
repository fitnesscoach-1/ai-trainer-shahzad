import "./CardGrid.css";
import AIWorkoutCard from "./AIWorkoutCard";
import WorkoutTipsCard from "./WorkoutTipsCard";
import WorkoutHistoryCard from "./WorkoutHistoryCard";
export default function CardGrid() {
  return (
    <div className="card-grid">
      <AIWorkoutCard />
      <WorkoutHistoryCard />
      <WorkoutTipsCard />
    </div>
  );
}
