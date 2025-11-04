import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";

function Retraits() {
  const [retraits, setRetraits] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRetraits = async () => {
      try {
        const { data } = await api.get("retraits");
        setRetraits(data);
      } catch (error) {
        setError("Erreur lors du chargement des retraits");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRetraits();
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    header: {
      marginBottom: '32px',
      animation: 'fadeIn 0.8s ease-out'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '1.125rem'
    },
    alertError: {
      marginBottom: '24px',
      padding: '16px',
      background: 'linear-gradient(135deg, #fef2f2 0%, #fdf2f8 100%)',
      border: '1px solid #fecaca',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      animation: 'slideIn 0.5s ease-out'
    },
    alertContent: {
      display: 'flex',
      alignItems: 'center'
    },
    alertDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      marginRight: '12px',
      backgroundColor: '#ef4444',
      animation: 'pulse 2s infinite'
    },
    tableContainer: {
      background: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6',
      overflow: 'hidden'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    thead: {
      background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
      color: '#ffffff'
    },
    th: {
      padding: '20px 16px',
      textAlign: 'left',
      fontWeight: '600',
      fontSize: '0.875rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    tbody: {
      background: '#ffffff'
    },
    tr: {
      borderBottom: '1px solid #f3f4f6',
      transition: 'all 0.2s ease-in-out'
    },
    trHover: {
      backgroundColor: '#f8fafc',
      transform: 'scale(1.01)'
    },
    td: {
      padding: '16px',
      fontSize: '0.875rem',
      color: '#374151'
    },
    emptyState: {
      textAlign: 'center',
      padding: '64px 16px',
      background: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    emptyIcon: {
      width: '96px',
      height: '96px',
      background: '#f3f4f6',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      fontSize: '3rem'
    },
    emptyTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px'
    },
    emptyDescription: {
      color: '#6b7280'
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div style={styles.container}>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
            <div className="spinner" style={{ width: 40, height: 40, border: '4px solid #f3f4f6', borderTop: '4px solid #ec4899', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Retraits</h1>
          <p style={styles.subtitle}>Suivi des demandes de retrait des utilisateurs</p>
        </div>

        {error && (
          <div style={styles.alertError}>
            <div style={styles.alertContent}>
              <div style={styles.alertDot}></div>
              <p style={{ color: '#991b1b', fontWeight: '500', margin: 0 }}>{error}</p>
            </div>
          </div>
        )}

        {retraits.length > 0 ? (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th style={styles.th}>Utilisateur</th>
                  <th style={styles.th}>Montant</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody style={styles.tbody}>
                {retraits.map((retrait) => (
                  <tr key={retrait.id} style={styles.tr}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, { ...styles.tr, ...styles.trHover })}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.tr)}
                  >
                    <td style={styles.td}>{retrait.utilisateur}</td>
                    <td style={styles.td}>{retrait.montant} Ar</td>
                    <td style={styles.td}>{new Date(retrait.date).toLocaleDateString('fr-FR', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>💸</div>
            <h3 style={styles.emptyTitle}>Aucun retrait trouvé</h3>
            <p style={styles.emptyDescription}>Les demandes de retrait s'afficheront ici une fois disponibles</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </DashboardLayout>
  );
}

export default Retraits;
