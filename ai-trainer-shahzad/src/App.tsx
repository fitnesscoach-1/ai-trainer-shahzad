import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./auth/ProtectedRoute";
import Navbar from "./components/Navbar";
import Workout from "./pages/Workout";
import WorkoutHistory from "./pages/WorkoutHistory";
import Diet from "./pages/Diet";
import DietHistory from "./pages/DietHistory";
import Contact from "./pages/Contact"; // ✅ NEW

function App() {
  return (
    <>
      {/* Navbar stays globally available */}
      <Navbar />

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ✅ PUBLIC PAGES */}
        <Route path="/diet" element={<Diet />} />
        <Route path="/contact" element={<Contact />} /> {/* ✅ CONNECTED */}

        {/* ================= USER ROUTES ================= */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workouts"
          element={
            <ProtectedRoute>
              <Workout />
            </ProtectedRoute>
          }
        />

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

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ROUTE ================= */}
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
