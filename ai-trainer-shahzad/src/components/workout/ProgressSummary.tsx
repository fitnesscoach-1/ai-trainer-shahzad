import "./ProgressSummary.css";
import { useEffect, useState } from "react";

/* ===============================
   WEEK UTILITY (UNCHANGED)
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
     MOCK DATA (PRESERVED)
  ================================ */
  const targetCompletion = 72;
  const targetScore = 86;
  const targetStreak = 8;

  const [completion, setCompletion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const [trend, setTrend] = useState<"up" | "down" | "same">("same");
  const [highlight, setHighlight] = useState(false);

  /* ===============================
     AI INSIGHT (PRESERVED)
  ================================ */
  const [insight, setInsight] = useState("");

  /* ===============================
     AI CONFIDENCE (DYNAMIC)
  ================================ */
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    const currentWeek = getCurrentWeekKey();
    const savedWeek = localStorage.getItem("progressWeek");

    if (savedWeek !== currentWeek) {
      localStorage.setItem("progressWeek", currentWeek);
      localStorage.setItem("prevScore", "0");
    }

    const prevScore = Number(localStorage.getItem("prevScore")) || 0;

    if (targetScore > prevScore) {
      setTrend("up");
      setInsight(
        "Your consistency is improving. Maintain this rhythm to unlock peak performance."
      );
    } else if (targetScore < prevScore) {
      setTrend("down");
      setInsight(
        "Performance dipped slightly. Focus on recovery and structured sessions."
      );
    } else {
      setTrend("same");
      setInsight(
        "Your performance is stable. A small intensity boost could elevate results."
      );
    }

    if (targetScore > prevScore) {
      setHighlight(true);
      setTimeout(() => setHighlight(false), 1200);
    }

    /* ===============================
       LOAD METRICS (UNCHANGED)
    ================================ */
    setTimeout(() => {
      setCompletion(targetCompletion);
      setStreak(targetStreak);
    }, 300);

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setScore(current);
      if (current >= targetScore) clearInterval(interval);
    }, 18);

    localStorage.setItem("prevScore", String(targetScore));
    return () => clearInterval(interval);
  }, []);

  /* ===============================
     CONFIDENCE CALCULATION
     (SAFE, FRONTEND-ONLY)
  ================================ */
  useEffect(() => {
    const completionWeight = completion * 0.25;
    const scoreWeight = score * 0.45;
    const streakWeight = Math.min(streak * 3, 15);

    const calculated =
      50 + completionWeight + scoreWeight + streakWeight;

    setConfidence(Math.min(Math.round(calculated), 100));
  }, [completion, score, streak]);

  const ringOffset = (value: number, max = 100) =>
    326 - (326 * value) / max;

  return (
    <div className="progress-summary">
      {/* ===============================
         AI CONFIDENCE BADGE + TOOLTIP
      ================================ */}
      <div className="ai-confidence-badge">
        <span className="ai-confidence-dot"></span>
        AI Confidence {confidence}%

        {/* Tooltip */}
        <div className="ai-confidence-tooltip">
          <strong>How AI Confidence is calculated</strong>
          <ul>
            <li>✔ Workout completion rate</li>
            <li>✔ Consistency score</li>
            <li>✔ Weekly streak strength</li>
          </ul>
          <span className="tooltip-note">
            Updated automatically as you train
          </span>
        </div>
      </div>

      {/* ===============================
         HOLOGRAM PARTICLES (PRESERVED)
      ================================ */}
      <div className="hologram-particles">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>

      <h2>Your Progress</h2>
      <p className="subtitle">AI-powered performance overview</p>

      <div className="progress-rings">
        {/* COMPLETION */}
        <div className="progress-ring-card">
          <div className="ring-wrapper">
            <svg width="120" height="120">
              <circle className="ring-bg" cx="60" cy="60" r="52" />
              <circle
                className="ring-progress green"
                cx="60"
                cy="60"
                r="52"
                style={{ strokeDashoffset: ringOffset(completion) }}
              />
            </svg>
            <div className="ring-center">
              <span className="ring-value">{completion}%</span>
              <span className="ring-label">Completed</span>
            </div>
          </div>
          <div className="ring-text">
            <h4>Workout Completion</h4>
            <span>Overall success rate</span>
          </div>
        </div>

        {/* STREAK */}
        <div className="progress-ring-card">
          <div className="ring-wrapper">
            <svg width="120" height="120">
              <circle className="ring-bg" cx="60" cy="60" r="52" />
              <circle
                className="ring-progress orange"
                cx="60"
                cy="60"
                r="52"
                style={{ strokeDashoffset: ringOffset(streak, 14) }}
              />
            </svg>
            <div className="ring-center">
              <span className="ring-value">{streak}</span>
              <span className="ring-label">Days</span>
            </div>
          </div>
          <div className="ring-text">
            <h4>Weekly Streak</h4>
            <span>This week</span>
          </div>
        </div>

        {/* CONSISTENCY */}
        <div className={`progress-ring-card ${highlight ? "highlight" : ""}`}>
          <div className="ring-wrapper">
            <svg width="120" height="120">
              <circle className="ring-bg" cx="60" cy="60" r="52" />
              <circle
                className="ring-progress cyan"
                cx="60"
                cy="60"
                r="52"
                style={{ strokeDashoffset: ringOffset(score) }}
              />
            </svg>
            <div className="ring-center">
              <span className="ring-value">{score}</span>
              <span className="ring-label">Score</span>
            </div>
          </div>
          <div className="ring-text">
            <h4>
              Consistency{" "}
              {trend === "up" && <span className="trend up">↑</span>}
              {trend === "down" && <span className="trend down">↓</span>}
              {trend === "same" && <span className="trend same">→</span>}
            </h4>
            <span>Training reliability</span>
          </div>
        </div>
      </div>

      {/* ===============================
         AI INSIGHT LINE (PRESERVED)
      ================================ */}
      <div className={`progress-insight ${trend}`}>
        <span className="ai-icon">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M12 2C7 2 3 6 3 11c0 3.5 2 6.5 5 8v3h8v-3c3-1.5 5-4.5 5-8 0-5-4-9-9-9z"
              fill="currentColor"
            />
          </svg>
        </span>
        <span className="ai-text">{insight}</span>
      </div>
    </div>
  );
}
