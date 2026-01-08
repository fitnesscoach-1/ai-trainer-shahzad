import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

import "./WorkoutResult.css";

interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  duration?: string;
}

interface WorkoutResultData {
  title?: string;
  fitness_goal?: string;
  duration?: string;
  difficulty?: string;
  workout_preference?: string;
  exercises?: Exercise[];
  ai_notes?: string;
}

export default function WorkoutResult() {
  const navigate = useNavigate();
  const location = useLocation();

  const workout: WorkoutResultData | null = location.state?.workout ?? null;

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  if (!workout) {
    return (
      <div className="workout-result fallback">
        <h2>No workout found</h2>
        <button onClick={() => navigate("/ai-workout-generator")}>
          Go Back
        </button>
      </div>
    );
  }

  /* ===============================
     SAVE TO HISTORY
  ================================ */
  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      await api.post("/workouts/history", {
        workout,
      });

      setSaved(true);
    } catch (err) {
      console.error(err);
      setError("Failed to save workout. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="workout-result">

      {/* HEADER */}
      <header className="result-header">
        <h1>{workout.title || "Your AI Workout Plan"}</h1>
      </header>

      {/* EXERCISES */}
      <section className="exercise-section">
        <h3>Workout Breakdown</h3>

        {workout.exercises?.map((ex, index) => (
          <div className="exercise-card" key={index}>
            <h4>{ex.name}</h4>
            <div className="exercise-meta">
              {ex.sets && <span>{ex.sets} sets</span>}
              {ex.reps && <span>{ex.reps} reps</span>}
              {ex.duration && <span>{ex.duration}</span>}
            </div>
          </div>
        ))}
      </section>

      {workout.ai_notes && (
        <section className="ai-notes">
          <h3>AI Trainer Insight</h3>
          <p>{workout.ai_notes}</p>
        </section>
      )}

      {error && <div className="error-text">{error}</div>}

      {/* ACTIONS */}
      <div className="result-actions">
        <button
          className="secondary"
          onClick={() => navigate(-1)}
        >
          Regenerate
        </button>

        <button
          className="primary"
          onClick={handleSave}
          disabled={saving || saved}
        >
          {saved
            ? "Saved ✓"
            : saving
            ? "Saving..."
            : "Save to Workout History"}
        </button>
      </div>
    </div>
  );
}
