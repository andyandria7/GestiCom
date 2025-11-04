import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  // ❌ Vérifie aussi si le token est vide ou invalide
  if (!token || token === "undefined" || token === "null") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;
