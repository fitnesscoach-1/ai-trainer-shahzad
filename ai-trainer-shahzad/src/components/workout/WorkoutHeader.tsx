import "./WorkoutHeader.css";
import { useEffect, useState } from "react";

const AI_INSIGHTS = [
  "🤖 You’re most consistent on Mondays — keep it up.",
  "⚡ Your workout streak shows strong discipline.",
  "💪 Strength sessions are improving week over week.",
  "🧠 Consistency beats intensity — you’re doing it right.",
  "🔥 Recovery looks solid based on recent activity.",
];

export default function WorkoutHeader() {
  const [insightIndex, setInsightIndex] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const hasGeneratedWorkout =
      localStorage.getItem("hasGeneratedWorkout") === "true";

    setUnlocked(hasGeneratedWorkout);
  }, []);

  useEffect(() => {
    if (!unlocked) return;

    const interval = setInterval(() => {
      setInsightIndex((prev) => (prev + 1) % AI_INSIGHTS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [unlocked]);

  return (
    <div className="workout-header">
      <div className="workout-header-inner">
        <h1 className="workout-title">YOUR WORKOUT</h1>

        <div className="workout-streak">
          <span className="fire">🔥</span>
          <span className="days">8 Days Streak</span>
          <span className="status">ON FIRE</span>
        </div>
      </div>

      {/* 🔒 LOCKED STATE */}
      {!unlocked && (
        <div className="workout-ai-locked">
          🔒 Generate your first workout to unlock AI insights
        </div>
      )}

      {/* 🔓 UNLOCKED STATE */}
      {unlocked && (
        <div key={insightIndex} className="workout-ai-insight">
          {AI_INSIGHTS[insightIndex]}
        </div>
      )}
    </div>
  );
}
