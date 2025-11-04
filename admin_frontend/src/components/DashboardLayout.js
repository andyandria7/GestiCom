
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaBoxOpen, FaShoppingCart, FaMoneyBillWave, FaUsers, FaSignOutAlt, FaShippingFast } from "react-icons/fa";

function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const styles = {
    layout: {
      display: "flex",
      minHeight: "100vh",
      background: "#f8fafc",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    },
    sidebar: {
      position: "sticky",
      top: 0,
      alignSelf: "flex-start",
      width: 260,
      minHeight: "100vh",
      background: "#ffffff",
      color: "#0f172a",
      padding: "24px 18px",
      boxShadow: "0 0 0 1px #e5e7eb",
      borderRight: "1px solid #e5e7eb",
      display: "flex",
      flexDirection: "column",
      gap: 12,
    },
    brand: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 800,
      fontSize: "1.50rem",
      letterSpacing: 0.5,
      color: "rgb(109, 99, 241)",
      marginBottom: 4,
    },
    brandTagline: {
      textAlign: "center",
      fontSize: 12,
      color: "#64748b",
      marginBottom: 18,
      letterSpacing: 0.2,
    },
    nav: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
    },
    linkWrap: (active) => ({
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 12px",
      borderRadius: 12,
      color: active ? "#0f172a" : "#334155",
      background: active ? "#e2e8f0" : "transparent",
      textDecoration: "none",
      fontWeight: 700,
      border: active ? "1px solid #e2e8f0" : "1px solid transparent",
      transition: "all .18s ease",
    }),
    linkIcon: { opacity: 0.95, fontSize: 18 },
    linkText: { fontSize: 14, letterSpacing: 0.2 },

    content: {
      flex: 1,
      minWidth: 0,
      background: "#f8fafc",
      color: "#0f172a",
      padding: 0,
      position: "relative",
    },
    topbar: {
      position: "sticky",
      top: 0,
      zIndex: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 24px",
      background: "#ffffff",
      backdropFilter: "none",
      borderBottom: "1px solid #e5e7eb",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    },
    topbarTitle: {
      margin: 0,
      fontSize: 18,
      fontWeight: 800,
      letterSpacing: 0.3,
      color: "#0f172a",
    },
    topbarActions: {
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    logoutBtn: {
      padding: "10px 12px",
      borderRadius: 10,
      border: "1px solid rgba(239,68,68,0.35)",
      background: "linear-gradient(120deg, #ef4444, #dc2626)",
      color: "#fff",
      fontWeight: 700,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 8,
    },

    main: {
      padding: 24,
    },
  };

  return (
    <div style={styles.layout}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>Invest Admin</div>
        <div style={styles.brandTagline}>Gérez vos investissements et votre communauté</div>
        <nav style={styles.nav}>
          <Link to="/dashboard" style={styles.linkWrap(isActive("/dashboard"))}>
            <FaHome style={styles.linkIcon} />
            <span style={styles.linkText}>Accueil</span>
          </Link>
          <Link to="/dashboard/packs" style={styles.linkWrap(isActive("/dashboard/packs"))}>
            <FaBoxOpen style={styles.linkIcon} />
            <span style={styles.linkText}>Packs</span>
          </Link>
          <Link to="/dashboard/produits" style={styles.linkWrap(isActive("/dashboard/produits"))}>
            <FaShoppingCart style={styles.linkIcon} />
            <span style={styles.linkText}>Produits</span>
          </Link>
          <Link to="/dashboard/transactions" style={styles.linkWrap(isActive("/dashboard/transactions"))}>
            <FaMoneyBillWave style={styles.linkIcon} />
            <span style={styles.linkText}>Transactions</span>
          </Link>
          <Link to="/dashboard/utilisateurs" style={styles.linkWrap(isActive("/dashboard/utilisateurs"))}>
            <FaUsers style={styles.linkIcon} />
            <span style={styles.linkText}>Utilisateurs</span>
          </Link>
          <Link to="/dashboard/delivery" style={styles.linkWrap(isActive("/dashboard/delivery"))}>
            <FaShippingFast style={styles.linkIcon} />
            <span style={styles.linkText}>Livraison</span>
          </Link>
          <Link to="/dashboard/clients" style={styles.linkWrap(isActive("/dashboard/clients"))}>
            <FaUsers style={styles.linkIcon} />
            <span style={styles.linkText}>Clients</span>
          </Link>
        </nav>
      </aside>

      <section style={styles.content}>
        <div style={styles.topbar}>
          <h3 style={styles.topbarTitle}>Tableau de bord</h3>
          <div style={styles.topbarActions}>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              <FaSignOutAlt /> Déconnexion
            </button>
          </div>
        </div>
        <main style={styles.main}>{children}</main>
      </section>
    </div>
  );
}

export default DashboardLayout;
