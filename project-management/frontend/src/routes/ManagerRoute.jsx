// src/routes/ManagerRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

function ManagerRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    // není vůbec přihlášen
    return <Navigate to="/login" replace />;
  }

  let role;
  try {
    // JWT = header.payload.signature
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    role = decoded.role; // předpokládáme, že jsi v JwtService přidal .claim("role", role)
  } catch (e) {
    // špatný token
    return <Navigate to="/login" replace />;
  }

  if (role !== "manager") {
    // není manager → přesměruj nebo vrať 404/403
    return <Navigate to="/NotFoundPage" replace />;
  }

  // je ok
  return children;
}

export default ManagerRoute;
