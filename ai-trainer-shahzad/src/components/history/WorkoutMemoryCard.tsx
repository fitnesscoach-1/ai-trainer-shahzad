import "./WorkoutMemoryCard.css";
import { Clock, Play, Loader2 } from "lucide-react";

/* ===============================
   TYPES (PRESERVED)
================================ */

interface WorkoutMemory {
  id: number;
  date: string;
  goal: string;
  title: string;
  duration: string;
  exercises: string[];
}

/* ===============================
   PROPS (CLEANED & SAFE)
================================ */

interface Props {
  data: WorkoutMemory;

  selected?: boolean;
  onSelect?: (id: number) => void;

  /* REPLAY (PRESERVED) */
  onReplay?: (workout: WorkoutMemory) => void;

  /* UI STATE */
  replaying?: boolean;
}

/* ===============================
   COMPONENT
================================ */

export default function WorkoutMemoryCard({
  data,
  selected = false,
  onSelect,
  onReplay,
  replaying = false,
}: Props) {
  return (
    <article
      className={`wm-card ${selected ? "selected" : ""}`}
      aria-selected={selected}
    >
      {/* ===============================
         LEFT CHECK
      ============================== */}
      <label className="wm-check">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect?.(data.id)}
        />
      </label>

      {/* ===============================
         MAIN CONTENT
      ============================== */}
      <div className="wm-body">
        {/* DATE + GOAL */}
        <div className="wm-top">
          <span className="wm-date">{data.date}</span>
          <span className="wm-pill">{data.goal}</span>
        </div>

        {/* TITLE */}
        <h3 className="wm-title">{data.title}</h3>

        {/* META */}
        <p className="wm-meta">
          {data.exercises.length} exercises • {data.duration}
        </p>

        {/* EXERCISES */}
        <ul className="wm-exercises">
          {data.exercises.map((ex, i) => (
            <li key={i}>
              <span className="wm-tick">✓</span>
              {ex}
            </li>
          ))}
        </ul>

        {/* FOOTER */}
        <div className="wm-footer">
          <span className="wm-time">
            <Clock size={14} />
            {data.duration}
          </span>

          <div className="wm-actions">
            {/* REPLAY */}
            <button
              className="wm-btn ghost"
              onClick={() => onReplay?.(data)}
              disabled={!onReplay || replaying}
              aria-busy={replaying}
            >
              {replaying ? (
                <>
                  <Loader2 size={14} className="spin" />
                  Replaying…
                </>
              ) : (
                <>
                  <Play size={14} />
                  Replay
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ===============================
         COACH AVATARS
      ============================== */}
      <div className="wm-coaches">
        <img src="/coaches/aria.png" alt="Aria" />
        <img src="/coaches/atlas.png" alt="Atlas" />
      </div>
    </article>
  );
}
