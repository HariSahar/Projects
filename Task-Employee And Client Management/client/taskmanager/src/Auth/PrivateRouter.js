import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "./Authenticate";

function PrivateRoute({ element: Component, ...rest }) {
  const location = useLocation();

  if (location.pathname === "/login" || location.pathname === "/register") {
    return <Navigate to="/" replace />;
  }

  return isAuthenticated() ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" replace />
  );
}

export default PrivateRoute;
