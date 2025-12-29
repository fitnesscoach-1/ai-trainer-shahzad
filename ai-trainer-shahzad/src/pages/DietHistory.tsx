import { useEffect, useState } from "react";
import axios from "axios";
import "./DietHistory.css";

interface Diet {
  id: number;
  name: string;
  fitness_goal: string;
  diet_preference: string;
  diet_plan: string;
  created_at: string;
}

export default function DietHistory() {
  const [diets, setDiets] = useState<Diet[]>([]);
  const [selectedDiet, setSelectedDiet] = useState<Diet | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH DIETS ================= */
  useEffect(() => {
    const fetchDiets = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://127.0.0.1:8000/diets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDiets(res.data);
      } catch (err) {
        setError("Failed to load diet history");
      } finally {
        setLoading(false);
      }
    };

    fetchDiets();
  }, []);

  /* ================= SELECTION LOGIC ================= */
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === diets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(diets.map((d) => d.id));
    }
  };

  /* ================= DELETE SELECTED ================= */
  const deleteSelected = async () => {
    if (!window.confirm("Delete selected diet plans?")) return;

    try {
      const token = localStorage.getItem("token");

      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`http://127.0.0.1:8000/diets/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );

      setDiets((prev) => prev.filter((d) => !selectedIds.includes(d.id)));
      setSelectedIds([]);
      setSelectedDiet(null);
    } catch {
      alert("Failed to delete diets");
    }
  };

  /* ================= STATES ================= */
  if (loading) {
    return <div className="history-loading">Loading diet history...</div>;
  }

  if (error) {
    return <div className="history-error">{error}</div>;
  }

  return (
    <div className="history-page">
      <h1>My Diet History</h1>

      {/* ✅ GMAIL-STYLE TOOLBAR (APPEARS ONLY WHEN SELECTED) */}
      {selectedIds.length > 0 && (
        <div className="history-toolbar">
          <label className="select-all">
            <input
              type="checkbox"
              checked={selectedIds.length === diets.length}
              onChange={selectAll}
            />
            Select All
          </label>

          <button className="danger" onClick={deleteSelected}>
            Delete Selected
          </button>
        </div>
      )}

      <div className="history-container">
        {/* ================= LEFT LIST ================= */}
        <div className="history-list">
          {diets.length === 0 && <p>No diet plans found.</p>}

          {diets.map((diet) => (
            <div
              key={diet.id}
              className={`history-item ${
                selectedDiet?.id === diet.id ? "active" : ""
              }`}
              onClick={() => setSelectedDiet(diet)}
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(diet.id)}
                onChange={(e) => {
                  e.stopPropagation();
                  toggleSelect(diet.id);
                }}
              />

              <div>
                <h3>{diet.name}</h3>
                <p>
                  {diet.fitness_goal} • {diet.diet_preference}
                </p>
                <small>
                  {new Date(diet.created_at).toLocaleString()}
                </small>
              </div>
            </div>
          ))}
        </div>

        {/* ================= RIGHT DETAIL ================= */}
        <div className="history-detail">
          {selectedDiet ? (
            <pre>{selectedDiet.diet_plan}</pre>
          ) : (
            <p>Select a diet to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}
