const styles = {
  container: {
    minHeight: "100vh",
    background: "#f9fafb",
    padding: "24px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  header: {
    marginBottom: "32px",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 800,
    background: "linear-gradient(135deg, #6366f1, #10b981)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: "1rem",
    fontWeight: 500,
    color: "#475569",
  },

  alertError: {
    marginBottom: "20px",
    padding: "14px 18px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    color: "#b91c1c",
    fontWeight: "500",
  },

  // Styles pour la table CRUD
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  th: {
    background: "#f1f5f9",
    color: "#374151",
    textAlign: "left",
    padding: "12px 16px",
    fontSize: "0.9rem",
    fontWeight: "600",
    borderBottom: "1px solid #e5e7eb",
  },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "0.9rem",
    color: "#111827",
  },
  trHover: {
    background: "#f9fafb",
  },

  // Boutons actions
  actionBtn: {
    padding: "6px 12px",
    fontSize: "0.85rem",
    fontWeight: "600",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    marginRight: "8px",
  },
  editBtn: {
    background: "#3b82f6",
    color: "#fff",
  },
  deleteBtn: {
    background: "#ef4444",
    color: "#fff",
  },

  emptyState: {
    textAlign: "center",
    padding: "60px 16px",
  },
  emptyIcon: {
    width: "70px",
    height: "70px",
    background: "#f3f4f6",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
    fontSize: "2rem",
    color: "#9ca3af",
  },
  emptyTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "4px",
  },
  emptyDescription: {
    color: "#6b7280",
    fontSize: "0.85rem",
  },
actionButton: {
  padding: "0.5rem",
  border: "none",
  borderRadius: "0.5rem",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
},

editButton: {
  background: "#fef3c7",
  color: "green",
},

deleteButton: {
  background: "#fee2e2",
  color: "#dc2626",
},
  
  productImageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: "40px",
    height: "25%",
  },
  
  productImage: {
    width: "41%",
    height: "100px",
    objectFit: "cover",
    borderRadius: "1px",
  },
  
  header: {
    marginBottom: "32px",
  },
  title: {fontSize: '2rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #6366f1, #10b981)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    fontSize: '1rem', 
    fontWeight: 500, 
    color: '#475569'
  },
  alertError: {
    marginBottom: "20px",
    padding: "14px 18px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    color: "#b91c1c",
    fontWeight: "500",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", 
    gap: "16px", 
  },
  card: {
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e5e7eb",
    padding: "16px", 
    transition: "all 0.2s ease-in-out",
  },
  cardHover: {
    transform: "translateY(-4px)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "35px",
  },
  cardIcon: {
    width: "36px", // réduit taille icône
    height: "36px",
    background: "#f3f4f6",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    color: "#374151",
  },
  cardId: {
    fontSize: "0.7rem", // réduit taille texte
    color: "#6b7280",
    fontWeight: "500",
  },
  cardTitle: {
    fontSize: "1rem", // réduit titre
    fontWeight: "600",
    color: "#111827",
    marginBottom: "6px",
  },
  cardDescription: {
    color: "#6b7280",
    fontSize: "0.8rem", // réduit description
    lineHeight: "1.0",
    marginBottom: "12px",
  },
  descriptionInput: {
  width: "100%",        // occupe toute la largeur normale du formulaire
  padding: "0.75rem 1rem",
  height: "50px",
  fontSize: "1rem",
  border: "1px solid #d1d5db",
  borderRadius: "0.75rem",
  outline: "none",
  resize: "vertical",   // permet de redimensionner en hauteur seulement
  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
},


  priceContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 12px", // réduit padding
    background: "#f9fafb",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
  },
  priceLabel: {
    fontSize: "0.75rem", // réduit taille
    fontWeight: "500",
    color: "#374151",
  },
  priceValue: {
    fontSize: "0.95rem", // réduit taille
    fontWeight: "700",
    color: "#111827",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 16px",
  },
  emptyIcon: {
    width: "70px", // réduit taille
    height: "70px",
    background: "#f3f4f6",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
    fontSize: "2rem",
    color: "#9ca3af",
  },
  emptyTitle: {
    fontSize: "1rem", // réduit taille
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "4px",
  },
  emptyDescription: {
    color: "#6b7280",
    fontSize: "0.85rem", // réduit taille
  },
};

export default styles;
