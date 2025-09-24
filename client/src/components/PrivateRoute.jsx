import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles, redirect = "/login" }) => {
  const auth = useSelector((store) => store.auth);
  const location = useLocation();

  if (!auth.accessToken) {
    return <Navigate to={redirect} replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
