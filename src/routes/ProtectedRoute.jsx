import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import React from "react";

const ProtectedRoute = ({ roles, children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0) {
    const userRole = user.UserType?.toString();
    if (!roles.includes(userRole)) {
      return <Navigate to="/undefine" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
