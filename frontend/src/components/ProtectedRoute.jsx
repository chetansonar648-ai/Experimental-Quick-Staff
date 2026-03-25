import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ roles, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is in the allowed roles
  if (roles && !roles.includes(user.role)) {
    // Redirect based on their actual role
    if (user.role === 'client') {
      return <Navigate to="/client" replace />;
    } else if (user.role === 'worker') {
      return <Navigate to="/worker/dashboard" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;

