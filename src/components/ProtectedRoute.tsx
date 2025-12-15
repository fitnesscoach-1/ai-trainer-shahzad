import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { user, loading } = useAuth();

  // Wait until auth check finishes
  if (loading) {
    return <div>loading</div>;
  }

  // If not logged in, redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authorized → show page
  return children;
}
