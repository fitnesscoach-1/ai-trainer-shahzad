import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import './WorkoutCard.css';

interface WorkoutCardProps {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  navigateTo: string;
  cardClass: string;
}

export default function WorkoutCard({
  title,
  description,
  image,
  buttonText,
  navigateTo,
  cardClass,
}: WorkoutCardProps) {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement | null>(null);

  /* ===============================
     PARALLAX HOVER LOGIC (PRESERVED)
  ================================ */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -(y - centerY) / 18;
    const rotateY = (x - centerX) / 18;

    card.style.transform = `
      perspective(900px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-8px)
      scale(1.03)
    `;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    card.style.transform = `
      perspective(900px)
      rotateX(0deg)
      rotateY(0deg)
      translateY(0)
      scale(1)
    `;
  };

  return (
    <div
      ref={cardRef}
      className={`workout-card ${cardClass}`}
      style={{ backgroundImage: `url('${image}')` }}
      onClick={() => navigate(navigateTo)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="workout-card-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <button>{buttonText}</button>
      </div>
    </div>
  );
}
