import { useState, useMemo } from "react";
import { useWorkoutForm } from "../hooks/useWorkoutForm";
import WorkoutGoalSelector from "../components/workout/WorkoutGoalSelector";
import "./AIWorkoutGenerator.css";

/* ===============================
   CONSTANTS (PRESERVED)
================================ */

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const MEDICAL_CONDITIONS = [
  "Thyroid",
  "Diabetes",
  "Blood Pressure",
  "Cholesterol",
  "Asthma",
  "Heart Condition",
  "None",
];

/* ===============================
   COMPONENT
================================ */

export default function AIWorkoutGenerator() {
  const { form, updateField } = useWorkoutForm();
  const [loading, setLoading] = useState(false);

  /* ===============================
     DERIVED VALUES
  ================================ */

  const convertedWeight = useMemo(() => {
    if (!form.weight) return null;

    return form.weight_unit === "kg"
      ? (Number(form.weight) * 2.20462).toFixed(1)
      : (Number(form.weight) / 2.20462).toFixed(1);
  }, [form.weight, form.weight_unit]);

  const convertedHeight = useMemo(() => {
    if (!form.height) return null;

    return form.height_unit === "cm"
      ? (Number(form.height) / 30.48).toFixed(1)
      : (Number(form.height) * 30.48).toFixed(1);
  }, [form.height, form.height_unit]);

  /* ===============================
     GOAL HANDLER (PRESERVED)
  ================================ */

  const handleGoalSelect = (goalId: string) => {
    updateField("fitness_goal", goalId);
  };

  /* ===============================
     SUBMIT HANDLER (PRESERVED)
  ================================ */

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const payload = {
        ...form,
      };

      console.log("AI Workout Payload:", payload);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-page-wrapper">
      <div className="hud-container">
        <div className="hud-frame">
          <div className="hud-content">

            {/* ================= HEADER ================= */}
            <div className="hud-header">
              <div className="avatar-glow">
                <img src="/images/ai-avatar.png" alt="AI Coach Aria" />
              </div>
              <div className="header-text">
                <h1>AI Workout Generator</h1>
                <p>Aria is ready to design your workout plan</p>
              </div>
            </div>

            {/* ================= FORM ================= */}
            <div className="hud-form">

              <div className="hud-row">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Tell me your name..."
                  value={form.name}
                  onChange={(e) =>
                    updateField("name", e.currentTarget.value)
                  }
                />
              </div>

              <div className="hud-row">
                <label>Age</label>
                <div className="row-controls">
                  <input
                    type="number"
                    placeholder="Your age"
                    value={form.age}
                    onChange={(e) =>
                      updateField("age", Number(e.currentTarget.value))
                    }
                  />
                  <select disabled>
                    <option>Years</option>
                  </select>
                </div>
              </div>

              {/* ================= WEIGHT (UNCHANGED) ================= */}
              <div className="hud-row">
                <label>Weight</label>
                <div className="row-controls">
                  <input
                    type="number"
                    placeholder="Your weight"
                    value={form.weight}
                    onChange={(e) =>
                      updateField("weight", Number(e.currentTarget.value))
                    }
                  />
                  <select
                    value={form.weight_unit}
                    onChange={(e) =>
                      updateField(
                        "weight_unit",
                        e.currentTarget.value as "kg" | "lb"
                      )
                    }
                  >
                    <option value="kg">kg</option>
                    <option value="lb">lb</option>
                  </select>
                </div>

                {convertedWeight && (
                  <span className="unit-conversion">
                    ≈ {convertedWeight}{" "}
                    {form.weight_unit === "kg" ? "lbs" : "kg"}
                  </span>
                )}
              </div>

              {/* ================= HEIGHT (UPGRADED) ================= */}
              <div className="hud-row">
                <label>Height</label>
                <div className="row-controls">
                  <input
                    type="number"
                    placeholder="Your height"
                    value={form.height}
                    onChange={(e) =>
                      updateField("height", Number(e.currentTarget.value))
                    }
                  />
                  <select
                    value={form.height_unit}
                    onChange={(e) =>
                      updateField(
                        "height_unit",
                        e.currentTarget.value as "cm" | "ft"
                      )
                    }
                  >
                    <option value="cm">cm</option>
                    <option value="ft">ft</option>
                  </select>
                </div>

                {convertedHeight && (
                  <span className="unit-conversion">
                    ≈ {convertedHeight}{" "}
                    {form.height_unit === "cm" ? "ft" : "cm"}
                  </span>
                )}
              </div>

            </div>

            {/* ================= BLOOD GROUP ================= */}
            <h3 className="section-title">Blood Group</h3>
            <div className="pill-grid">
              {BLOOD_GROUPS.map((bg) => (
                <button
                  key={bg}
                  className={`pill ${
                    form.blood_group === bg ? "active" : ""
                  }`}
                  onClick={() => updateField("blood_group", bg)}
                >
                  {bg}
                </button>
              ))}
            </div>

            {/* ================= MEDICAL ================= */}
            <div className="medical-container">
              <h3 className="section-title">Medical Conditions</h3>
              <div className="pill-grid">
                {MEDICAL_CONDITIONS.map((mc) => (
                  <button
                    key={mc}
                    className={`pill medical-pill ${
                      form.medical_condition === mc ? "active" : ""
                    }`}
                    onClick={() =>
                      updateField("medical_condition", mc)
                    }
                  >
                    {mc}
                  </button>
                ))}
              </div>
            </div>

            {/* ================= GOALS ================= */}
            <h3 className="section-title">Workout Goal</h3>
            <WorkoutGoalSelector onSelect={handleGoalSelect} />

            {/* ================= FOOTER ================= */}
            <div className="ai-tip">
              <span>▶</span> Tip: {form.fitness_goal} training selected — Atlas is preparing your plan.
            </div>

            <button
              className="generate-btn"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate AI Workout Plan"}
            </button>

            <p className="footer-secure">
              Your health data is processed <b>securely by AI.</b>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
