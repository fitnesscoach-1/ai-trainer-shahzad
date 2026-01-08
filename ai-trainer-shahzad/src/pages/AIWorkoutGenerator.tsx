import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useWorkoutForm } from "../hooks/useWorkoutForm";
import WorkoutGoalSelector from "../components/workout/WorkoutGoalSelector";
import api from "../api/axios";

import "./AIWorkoutGenerator.css";

/* ===============================
   CONSTANTS (UI ONLY)
================================ */
const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

const MEDICAL_CONDITIONS = [
  "Thyroid",
  "Diabetes",
  "Blood Pressure",
  "Cholesterol",
  "Asthma",
  "Heart Condition",
  "None",
];

export default function AIWorkoutGenerator() {
  const navigate = useNavigate();
  const { form, updateField } = useWorkoutForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ===============================
     GENERATE WORKOUT
  =============================== */
  const handleGenerate = async () => {
    if (!form.name || !form.age || !form.weight || !form.height) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/workouts/generate", form);

      navigate("/workout-result", {
        state: { workout: response.data },
      });
    } catch (err) {
      console.error(err);
      setError("Failed to generate workout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-bg">
      <div className="ai-frame">
        <div className="ai-workout-generator">

          {/* ===============================
              HEADER
          =============================== */}
          <div className="generator-header">
            <h2>AI Workout Generator</h2>
            <p>Personalized training plan powered by AI</p>
          </div>

          {/* ===============================
              BASIC INFO (HUD STYLE)
          =============================== */}
          <div className="hud-section">

            <div className="hud-row">
              <label>Name</label>
              <input
                placeholder="Tell me your name..."
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>

            <div className="hud-row">
              <label>Age</label>
              <input
                type="number"
                placeholder="Your age"
                value={form.age}
                onChange={(e) =>
                  updateField(
                    "age",
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
              />
            </div>

            <div className="hud-row">
              <label>Weight</label>
              <div className="hud-inline">
                <input
                  type="number"
                  placeholder="Weight"
                  value={form.weight}
                  onChange={(e) =>
                    updateField(
                      "weight",
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                />
                <select
                  value={form.weight_unit}
                  onChange={(e) =>
                    updateField(
                      "weight_unit",
                      e.target.value as "kg" | "lb"
                    )
                  }
                >
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                </select>
              </div>
            </div>

            <div className="hud-row">
              <label>Height</label>
              <div className="hud-inline">
                <input
                  type="number"
                  placeholder="Height"
                  value={form.height}
                  onChange={(e) =>
                    updateField(
                      "height",
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                />
                <select
                  value={form.height_unit}
                  onChange={(e) =>
                    updateField(
                      "height_unit",
                      e.target.value as "cm" | "ft"
                    )
                  }
                >
                  <option value="cm">cm</option>
                  <option value="ft">ft</option>
                </select>
              </div>
            </div>

          </div>

          {/* ===============================
              BLOOD GROUP
          =============================== */}
          <section className="pill-section">
            <h3>Blood Group</h3>
            <div className="pill-row">
              {BLOOD_GROUPS.map((group) => (
                <button
                  key={group}
                  type="button"
                  className={`pill ${
                    form.blood_group === group ? "active" : ""
                  }`}
                  onClick={() => updateField("blood_group", group)}
                >
                  {group}
                </button>
              ))}
            </div>
          </section>

          {/* ===============================
              MEDICAL CONDITIONS
          =============================== */}
          <section className="pill-section">
            <h3>Medical Conditions</h3>
            <div className="pill-row">
              {MEDICAL_CONDITIONS.map((condition) => (
                <button
                  key={condition}
                  type="button"
                  className={`pill ${
                    form.medical_condition === condition ? "active" : ""
                  }`}
                  onClick={() =>
                    updateField("medical_condition", condition)
                  }
                >
                  {condition}
                </button>
              ))}
            </div>
          </section>

          {/* ===============================
              FITNESS GOAL
          =============================== */}
          <section className="goal-section">
            <h3>Select Fitness Goal</h3>
            <WorkoutGoalSelector
              onSelect={(goal) => updateField("fitness_goal", goal)}
            />
          </section>

          {/* ===============================
              WORKOUT PREFERENCE
          =============================== */}
          <input
            className="full-width"
            placeholder="Workout Preference (Gym / Home / Cardio)"
            value={form.workout_preference}
            onChange={(e) =>
              updateField("workout_preference", e.target.value)
            }
          />

          {/* ===============================
              TIP (REFERENCE STYLE)
          =============================== */}
          <div className="ai-tip">
            ▶ Tip: Strength training selected — Atlas is preparing your plan.
          </div>

          {/* ===============================
              ERROR
          =============================== */}
          {error && <div className="error-text">{error}</div>}

          {/* ===============================
              GENERATE BUTTON
          =============================== */}
          <div className="generate-container">
            <button
              className="generate-btn"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading
                ? "AI is preparing your workout..."
                : "Generate AI Workout"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
