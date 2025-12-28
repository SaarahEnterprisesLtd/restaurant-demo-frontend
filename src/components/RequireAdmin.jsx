import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAdmin({ children }) {
  const { user, booting } = useAuth();
  const loc = useLocation();

  if (booting) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;

  if (user.role !== "admin") return <Navigate to="/menu" replace />;

  return children;
}
