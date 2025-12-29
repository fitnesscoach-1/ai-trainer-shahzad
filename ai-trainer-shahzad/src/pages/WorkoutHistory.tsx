import { useEffect, useState } from "react";
import axios from "axios";
import "./WorkoutHistory.css";

interface Workout {
  id: number;
  name: string;
  fitness_goal: string;
  workout_plan: string;
  created_at: string;
}

export default function WorkoutHistory() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Gmail-style selection
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/workouts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWorkouts(res.data);
      } catch {
        alert("Failed to load workout history");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [token]);

  /* ======================
     SELECTION HANDLERS
  ====================== */
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === workouts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(workouts.map((w) => w.id));
    }
  };

  /* ======================
     BULK DELETE
  ====================== */
  const deleteSelected = async () => {
    if (selectedIds.length === 0) return;

    const confirmDelete = window.confirm(
      `Delete ${selectedIds.length} selected workout(s)?`
    );
    if (!confirmDelete) return;

    try {
      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`http://127.0.0.1:8000/workouts/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );

      setWorkouts((prev) => prev.filter((w) => !selectedIds.includes(w.id)));
      setSelectedIds([]);
      setSelectedWorkout(null);
    } catch {
      alert("Failed to delete selected workouts");
    }
  };

  if (loading) {
    return <div className="history-loading">Loading workout history...</div>;
  }

  return (
    <div className="history-page">
      <h1>My Workout History</h1>

      {/* ✅ TOOLBAR — APPEARS ONLY WHEN CHECKBOX IS USED */}
      {selectedIds.length > 0 && (
        <div className="history-toolbar">
          <label>
            <input
              type="checkbox"
              checked={selectedIds.length === workouts.length}
              onChange={selectAll}
            />{" "}
            Select All
          </label>

          <button className="danger" onClick={deleteSelected}>
            Delete Selected
          </button>
        </div>
      )}

      <div className="history-container">
        {/* LEFT: LIST */}
        <div className="history-list">
          {workouts.length === 0 && <p>No workouts found.</p>}

          {workouts.map((workout) => (
            <div
              key={workout.id}
              className={`history-item ${
                selectedWorkout?.id === workout.id ? "active" : ""
              }`}
              onClick={() => setSelectedWorkout(workout)}
            >
              {/* ✅ CHECKBOX */}
              <input
                type="checkbox"
                checked={selectedIds.includes(workout.id)}
                onChange={(e) => {
                  e.stopPropagation();
                  toggleSelect(workout.id);
                }}
              />

              <div className="history-item-content">
                <h3>{workout.name}</h3>
                <p>{workout.fitness_goal}</p>
                <small>
                  {new Date(workout.created_at).toLocaleString()}
                </small>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: DETAILS */}
        <div className="history-detail">
          {selectedWorkout ? (
            <pre>{selectedWorkout.workout_plan}</pre>
          ) : (
            <p>Select a workout to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}
