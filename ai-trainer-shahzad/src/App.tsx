import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./auth/ProtectedRoute";
import Navbar from "./components/navbar/Navbar";

import Workout from "./pages/Workout";
import Diet from "./pages/Diet";
import DietHistory from "./pages/DietHistory";
import Contact from "./pages/Contact";

// ✅ AI WORKOUT GENERATOR PAGE
import AIWorkoutGenerator from "./pages/AIWorkoutGenerator";

// ✅ WORKOUT TIPS PAGE
import WorkoutTips from "./pages/WorkoutTips";

// ✅ AI MEMORY VAULT (NEW)
import WorkoutHistory from "./pages/Workouthistory";
function App() {
  return (
    <>
      {/* Navbar stays globally available */}
      <Navbar />

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ================= PUBLIC PAGES ================= */}
        <Route path="/diet" element={<Diet />} />
        <Route path="/contact" element={<Contact />} />

        {/* ================= USER ROUTES ================= */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* 🔥 WORKOUT DASHBOARD */}
        <Route
          path="/workouts"
          element={
            <ProtectedRoute>
              <Workout />
            </ProtectedRoute>
          }
        />

        {/* 🔥 AI WORKOUT GENERATOR */}
        <Route
          path="/ai-workout-generator"
          element={
            <ProtectedRoute>
              <AIWorkoutGenerator />
            </ProtectedRoute>
          }
        />

        {/* 🔥 WORKOUT TIPS */}
        <Route
          path="/workout-tips"
          element={
            <ProtectedRoute>
              <WorkoutTips />
            </ProtectedRoute>
          }
        />

        {/* ================= HISTORY ROUTES ================= */}
        <Route
          path="/workout-history"
          element={
            <ProtectedRoute>
              <WorkoutHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/diet-history"
          element={
            <ProtectedRoute>
              <DietHistory />
            </ProtectedRoute>
          }
        />

        {/* 🌌 AI MEMORY VAULT (NEW MASTER HISTORY PAGE) */}
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <WorkoutHistory/>
            </ProtectedRoute>
          }
        />

        {/* ================= PROFILE ================= */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
