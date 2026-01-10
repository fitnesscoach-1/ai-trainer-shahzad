import "./WorkoutGoalCard.css";

/* ===============================
   PROPS (UPGRADED – NON-BREAKING)
================================ */
interface Props {
  /* 🔥 REQUIRED FOR THEMES (SAFE ADDITION) */
  goalId: string;

  /* 🔒 OLD DATA — PRESERVED */
  title: string;
  subtitle: string;
  image: string;
  selected: boolean;
  onClick: () => void;

  /* ♿ ACCESSIBILITY (OPTIONAL, SAFE) */
  role?: string;
  ariaChecked?: boolean;
}

/* ===============================
   COMPONENT
================================ */
export default function WorkoutGoalCard({
  goalId,
  title,
  subtitle,
  image,
  selected,
  onClick,
  role,
  ariaChecked,
}: Props) {
  return (
    <button
      type="button"
      className={`goal-card ${selected ? "active" : ""}`}

      /* 🔥 ENABLES GOAL-BASED CSS THEMES */
      data-goal={goalId}

      /* 🔒 OLD CLICK FLOW — PRESERVED */
      onClick={onClick}

      /* ♿ ACCESSIBILITY — SAFE */
      role={role}
      aria-checked={ariaChecked}
    >
      {/* GOAL IMAGE */}
      <img src={image} alt={title} />

      {/* TEXT */}
      <h4>{title}</h4>
      <p>{subtitle}</p>
    </button>
  );
}
