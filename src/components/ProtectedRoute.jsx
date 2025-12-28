import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ requireAdmin = false }) {
  const { user, booting } = useAuth();
  const loc = useLocation();

  if (booting) return <div className="p-6">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }

  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/menu" replace />;
  }

  return <Outlet />;
}
