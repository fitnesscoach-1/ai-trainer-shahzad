import { useState } from "react";

export interface WorkoutFormData {
  name: string;
  age: number | "";
  weight: number | "";
  weight_unit: "kg" | "lb";
  height: number | "";
  height_unit: "cm" | "ft";
  blood_group: string;
  fitness_goal: string;
  medical_condition: string;
  workout_preference: string;
}

export function useWorkoutForm() {
  const [form, setForm] = useState<WorkoutFormData>({
    name: "",
    age: "",
    weight: "",
    weight_unit: "kg",
    height: "",
    height_unit: "cm",
    blood_group: "",
    fitness_goal: "strength",
    medical_condition: "",
    workout_preference: "",
  });

  const updateField = <K extends keyof WorkoutFormData>(
    key: K,
    value: WorkoutFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return {
    form,
    updateField,
  };
}
