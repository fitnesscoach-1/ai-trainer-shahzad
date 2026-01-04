import WorkoutHeader from "../components/workout/WorkoutHeader";
import CardGrid from "../components/workout/CardGrid";
import ProgressSummary from "../components/workout/ProgressSummary";

export default function Workout() {
  return (
    <div
      className="workout-page"
      style={{
        minHeight: "100vh",
        paddingBottom: "60px",
        color: "#eaf6f6",
        backgroundImage: `
          linear-gradient(
            rgba(10, 20, 30, 0.65),
            rgba(15, 32, 39, 0.9),
            rgba(20, 45, 60, 0.75)
          ),
          url("/workout-images/workout/workout-background.png")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <WorkoutHeader />
      <CardGrid />
      <ProgressSummary />
    </div>
  );
}
