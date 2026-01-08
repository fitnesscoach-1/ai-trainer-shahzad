import "./WorkoutGoalCard.css";

interface Props {
  title: string;
  subtitle: string;
  image: string;
  selected: boolean;
  onClick: () => void;
}

export default function WorkoutGoalCard({
  title,
  subtitle,
  image,
  selected,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      className={`goal-card ${selected ? "active" : ""}`}
      onClick={onClick}
    >
      <img src={image} alt={title} />
      <h4>{title}</h4>
      <p>{subtitle}</p>
    </button>
  );
}
