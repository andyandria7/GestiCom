import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";
import StatsLayout from "../components/StatsLayout";

function Accueil() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const [users, setUsers] = useState([]);
  const [usersError, setUsersError] = useState("");
  const [usersLoading, setUsersLoading] = useState(true);

  const [nbProduits, setNbProduits] = useState(0);
  const [nbPacks, setNbPacks] = useState(0);

  useEffect(() => {
    const loadUsers = async () => {
      setUsersLoading(true);
      setUsersError("");
      const merged = [];
      try {
        try {
          const { data } = await api.get("investisseurs");
          if (Array.isArray(data)) {
            merged.push(
              ...data.map((u) => ({
                id: u.id ?? u.user_id ?? u.investisseur_id,
                nom: u.first_name && u.last_name ? `${u.first_name} ${u.last_name}` : u.first_name ?? u.last_name ?? "",
                email: u.email ?? "",
                created_at: u.created_at ?? u.createdAt ?? u.creation_date ?? u.date_creation ?? null,
                type: "Investisseur",
              }))
            );
          }
        } catch { }
        try {
          const { data } = await api.get("commercials");
          if (Array.isArray(data)) {
            merged.push(
              ...data.map((u) => ({
                id: u.id ?? u.user_id ?? u.commercial_id,
                nom: u.first_name && u.last_name ? `${u.first_name} ${u.last_name}` : u.first_name ?? u.last_name ?? "",
                email: u.email ?? "",
                created_at: u.created_at ?? u.createdAt ?? u.creation_date ?? u.date_creation ?? null,
                type: "Commercial",
              }))
            );
          }
        } catch { }
        setUsers(merged);
      } catch (e) {
        const msg = e.response?.data?.message || e.response?.data?.error || e.message;
        setUsersError(`Erreur chargement utilisateurs${msg ? ` (${msg})` : ""}`);
      } finally {
        setUsersLoading(false);
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    const loadProduits = async () => {
      try {
        const { data } = await api.get("api/products");
        if (Array.isArray(data)) {
          setNbProduits(data.length);
        } else {
          setNbProduits(0);
        }
      } catch (err) {
        console.error("Erreur chargement produits:", err);
        setNbProduits(0);
      }
    };
    loadProduits();
  }, []);

  useEffect(() => {
    const loadPacks = async () => {
      try {
        const { data } = await api.get("api/packs");
        if (Array.isArray(data)) {
          setNbPacks(data.length);
        } else {
          setNbPacks(0);
        }
      } catch (err) {
        console.error("Erreur chargement packs:", err);
        setNbPacks(0);
      }
    };
    loadPacks();
  }, []);

  const recentUsers = useMemo(() => {
    return [...users]
      .sort((a, b) => {
        const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
        return tb - ta;
      })
      .slice(0, 10);
  }, [users]);

  return (
    <DashboardLayout>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 8, marginBottom: 20 }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, color: '#64748b' }}>Packs</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{nbPacks}</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, color: '#64748b' }}>Produits</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{nbProduits}</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, color: '#64748b' }}>Utilisateurs</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{users.length}</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, color: '#64748b' }}>Retraits</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>—</div>
        </div>
      </div>

      <div>
        <StatsLayout/>
      </div>

    </DashboardLayout>
  );
}
const thStyle = {
  textAlign: 'left',
  padding: '14px 16px',
  background: '#f8fafc',
  fontSize: 13,
  fontWeight: 600,
  color: '#475569',
  borderBottom: '1px solid #e5e7eb'
};

const tdStyle = {
  padding: '14px 16px',
  fontSize: 14,
  color: '#334155',
  borderBottom: '1px solid #f1f5f9'
};

export default Accueil;
