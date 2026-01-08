import "./WorkoutTipsModal.css";
import { X, Sparkles } from "lucide-react";
import { useEffect } from "react";

/* ===============================
   PROPS (PRESERVED)
================================ */

interface Props {
  open: boolean;
  loading: boolean;
  tips: {
    warmup: string[];
    workout: string[];
    recovery: string[];
  } | null;
  onClose: () => void;
}

/* ===============================
   COMPONENT
================================ */

export default function WorkoutTipsModal({
  open,
  loading,
  tips,
  onClose,
}: Props) {
  /* ===============================
     ESC KEY CLOSE (UX UPGRADE)
  ============================== */
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="wtm-backdrop" onClick={onClose}>
      <div
        className="wtm-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* CLOSE */}
        <button className="wtm-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        {/* HEADER */}
        <div className="wtm-header">
          <Sparkles size={18} />
          <h2 className="wtm-title">AI Coaching Tips</h2>
        </div>

        {/* CONTENT */}
        <div className="wtm-content">
          {loading && (
            <div className="wtm-loading">
              <span className="wtm-spinner" />
              Generating insights…
            </div>
          )}

          {!loading && tips && (
            <>
              <Section title="Warm-up" items={tips.warmup} />
              <Section title="Workout" items={tips.workout} />
              <Section title="Recovery" items={tips.recovery} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===============================
   SECTION (PRESERVED + POLISH)
================================ */

function Section({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  if (!items?.length) return null;

  return (
    <section className="wtm-section">
      <h4 className="wtm-section-title">{title}</h4>
      <ul className="wtm-list">
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </section>
  );
}
