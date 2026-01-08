export interface WorkoutGoal {
  id: "balanced" | "strength" | "toning" | "weight_loss";
  title: string;
  subtitle: string;
  image: string;
}

export const workoutGoals: WorkoutGoal[] = [
  {
    id: "balanced",
    title: "Balanced",
    subtitle: "Stability & Health",
    image: "/images/balanced.png",
  },
  {
    id: "strength",
    title: "Strength",
    subtitle: "Build Muscle",
    image: "/images/strength.png",
  },
  {
    id: "toning",
    title: "Body Toning",
    subtitle: "Sculpt & Define",
    image: "/images/toning.png",
  },
  {
    id: "weight_loss",
    title: "Weight Loss",
    subtitle: "Burn Fat",
    image: "/images/weight-loss.png",
  },
];
