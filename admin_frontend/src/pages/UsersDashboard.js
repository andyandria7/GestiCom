import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";

function UsersDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const results = [];
        // Investisseurs
        try {
          const { data } = await api.get("investisseurs");
          if (Array.isArray(data)) {
            results.push(
              ...data.map((u) => ({
                id: u.id ?? u.user_id ?? u.investisseur_id,
                nom:  u.first_name ?? "",
                prenom:  u.last_name ?? "",
                numero:  u.phone_number ?? "",
                email: u.email ?? "",
                date:  u.date_of_birth ?? "",
                created_at: u.created_at ?? u.createdAt ?? u.creation_date ?? u.date_creation ?? null,
                actif: u.actif ?? 0,
                type: "Investisseur",
                endpoint: "investisseurs",
              }))
            );
          }
        } catch { }
        // Commerciaux
        try {
          const { data } = await api.get("commercials");
          if (Array.isArray(data)) {
            results.push(
              ...data.map((u) => ({
                id: u.id ?? u.user_id ?? u.commercial_id,
                nom: u.nom ?? u.first_name ?? "",
                prenom: u.prenom ?? u.last_name ?? "",
                numero: u.numero ?? u.phone_number ?? "",
                email: u.email ?? "",
                date: u.date ?? u.date_of_birth ?? "",
                created_at: u.created_at ?? u.createdAt ?? u.creation_date ?? u.date_creation ?? null,
                actif: u.actif ?? 0,
                type: "Commercial",
                endpoint: "commercials",
              }))
            );
          }
        } catch { }

        setUsers(results);
      } catch (e) {
        const msg = e.response?.data?.message || e.response?.data?.error || e.message;
        setError(`Erreur lors du chargement des utilisateurs${msg ? ` (${msg})` : ""}`);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      (u.nom || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.type || "").toLowerCase().includes(q)
    );
  }, [query, users]);

  const toggleActif = async (user) => {
    if (!user?.id || !user?.endpoint) return;
    setTogglingId(user.id);
    try {
      await api.put(`${user.endpoint}/${user.id}`, { actif: user.actif ? 0 : 1 });
      setUsers((prev) => prev.map((u) => (u.id === user.id && u.endpoint === user.endpoint ? { ...u, actif: user.actif ? 0 : 1 } : u)));
    } catch (e) {
      const msg = e.response?.data?.message || e.response?.data?.error || e.message;
      setError(`Erreur lors de la modification du statut${msg ? ` (${msg})` : ""}`);
    } finally {
      setTogglingId(null);
    }
  };

  const styles = {
    container: { padding: 24 },
    header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
    title: { margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" },
    search: {
      width: 320,
      padding: "10px 12px",
      borderRadius: 10,
      border: "1px solid #e5e7eb",
      background: "#fff",
      outline: "none",
    },
    alert: {
      marginBottom: 12,
      padding: "10px 12px",
      background: "#fef2f2",
      border: "1px solid #fecaca",
      borderRadius: 10,
      color: "#7f1d1d",
      fontWeight: 600,
    },
    tableWrap: {
      background: "#fff",
      border: "3px solid #e5e7eb",
      borderRadius: 12,
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { textAlign: "left", padding: "12px 14px", background: "#f8fafc", fontSize: 13, color: "#475569", borderBottom: "1px solid #e5e7eb" },
    td: { padding: "12px 14px", fontSize: 14, color: "#0f172a", borderBottom: "1px solid #f1f5f9" },
    badge: (active) => ({
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 700,
      color: active ? "#065f46" : "#991b1b",
      background: active ? "#d1fae5" : "#fee2e2",
    }),
    type: {
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 700,
      color: "#1f2937",
      background: "#e5e7eb",
    },
    actionBtn: (active) => ({
      padding: "8px 12px",
      borderRadius: 10,
      border: "none",
      cursor: "pointer",
      fontWeight: 700,
      color: "#fff",
      background: active ? "#ef4444" : "#10b981",
    }),
    spinner: {
      width: 14,
      height: 14,
      border: "2px solid #fff",
      borderTop: "2px solid transparent",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      display: "inline-block",
      marginRight: 6,
    },
  };

  return (
    <DashboardLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Utilisateurs</h2>
          <input style={styles.search} placeholder="Recherche (nom, email, type)" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        {error && <div style={styles.alert}>{error}</div>}
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nom</th>
                  <th style={styles.th}>Prénom</th>
                  <th style={styles.th}>Numéro</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Date de naissance</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Inscrit le</th>
              
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, idx) => (
                  <tr key={`${u.endpoint}-${u.id ?? u.email ?? idx}`}>
                    
                    <td style={styles.td}>{u.nom || "-"}</td>
                    <td style={styles.td}>{u.prenom || "-"}</td>
                    <td style={styles.td}>{u.numero || "-"}</td>
                    <td style={styles.td}>{u.email || "-"}</td>
                    <td style={styles.td}>
                      {u.date}
                    </td>
                    <td style={styles.td}><span style={styles.type}>{u.type}</span></td>
                    <td style={styles.td}>
                      {u.created_at
                        ? new Date(u.created_at).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })
                        : "-"}
                    </td>
                    

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default UsersDashboard;
