import { useEffect, useState, useCallback } from "react";
import "./WorkoutMemory.css";

import WorkoutMemoryCard from "./WorkoutMemoryCard";
import HistoryActionBar from "./HistoryActionBar";
import WorkoutTipsModal from "./WorkoutTipsModal";
import api from "../../api/axios";

/* ===============================
   PROPS (PRESERVED + EXTENDED)
================================ */
interface WorkoutMemoryProps {
  onTipsSaved?: () => void;

  /* NEW – OPTIONAL (BACKWARD SAFE) */
  selectedWorkoutId?: number | null;
  onSelectWorkout?: (id: number | null) => void;
}

/* ===============================
   TYPES (PRESERVED)
================================ */
interface WorkoutMemoryItem {
  id: number;
  date: string;
  goal: string;
  title: string;
  duration: string;
  exercises: string[];

  raw?: {
    name: string;
    age: number;
    weight: number;
    weight_unit: string;
    height: number;
    height_unit: string;
    blood_group: string;
    fitness_goal: string;
    medical_condition: string;
    workout_preference: string;
  };
}

/* ===============================
   MOCK DATA (PRESERVED)
================================ */
const MOCK_DATA: WorkoutMemoryItem[] = [
  {
    id: 1,
    date: "Today",
    goal: "Muscle Gain",
    title: "Chest & Triceps Hypertrophy",
    duration: "52 min",
    exercises: [
      "Barbell Bench Press",
      "Incline Dumbbell Press",
      "Cable Fly",
      "Triceps Pushdown",
    ],
  },
];

/* ===============================
   COMPONENT
================================ */
export default function WorkoutMemory({
  onTipsSaved,
  selectedWorkoutId,
  onSelectWorkout,
}: WorkoutMemoryProps) {
  /* ===============================
     STATE (PRESERVED)
  ============================== */
  const [workouts, setWorkouts] =
    useState<WorkoutMemoryItem[]>(MOCK_DATA);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* MULTI-SELECT (PRESERVED) */
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [activeGoal, setActiveGoal] = useState("All Goals");

  const [deleting, setDeleting] = useState(false);
  const [replayingId, setReplayingId] = useState<number | null>(null);

  /* OPEN / CLOSE WORKOUT (NEW, SAFE) */
  const [internalOpenId, setInternalOpenId] =
    useState<number | null>(null);

  const openWorkoutId =
    selectedWorkoutId ?? internalOpenId;

  /* TIPS MODAL (PRESERVED) */
  const [tipsOpen, setTipsOpen] = useState(false);
  const [tipsLoading, setTipsLoading] = useState(false);
  const [tipsData, setTipsData] = useState<{
    warmup: string[];
    workout: string[];
    recovery: string[];
  } | null>(null);

  /* ===============================
     FETCH WORKOUT MEMORY
  ============================== */
  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get("/workouts/memory");

        const mapped: WorkoutMemoryItem[] = res.data.map(
          (w: any) => ({
            id: w.id,
            date: formatWorkoutDate(w.created_at),
            goal: w.fitness_goal,
            title: w.name,
            duration: "—",
            exercises:
              w.normalized_exercises?.map(
                (e: any) => e.name
              ) ?? extractExercises(w.workout_plan),
            raw: {
              name: w.name,
              age: w.age,
              weight: w.weight,
              weight_unit: w.weight_unit,
              height: w.height,
              height_unit: w.height_unit,
              blood_group: w.blood_group,
              fitness_goal: w.fitness_goal,
              medical_condition: w.medical_condition,
              workout_preference: w.workout_preference,
            },
          })
        );

        setWorkouts(mapped.length ? mapped : MOCK_DATA);
      } catch {
        setWorkouts(MOCK_DATA);
        setError("Failed to load workout history");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  /* ===============================
     SELECTION (PRESERVED)
  ============================== */
  const toggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  }, []);

  /* ===============================
     FILTERING (PRESERVED)
  ============================== */
  const goals = [
    "All Goals",
    ...Array.from(new Set(workouts.map((w) => w.goal))),
  ];

  const filteredData =
    activeGoal === "All Goals"
      ? workouts
      : workouts.filter((w) => w.goal === activeGoal);

  /* ===============================
     GROUP BY DATE (PRESERVED)
  ============================== */
  const grouped = filteredData.reduce<
    Record<string, WorkoutMemoryItem[]>
  >((acc, item) => {
    acc[item.date] = acc[item.date] || [];
    acc[item.date].push(item);
    return acc;
  }, {});

  /* ===============================
     DATE SELECT (PRESERVED)
  ============================== */
  const toggleSelectDate = (date: string) => {
    const ids = grouped[date].map((i) => i.id);
    const allSelected = ids.every((id) =>
      selectedIds.includes(id)
    );

    setSelectedIds((prev) =>
      allSelected
        ? prev.filter((id) => !ids.includes(id))
        : Array.from(new Set([...prev, ...ids]))
    );
  };

  const isDateFullySelected = (date: string) =>
    grouped[date].every((i) => selectedIds.includes(i.id));

  /* ===============================
     ACTIONS (PRESERVED)
  ============================== */
  const selectAll = () =>
    setSelectedIds(filteredData.map((i) => i.id));

  const clearSelection = () => setSelectedIds([]);

  const deleteSelected = async () => {
    if (!selectedIds.length) return;

    setDeleting(true);
    try {
      await Promise.all(
        selectedIds.map((id) =>
          api.delete(`/workouts/${id}`)
        )
      );

      setWorkouts((prev) =>
        prev.filter((w) => !selectedIds.includes(w.id))
      );
      setSelectedIds([]);
      setInternalOpenId(null);
    } finally {
      setDeleting(false);
    }
  };

  /* ===============================
     REPLAY (PRESERVED)
  ============================== */
  const replayWorkout = async (item: WorkoutMemoryItem) => {
    if (!item.raw || replayingId) return;

    setReplayingId(item.id);
    try {
      await api.post("/workouts/generate", item.raw);
      alert("Workout replayed successfully");
    } finally {
      setReplayingId(null);
    }
  };

  /* ===============================
     TIPS (PRESERVED)
  ============================== */
  const viewTips = async () => {
    setTipsOpen(true);
    setTipsLoading(true);
    setTipsData(null);

    try {
      const res = await api.get("/workout-tips");
      setTipsData(res.data);

      await api.post("/workout-history/save-tips", {
        tips: res.data,
      });

      onTipsSaved?.();
    } finally {
      setTipsLoading(false);
    }
  };

  if (loading) return <div className="wm-loading">Loading workouts…</div>;
  if (error) return <div className="wm-error">{error}</div>;

  /* ===============================
     RENDER
  ============================== */
  return (
    <>
      {/* FILTER */}
      <div className="wm-toolbar">
        <div className="wm-filter">
          <select
            value={activeGoal}
            onChange={(e) => setActiveGoal(e.target.value)}
          >
            {goals.map((goal) => (
              <option key={goal}>{goal}</option>
            ))}
          </select>
          <span className="wm-filter-arrow">⌄</span>
        </div>
      </div>

      {/* LIST */}
      <section className="workout-memory">
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date} className="wm-group">
            <label className="wm-date-select">
              <input
                type="checkbox"
                checked={isDateFullySelected(date)}
                onChange={() => toggleSelectDate(date)}
              />
              <span className="wm-date-dot" />
              {date}
            </label>

            {items.map((item, index) => {
              const isOpen = openWorkoutId === item.id;

              return (
                <div
                  key={item.id}
                  style={
                    { "--delay": `${index * 80}ms` } as React.CSSProperties
                  }
                >
                  {/* CLICKABLE TITLE */}
                  <div
                    className="wm-title"
                    onClick={() =>
                      onSelectWorkout
                        ? onSelectWorkout(isOpen ? null : item.id)
                        : setInternalOpenId(isOpen ? null : item.id)
                    }
                  >
                    <span>{item.title}</span>
                    <span className={`wm-chevron ${isOpen ? "open" : ""}`}>
                      ⌄
                    </span>
                  </div>

                  {/* DETAILS */}
                  {isOpen && (
                    <WorkoutMemoryCard
                      data={item}
                      selected={selectedIds.includes(item.id)}
                      onSelect={toggleSelect}
                      onReplay={() => replayWorkout(item)}
                      onViewTips={viewTips}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </section>

      <HistoryActionBar
        selectedCount={selectedIds.length}
        onSelectAll={selectAll}
        onClear={clearSelection}
        onDelete={deleteSelected}
        loading={deleting}
      />

      <WorkoutTipsModal
        open={tipsOpen}
        loading={tipsLoading}
        tips={tipsData}
        onClose={() => setTipsOpen(false)}
      />
    </>
  );
}

/* ===============================
   HELPERS (PRESERVED)
================================ */
function formatWorkoutDate(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();

  if (d.toDateString() === today.toDateString()) return "Today";

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function extractExercises(plan: string): string[] {
  if (!plan) return [];
  return plan
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 6);
}
