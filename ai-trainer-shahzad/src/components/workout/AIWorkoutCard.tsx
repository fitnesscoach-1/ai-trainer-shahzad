import "./AIWorkoutCard.css";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

/* ======================================================
   AI WORKOUT CARD (SAFE + UPGRADED)
====================================================== */

export default function AIWorkoutCard() {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement | null>(null);

  /* =========================
     MOUSE TILT EFFECT
  ========================= */
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
      className="workout-card ai-workout-card"
      /* 🔥 CRITICAL FIX: force background image via inline style */
      style={{
        backgroundImage:
          "url('/workout-images/workout/ai-workout-card.png')",
      }}
      onClick={() => navigate("/ai-workout-generator")}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="workout-card-content">
        <h3>AI Workout Generator</h3>
        <p>Generate personalized workouts using AI</p>
        <button>Generate Workout</button>
      </div>
    </div>
  );
}
