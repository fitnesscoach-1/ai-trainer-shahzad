import "./WorkoutHeader.css";

export default function WorkoutHeader() {
  return (
    <div className="workout-header">
      <h1 className="workout-title">YOUR WORKOUT</h1>

      <div className="workout-streak">
        <span className="fire">🔥</span>
        <span className="days">8 Days Streak</span>
        <span className="status">ON FIRE</span>
      </div>
    </div>
  );
}
