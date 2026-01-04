// src/components/workout/progress/ProgressRing.tsx
import { useEffect, useState } from "react";

interface Props {
  value: number; // 0 - 100
  size?: number;
  stroke?: number;
  label: string;
}

export default function ProgressRing({
  value,
  size = 120,
  stroke = 10,
  label,
}: Props) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 1;
      if (start >= value) {
        start = value;
        clearInterval(interval);
      }
      setProgress(start);
    }, 14);
    return () => clearInterval(interval);
  }, [value]);

  const getColor = () => {
    if (value < 40) return "#ef4444";
    if (value < 70) return "#facc15";
    return "#22d3ee";
  };

  return (
    <div className="progress-ring">
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (progress / 100) * circumference}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.3s ease" }}
        />
      </svg>

      <div className="ring-center">
        <span className="value">{progress}%</span>
        <span className="label">{label}</span>
      </div>
    </div>
  );
}
