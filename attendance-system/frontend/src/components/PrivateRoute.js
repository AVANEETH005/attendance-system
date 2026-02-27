import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, allowedRoles }) => {

  const { user, loading } = useAuth();

  // Wait until auth context finishes loading
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        Loading...
      </div>
    );
  }

  // If user not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If route has role restriction
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;