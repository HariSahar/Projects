import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./Authenticate";

export default function PublicRoute({ element: Component, ...rest }) {
  return !isAuthenticated() ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/" replace />
  );
}
