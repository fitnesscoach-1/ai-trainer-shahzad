import "./WorkoutTips.css";

export default function WorkoutTips() {
  return (
    <div className="workout-tips-page">
      <div className="workout-tips-card">
        <h1>Workout Tips</h1>

        <p className="subtitle">
          AI-powered workout guidance personalized for you
        </p>

        <div className="coming-soon">
          🚧 This feature is coming soon
        </div>

        <p className="description">
          Once you generate workouts, our AI coach will analyze your history
          and provide:
        </p>

        <ul>
          <li>✔ Form improvement tips</li>
          <li>✔ Muscle recovery suggestions</li>
          <li>✔ Intensity & volume optimization</li>
          <li>✔ Weekly performance insights</li>
        </ul>

        <p className="hint">
          Generate a few workouts to unlock smart AI tips 🔓
        </p>
      </div>
    </div>
  );
}
