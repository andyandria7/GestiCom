import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MapPin,
  Trash2,
  CheckCircle,
  BadgeCheck,
  Calendar,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";
import Swal from "sweetalert2";

const formStyles = {
  container: {
    padding: "2rem",
    background: "#f8fafc",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
  },
  searchContainer: {
    background: "#fff",
    borderRadius: "1rem",
    padding: "1.5rem",
    marginBottom: "2rem",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
  },
  searchRow: {
    display: "flex",
    gap: "1rem",
    alignItems: "end",
  },
  searchInput: {
    flex: 1,
    padding: "0.75rem 1rem 0.75rem 2.5rem",
    fontSize: "1rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.75rem",
    outline: "none",
    transition: "border 0.2s ease-in-out",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
    position: "relative",
  },
  searchInputContainer: {
    position: "relative",
    flex: 1,
  },
  searchIcon: {
    position: "absolute",
    left: "0.75rem",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#6b7280",
    zIndex: 1,
  },
  button: {
    padding: "0.75rem 1.5rem",
    background: "linear-gradient(to right, #10b981, #0ea5e9)",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "1rem",
    borderRadius: "0.75rem",
    border: "none",
    cursor: "pointer",
    transition: "opacity 0.2s ease-in-out",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  filterButton: {
    padding: "0.75rem",
    background: "#fff",
    color: "#6b7280",
    border: "1px solid #d1d5db",
    borderRadius: "0.75rem",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  },
  table: {
    background: "#fff",
    borderRadius: "1rem",
    overflow: "hidden",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
  },
  tableHeader: {
    background: "linear-gradient(to right, #f8fafc, #f1f5f9)",
    padding: "1.5rem",
    borderBottom: "1px solid #e2e8f0",
  },
  tableHeaderRow: {
    display: "grid",
    gridTemplateColumns: "80px 200px 180px 150px 120px 100px 100px 120px",
    gap: "1rem",
    alignItems: "center",
  },
  tableHeaderCell: {
    fontWeight: "700",
    color: "#374151",
    fontSize: "0.875rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  tableBody: {
    maxHeight: "600px",
    overflowY: "auto",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "80px 200px 180px 150px 120px 100px 100px 120px",
    gap: "1rem",
    alignItems: "center",
    padding: "1rem 1.5rem",
    borderBottom: "1px solid #f3f4f6",
    transition: "background 0.2s ease-in-out",
    cursor: "pointer",
  },
  tableCell: {
    color: "#374151",
    fontSize: "0.875rem",
  },
  idBadge: {
    background: "linear-gradient(to right, #10b981, #0ea5e9)",
    color: "#fff",
    padding: "0.25rem 0.5rem",
    borderRadius: "0.5rem",
    fontSize: "0.75rem",
    fontWeight: "600",
    textAlign: "center",
    minWidth: "40px",
  },
  clientInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  clientName: {
    fontWeight: "600",
    color: "#111827",
  },
  clientContact: {
    fontSize: "0.75rem",
    color: "#6b7280",
  },
  productInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  productName: {
    fontWeight: "600",
    color: "#111827",
  },
  productPrice: {
    fontSize: "0.75rem",
    color: "#059669",
    fontWeight: "600",
  },
  placeInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#6b7280",
  },
  dateInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#6b7280",
  },
  quantityBadge: {
    background: "#fef3c7",
    color: "#d97706",
    padding: "0.25rem 0.5rem",
    borderRadius: "0.5rem",
    fontSize: "0.75rem",
    fontWeight: "600",
    textAlign: "center",
  },
  actionButtons: {
    display: "flex",
    gap: "0.5rem",
    justifyContent: "center",
  },
  actionButton: {
    padding: "0.5rem",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  },
  viewButton: {
    background: "#dbeafe",
    color: "#1d4ed8",
  },
  editButton: {
    background: "#fef3c7",
    color: "#d97706",
  },
  deleteButton: {
    background: "#fee2e2",
    color: "#dc2626",
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },
  statCard: {
    background: "#fff",
    borderRadius: "1rem",
    padding: "1.5rem",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
  },
  statNumber: {
    fontSize: "2rem",
    fontWeight: "700",
    background: "linear-gradient(to right, #10b981, #0ea5e9)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  statLabel: {
    color: "#6b7280",
    fontSize: "0.875rem",
    marginTop: "0.5rem",
  },
};

function Delivery() {
  const [deliveryData, setDeliveryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // 👉 Récupération depuis ton backend CI4
  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/delivery");
      setDeliveryData(response.data);
    } catch (error) {
      console.error("Erreur API:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDelivery = async (delivery) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: `Voulez-vous vraiment supprimer la livraison de "${delivery.product?.name}" ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e63946",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/delivery/${delivery.delivery_id}`);

          setDeliveryData((prev) =>
            prev.filter((d) => d.delivery_id !== delivery.delivery_id)
          );

          Swal.fire({
            title: "Supprimé !",
            text: "La livraison a été supprimée avec succès.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error("Erreur suppression :", error);
          Swal.fire("Erreur", "Impossible de supprimer la livraison", "error");
        }
      }
    });
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  useEffect(() => {
    const filtered = deliveryData.filter(
      (item) =>
        item.client?.first_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.client?.last_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.place?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.client?.contact?.includes(searchTerm)
    );
    setFilteredData(filtered);
  }, [searchTerm, deliveryData]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const formatPrice = (price) => {
    const amount = Number(price);
    if (isNaN(amount)) return "0 Ar";

    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "MGA",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("MGA", "Ar"); // 👉 affichage plus naturel
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          Chargement des données...
        </div>
      </DashboardLayout>
    );
  }

  const handleValidateDelivery = async (delivery) => {
    Swal.fire({
      title: "Validation",
      text: `Confirmez-vous la livraison de "${delivery.product?.name}" et le versement de la commission ?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Oui, valider",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.post(
            `/api/delivery/validate/${delivery.delivery_id}`
          );

          Swal.fire({
            title: "Succès",
            text:
              response.data.message || "Livraison validée et commission versée",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });

          fetchDeliveries();
        } catch (error) {
          console.error("Erreur validation :", error);
          Swal.fire("Erreur", "Impossible de valider la livraison", "error");
        }
      }
    });
  };

  return (
    <DashboardLayout>
      <div style={formStyles.container}>
        {/* Header */}
        <div style={formStyles.header}>
          <h1 style={formStyles.title}>Gestion des Livraisons</h1>
        </div>

        {/* Barre de recherche */}
        <div style={formStyles.searchContainer}>
          <div style={formStyles.searchRow}>
            <div style={formStyles.searchInputContainer}>
              <Search size={20} style={formStyles.searchIcon} />
              <input
                type="text"
                placeholder="Rechercher par client, produit, lieu..."
                value={searchTerm}
                onChange={handleSearch}
                style={formStyles.searchInput}
              />
            </div>
            <button
              style={formStyles.filterButton}
              onMouseOver={(e) => (e.target.style.background = "#f3f4f6")}
              onMouseOut={(e) => (e.target.style.background = "#fff")}
            >
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Tableau */}
        <div style={formStyles.table}>
          <div style={formStyles.tableHeader}>
            <div style={formStyles.tableHeaderRow}>
              <div style={formStyles.tableHeaderCell}>ID</div>
              <div style={formStyles.tableHeaderCell}>Client</div>
              <div style={formStyles.tableHeaderCell}>Produit</div>
              <div style={formStyles.tableHeaderCell}>Lieu</div>
              <div style={formStyles.tableHeaderCell}>Date</div>
              <div style={formStyles.tableHeaderCell}>Quantité</div>
              <div style={formStyles.tableHeaderCell}>Total</div>
              <div style={formStyles.tableHeaderCell}>Actions</div>
            </div>
          </div>
          <div style={formStyles.tableBody}>
            {filteredData.map((delivery) => (
              <div
                key={delivery.delivery_id}
                style={formStyles.tableRow}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#f9fafb")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <div style={formStyles.tableCell}>
                  <span style={formStyles.idBadge}>
                    #{delivery.delivery_id}
                  </span>
                </div>
                <div style={formStyles.tableCell}>
                  <div style={formStyles.clientInfo}>
                    <div style={formStyles.clientName}>
                      {delivery.client
                        ? `${delivery.client.first_name} ${delivery.client.last_name}`
                        : "N/A"}
                    </div>
                    <div style={formStyles.clientContact}>
                      {delivery.client?.contact || "N/A"}
                    </div>
                  </div>
                </div>
                <div style={formStyles.tableCell}>
                  <div style={formStyles.productInfo}>
                    <div style={formStyles.productName}>
                      {delivery.product && delivery.product.name
                        ? delivery.product.name
                        : "Produit inconnu"}
                    </div>

                    <div style={formStyles.productPrice}>
                      {delivery.product && delivery.product.unit_price
                        ? formatPrice(Number(delivery.product.unit_price))
                        : "0 Ar"}
                    </div>
                  </div>
                </div>
                <div style={formStyles.tableCell}>
                  <div style={formStyles.placeInfo}>
                    <MapPin size={14} />
                    {delivery.place}
                  </div>
                </div>
                <div style={formStyles.tableCell}>
                  <div style={formStyles.dateInfo}>
                    <Calendar size={14} />
                    {formatDate(delivery.delivery_date)}
                  </div>
                </div>
                <div style={formStyles.tableCell}>
                  <span style={formStyles.quantityBadge}>
                    x{delivery.quantity}
                  </span>
                </div>
                <div style={formStyles.tableCell}>
                  <strong style={{ color: "#059669" }}>
                    {delivery.product?.unit_price
                      ? formatPrice(
                          Number(delivery.product.unit_price) *
                            Number(delivery.quantity)
                        )
                      : "0 Ar"}
                  </strong>
                </div>
                <div style={formStyles.tableCell}>
                  <div style={formStyles.actionButtons}>
                    {delivery.status === "validated" ? (
                      <button
                        style={{
                          ...formStyles.actionButton,
                          background: "#dcfce7", 
                          color: "#16a34a", 
                          cursor: "default",
                        }}
                        disabled
                      >
                        <BadgeCheck size={16} />
                      </button>
                    ) : (
                      <button
                        style={{
                          ...formStyles.actionButton,
                          ...formStyles.editButton,
                        }}
                        onClick={() => handleValidateDelivery(delivery)}
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}

                    <button
                      style={{
                        ...formStyles.actionButton,
                        ...formStyles.deleteButton,
                      }}
                      onClick={() => handleDeleteDelivery(delivery)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredData.length === 0 && (
              <div
                style={{
                  ...formStyles.tableRow,
                  gridTemplateColumns: "1fr",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    ...formStyles.tableCell,
                    textAlign: "center",
                    color: "#6b7280",
                  }}
                >
                  {searchTerm
                    ? `Aucun résultat trouvé pour "${searchTerm}"`
                    : "Aucune livraison trouvée"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Delivery;
