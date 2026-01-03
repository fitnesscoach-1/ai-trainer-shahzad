import WorkoutHeader from "../components/workout/WorkoutHeader";
import CardGrid from "../components/workout/CardGrid";
import ProgressSummary from "../components/workout/ProgressSummary";

export default function Workout() {
  return (
    <div className="workout-page">
      <WorkoutHeader />
      <CardGrid />
      <ProgressSummary />
    </div>
  );
}
