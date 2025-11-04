import { Routes, Route } from "react-router-dom";
import UsersDashboard from "./pages/UsersDashboard";
import Login from "./pages/Login";
import Accueil from "./pages/Accueil";
import Packs from "./pages/Packs";
import Produits from "./pages/Produits";            
import Transactions from "./pages/Transactions";
import Delivery from "./pages/Delivery";
import Clients from "./pages/Clients";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Accueil />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/packs"
        element={
          <PrivateRoute>
            <Packs />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/produits"
        element={
          <PrivateRoute>
            <Produits />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/transactions"
        element={
          <PrivateRoute>
            <Transactions />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/utilisateurs"
        element={
          <PrivateRoute>
            <UsersDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/delivery"
        element={
          <PrivateRoute>
            <Delivery />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/clients"
        element={
          <PrivateRoute>
            <Clients />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
