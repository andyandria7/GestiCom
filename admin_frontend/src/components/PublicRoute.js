import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  if (token && token !== "undefined" && token !== "null") {
    // Déjà connecté → redirection vers dashboard
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default PublicRoute;
