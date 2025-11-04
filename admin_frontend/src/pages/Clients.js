import React, { useState, useEffect } from "react";
import {
  Search,
  Trash2,
  Plus,
  Filter,
  User,
  UserPlus,
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
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
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
  toggleViewButton: {
    padding: "0.75rem",
    background: "#fff",
    color: "#6b7280",
    border: "1px solid #d1d5db",
    borderRadius: "0.75rem",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  activeToggle: {
    background: "linear-gradient(to right, #10b981, #0ea5e9)",
    color: "#fff",
    border: "1px solid transparent",
  },
  // Styles pour le tableau
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
    gridTemplateColumns: "80px 120px 1fr 1fr 2fr 150px 120px",
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
    gridTemplateColumns: "80px 120px 1fr 1fr 2fr 150px 120px",
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
  avatarContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #10b981, #0ea5e9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: "0.875rem",
    flexShrink: 0,
  },
  nameInfo: {
    display: "flex",
    flexDirection: "column",
  },
  fullName: {
    fontWeight: "600",
    color: "#111827",
  },
  firstName: {
    fontSize: "0.75rem",
    color: "#6b7280",
  },
  contactBadge: {
    background: "#f0fdf4",
    color: "#15803d",
    padding: "0.25rem 0.75rem",
    borderRadius: "1rem",
    fontSize: "0.75rem",
    fontWeight: "600",
    textAlign: "center",
    border: "1px solid #bbf7d0",
  },
  addressText: {
    color: "#6b7280",
    lineHeight: "1.4",
    fontSize: "0.875rem",
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
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  statIcon: {
    padding: "1rem",
    borderRadius: "0.75rem",
    background: "linear-gradient(to right, #10b981, #0ea5e9)",
    color: "#fff",
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#111827",
    lineHeight: "1",
  },
  statLabel: {
    color: "#6b7280",
    fontSize: "0.875rem",
    marginTop: "0.25rem",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "4rem 2rem",
    background: "#fff",
    borderRadius: "1rem",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
    textAlign: "center",
  },
  emptyIcon: {
    padding: "1.5rem",
    borderRadius: "50%",
    background: "#f3f4f6",
    color: "#6b7280",
    marginBottom: "1rem",
  },
  emptyTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "0.5rem",
  },
  emptyText: {
    color: "#6b7280",
    marginBottom: "2rem",
  },
}

function Clients() {
  const [clientsData, setClientsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/clients/list");
      // Axios ne nécessite pas response.json()
      if (response.data.status) {
        setClientsData(response.data.clients);
        setFilteredData(response.data.clients); // important pour le filtrage
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des clients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const filtered = clientsData.filter(
      (client) =>
        client.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.adresse?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contact?.includes(searchTerm)
    );
    setFilteredData(filtered);
  }, [searchTerm, clientsData]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };



  const handleDelete = async (id) => {
    const client = clientsData.find((c) => c.client_id === id);
  
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: `Voulez-vous vraiment supprimer le client "${client.first_name} ${client.last_name}" ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e63946",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Appel API pour supprimer le client
          await api.delete(`/api/clients/${id}`);
  
          // Mise à jour locale
          setClientsData(prev => prev.filter(c => c.client_id !== id));
          setFilteredData(prev => prev.filter(c => c.client_id !== id));
  
          Swal.fire({
            title: "Supprimé !",
            text: "Le client a été supprimé avec succès.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
          });
        } catch (error) {
          console.error("Erreur suppression :", error);
          Swal.fire("Erreur", "Impossible de supprimer le client.", "error");
        }
      }
    });
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
  
    phone = phone.replace(/\D/g, '');
  
    // if (!/^0(32|33|34|30|20)/.test(phone)) {
    //   return 'Numéro invalide';
    // }
  
    return phone?.replace(/(\d{3})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5");
  };


  if (loading) {
    return (
      <div
        style={{
          ...formStyles.container,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>Chargement des clients...</div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div style={formStyles.container}>
        {/* Header */}
        <div style={formStyles.header}>
          <h1 style={formStyles.title}>
            <UserPlus size={32} />
            Gestion des Clients
          </h1>
        </div>


        {/* Barre de recherche */}
        <div style={formStyles.searchContainer}>
          <div style={formStyles.searchRow}>
            <div style={formStyles.searchInputContainer}>
              <Search size={20} style={formStyles.searchIcon} />
              <input
                type="text"
                placeholder="Rechercher par nom, prénom, adresse ou contact..."
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

        {/* Affichage des clients */}
        {filteredData.length === 0 ? (
        <div style={formStyles.emptyState}>
          <div style={formStyles.emptyIcon}>
            <User size={48} />
          </div>
          <h3 style={formStyles.emptyTitle}>
            {searchTerm ? 'Aucun résultat trouvé' : 'Aucun client'}
          </h3>
          <p style={formStyles.emptyText}>
            {searchTerm 
              ? `Aucun client trouvé pour "${searchTerm}"`
              : 'Commencez par ajouter votre premier client'
            }
          </p>
          {!searchTerm && (
            <button style={formStyles.button}>
              <Plus size={20} />
              Ajouter un Client
            </button>
          )}
        </div>
      ) : (
        <div style={formStyles.table}>
          <div style={formStyles.tableHeader}>
            <div style={formStyles.tableHeaderRow}>
              <div style={formStyles.tableHeaderCell}>ID</div>
              {/* <div style={formStyles.tableHeaderCell}>Avatar</div> */}
              <div style={formStyles.tableHeaderCell}>Prénom</div>
              <div style={formStyles.tableHeaderCell}>Nom</div>
              <div style={formStyles.tableHeaderCell}>Adresse</div>
              <div style={formStyles.tableHeaderCell}>Contact</div>
              <div style={formStyles.tableHeaderCell}>Actions</div>
            </div>
          </div>
          <div style={formStyles.tableBody}>
            {filteredData.map((client) => (
              <div
                key={client.client_id}
                style={formStyles.tableRow}
                onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={formStyles.tableCell}>
                  <span style={formStyles.idBadge}>#{client.client_id}</span>
                </div>
                {/* <div style={formStyles.tableCell}>
                  <div style={formStyles.avatar}>
                    {getClientInitials(client.first_name, client.last_name)}
                  </div>
                </div> */}
                <div style={formStyles.tableCell}>
                  <span style={formStyles.fullName}>{client.first_name || 'N/A'}</span>
                </div>
                <div style={formStyles.tableCell}>
                  <span style={formStyles.fullName}>{client.last_name || 'N/A'}</span>
                </div>
                <div style={formStyles.tableCell}>
                  <div style={formStyles.addressText}>
                    {client.adresse || 'Adresse non renseignée'}
                  </div>
                </div>
                <div style={formStyles.tableCell}>
                  <span style={formStyles.contactBadge}>
                    {formatPhoneNumber(client.contact) || 'Non renseigné'}
                  </span>
                </div>
                <div style={formStyles.actionButtons}>
                  
                  <button
                    style={{...formStyles.actionButton, ...formStyles.deleteButton}}
                    onClick={() => handleDelete(client.client_id)}
                    onMouseOver={(e) => e.target.style.opacity = '0.8'}
                    onMouseOut={(e) => e.target.style.opacity = '1'}
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
}

export default Clients;
