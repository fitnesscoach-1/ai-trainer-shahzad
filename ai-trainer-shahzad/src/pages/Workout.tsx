import WorkoutHeader from "../components/workout/WorkoutHeader";
import CardGrid from "../components/workout/CardGrid";
import ProgressSummary from "../components/workout/ProgressSummary";
import "./Workout.css";

export default function Workout() {
  return (
    <div className="workout-page">
      <div className="workout-container">
        <WorkoutHeader />
        <CardGrid />
        <ProgressSummary />
      </div>
    </div>
  );
}
