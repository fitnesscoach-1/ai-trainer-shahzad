import "./ProgressSummary.css";
import { useEffect, useState } from "react";

/* ===============================
   WEEK UTILITY (CRON STYLE)
================================ */
function getCurrentWeekKey() {
  const now = new Date();
  const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear =
    (now.getTime() - firstDayOfYear.getTime()) / 86400000;

  const week = Math.ceil(
    (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
  );

  return `${now.getFullYear()}-W${week}`;
}

export default function ProgressSummary() {
  /* ===============================
     MOCK TARGETS (SAFE FOR NOW)
  ================================ */
  const targetCompletion = 72;
  const targetScore = 86;
  const targetStreak = 8; // days this week

  const [completion, setCompletion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const [trend, setTrend] = useState<"up" | "down" | "same">("same");
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    const currentWeek = getCurrentWeekKey();
    const savedWeek = localStorage.getItem("progressWeek");

    /* ===============================
       WEEKLY RESET
    ================================ */
    if (savedWeek !== currentWeek) {
      localStorage.setItem("progressWeek", currentWeek);
      localStorage.setItem("prevScore", "0");
      localStorage.setItem("prevCompletion", "0");
    }

    const prevScore = Number(localStorage.getItem("prevScore")) || 0;

    /* ===============================
       TREND + UNLOCK HIGHLIGHT
    ================================ */
    if (targetScore > prevScore) setTrend("up");
    else if (targetScore < prevScore) setTrend("down");
    else setTrend("same");

    if (targetScore > prevScore) {
      setHighlight(true);
      setTimeout(() => setHighlight(false), 1200);
    }

    /* ===============================
       ANIMATE COMPLETION + STREAK
    ================================ */
    setTimeout(() => {
      setCompletion(targetCompletion);
      setStreak(targetStreak);
    }, 300);

    /* ===============================
       ANIMATE SCORE COUNT-UP
    ================================ */
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setScore(current);
      if (current >= targetScore) clearInterval(interval);
    }, 18);

    /* ===============================
       SAVE FOR NEXT WEEK COMPARISON
    ================================ */
    localStorage.setItem("prevScore", String(targetScore));
    localStorage.setItem("prevCompletion", String(targetCompletion));

    return () => clearInterval(interval);
  }, []);

  /* ===============================
     COLOR HELPERS
  ================================ */
  const completionColor =
    completion < 40 ? "#ef4444" : completion < 70 ? "#facc15" : "#22c55e";

  const scoreColor =
    score < 40 ? "#ef4444" : score < 70 ? "#facc15" : "#22c55e";

  const ringOffset = (value: number, max = 100) =>
    326 - (326 * value) / max;

  return (
    <div className="progress-summary">
      <h2 className="progress-title">Your Progress</h2>

      <div className="progress-grid">
        {/* COMPLETION */}
        <div className="progress-ring">
          <svg width="120" height="120">
            <circle className="ring-bg" cx="60" cy="60" r="52" />
            <circle
              className="ring-progress"
              cx="60"
              cy="60"
              r="52"
              style={{
                strokeDashoffset: ringOffset(completion),
                stroke: completionColor,
              }}
            />
          </svg>
          <span className="ring-value">{completion}%</span>
          <span className="ring-label">Completed</span>
        </div>

        {/* STREAK */}
        <div className="progress-ring">
          <svg width="120" height="120">
            <circle className="ring-bg" cx="60" cy="60" r="52" />
            <circle
              className="ring-progress"
              cx="60"
              cy="60"
              r="52"
              style={{
                strokeDashoffset: ringOffset(streak, 14),
                stroke: "#f97316",
              }}
            />
          </svg>
          <span className="ring-value">{streak}</span>
          <span className="ring-label">Days Streak</span>
          <span className="ring-sub">This week</span>
        </div>

        {/* SCORE */}
        <div
          className={`progress-ring progress-score ${
            highlight ? "score-highlight" : ""
          }`}
        >
          <svg width="120" height="120">
            <circle className="ring-bg" cx="60" cy="60" r="52" />
            <circle
              className="ring-progress"
              cx="60"
              cy="60"
              r="52"
              style={{
                strokeDashoffset: ringOffset(score),
                stroke: scoreColor,
              }}
            />
          </svg>

          <span className="ring-value">{score}</span>
          <span className="ring-label">
            Consistency
            {trend === "up" && <span className="trend up"> ↑</span>}
            {trend === "down" && <span className="trend down"> ↓</span>}
            {trend === "same" && <span className="trend same"> →</span>}
          </span>
        </div>
      </div>

      <div className="progress-insight">
        🤖 Weekly performance{" "}
        {trend === "up"
          ? "is improving — excellent momentum."
          : trend === "down"
          ? "dropped slightly — refocus this week."
          : "is stable — aim to push further."}
      </div>
    </div>
  );
}
