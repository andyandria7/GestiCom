import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Filter, CreditCard, Eye, Check, X, Download, Upload } from "lucide-react";
import { BASE_URL } from "../services/api";
import Swal from "sweetalert2";

function Transactions() {
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("deposits");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/api/admins/showDeposits`).then((res) => res.json()),
      fetch(`${BASE_URL}/api/admins/showWithdrawals`).then((res) => res.json()),
      fetch(`${BASE_URL}/api/admins/showPayments`).then((res) => res.json()),
    ])
    
    .then(([depositsData, withdrawalsData, paymentsData]) => {
        setDeposits(depositsData);
        setWithdrawals(withdrawalsData);
        setPayments(paymentsData);
      })
      .catch(() => setError("Erreur lors du chargement des transactions"))
      .finally(() => setIsLoading(false));
  }, []);

  const isProcessed = (status) => status === "validé" || status === "rejeté";

  const handleValidate = async (transaction, type) => {
    const result = await Swal.fire({
      title: "Confirmer la validation",
      text: `Valider la transaction de ${transaction.amount} Ar effectuée par ${transaction.first_name} ${transaction.last_name} ?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Oui, valider",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#22c55e",
    });
    if (!result.isConfirmed) return;

    try {
      let url = "";
      if (type === "deposit")
        url = `${BASE_URL}/api/admins/validateDeposit/${transaction.deposit_id}`;
      else if (type === "withdrawal")
        url = `${BASE_URL}/api/admins/validateWithdrawal/${transaction.withdrawal_id}`;
      else
        url = `${BASE_URL}/api/admins/validatePayment/${transaction.payment_id}`;

      await fetch(url, { method: "POST" });
      Swal.fire("Validé !", "La transaction a été validée.", "success");
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      Swal.fire("Erreur", "Une erreur est survenue.", "error");
    }
  };


  const handleReject = async (transaction, type) => {
    const result = await Swal.fire({
      title: "Confirmer le rejet",
      text: `Rejeter la transaction de ${ transaction.amount } Ar effectuée par ${ transaction.first_name } ${ transaction.last_name } ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, rejeter",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#ef4444",
    });
  if (!result.isConfirmed) return;

  try {
    let url = "";
    if (type === "deposit")
      url = `${ BASE_URL }/api/admins/rejectDeposit/${ transaction.deposit_id }`;
      else if (type === "withdrawal")
      url = `${ BASE_URL }/api/ admins / rejectWithdrawal/${ transaction.withdrawal_id }`;
      else url = `${ BASE_URL }/api/admins/rejectPayment/${ transaction.payment_id }`;

    await fetch(url, { method: "POST" });
    Swal.fire("Rejeté !", "La transaction a été rejetée.", "success");
    setTimeout(() => window.location.reload(), 1000);
  } catch {
    Swal.fire("Erreur", "Une erreur est survenue.", "error");
  }
};

const filterTransactions = (transactions) => {
  let filtered = [...transactions];

  if (filterStatus === "validé")
    filtered = filtered.filter((t) => t.status === "validé");
  else if (filterStatus === "rejeté")
    filtered = filtered.filter((t) => t.status === "rejeté");
  else if (filterStatus === "en attente")
    filtered = filtered.filter((t) => t.status === "en attente");

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        `${ t.first_name } ${ t.last_name }`.toLowerCase().includes(term) ||
    (t.transaction_reference || "").toLowerCase().includes(term)
    );
  }
  return filtered;
};

const renderTransactions = (transactions, type) => {
  const filtered = filterTransactions(transactions);
  if (filtered.length === 0) {
    return (
      <p style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>
        Aucune transaction à afficher.
      </p>
    );
  }

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      {paginated.map((t) => (
        <div
          key={t.deposit_id || t.withdrawal_id || t.payment_id}
          style={styles.transactionRow}
        >
          <div style={styles.transactionLeft}>
            <div style={{ ...styles.iconWrapper, background: type === 'deposit' ? "#33ad0e85" : type === 'withdrawal' ? "#e01c1c85" : "#158EFA85" }}>
              {
                type === 'payment' && <CreditCard size={16} color="#158EFA" /> ||
                type === 'withdrawal' && <Upload size={16} color="#e01c1cff" /> ||
                type === 'deposit' && <Download size={16} color="#1d7403ff" />
              }
            </div>
            <div style={styles.info}>
              <p style={styles.name}>{t.first_name + " " + t.last_name}</p>
              <p style={styles.meta}>
                {t.payment_method || "-"} • {t.reference || "Réf. inconnue"}
              </p>
            </div>
          </div>
          <div style={styles.transactionRight}>
            <div>
              <p style={styles.amount}>{t.amount} Ar</p>
              <p style={styles.date}>
                {new Date(t.created_at).toLocaleDateString('fr-FR')} à {new Date(t.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <span
              style={{
                ...styles.badge,
                backgroundColor:
                  t.status === "validé"
                    ? "#179059"
                    : t.status === "rejeté"
                      ? "#e23535ff"
                      : "#f78d4bff",
              }}
            >
              {t.status}
            </span>
            <div style={styles.actions}>
              <button
                style={styles.button}
                onClick={() => {
                  setSelectedTransaction(t);
                  setModalType("view");
                }}
              >
                <Eye size={16} />
              </button>

              {!isProcessed(t.status) && (
                <>
                  <button
                    style={{ ...styles.button, ...styles.buttonPrimary }}
                    onClick={() => handleValidate(t, type)}
                  >
                    <Check size={16} />
                  </button>
                  <button
                    style={{ ...styles.button, ...styles.buttonDanger }}
                    onClick={() => handleReject(t, type)}
                  >
                    <X size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "16px",
            gap: "8px",
          }}
        >
          <button
            style={styles.button}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          <span style={{ alignSelf: "center" }}>
            Page {currentPage} / {totalPages}
          </span>
          <button
            style={styles.button}
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      )}
    </>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)",
    padding: "24px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "32px",
  },
  headerTitle: { fontSize: "1.875rem", fontWeight: "bold" },
  headerSubtitle: { color: "#6b7280" },
  button: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    background: "#fff",
    cursor: "pointer",
  },
  buttonPrimary: {
    background: "#22c55e",
    color: "#fff",
    border: "none",
  },
  buttonDanger: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
  },
  searchBar: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  tabs: { display: "flex", borderBottom: "1px solid #e5e7eb", marginBottom: "16px" },
  tab: { padding: "8px 16px", cursor: "pointer", color: "#6b7280" },
  tabActive: {
    borderBottom: "2px solid #ec4899",
    color: "#000",
    fontWeight: "500",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "16px",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
  },
  transactionRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    marginBottom: "12px",
  },
  transactionLeft: { display: "flex", alignItems: "center", gap: "16px" },
  iconWrapper: {
    padding: "8px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontWeight: "500" },
  meta: { fontSize: "0.875rem", color: "#6b7280" },
  transactionRight: { display: "flex", alignItems: "center", gap: "16px" },
  amount: { fontWeight: "500", textAlign: "right" },
  date: { fontSize: "0.875rem", color: "#6b7280", textAlign: "right" },
  badge: {
    padding: "8px",
    borderRadius: "6px",
    fontSize: "0.75rem",
    color: "#ffffff",
  },
  actions: { display: "flex", gap: "8px" },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    maxWidth: "400px",
    width: "100%",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  modalTitle: { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "16px" },
  modalButtons: { display: "flex", justifyContent: "flex-end", gap: "8px" },
};

if (isLoading)
  return (
    <DashboardLayout>
      <div style={{ padding: "64px" }}>Chargement...</div>
    </DashboardLayout>
  );

if (error)
  return (
    <DashboardLayout>
      <div style={{ color: "red" }}>{error}</div>
    </DashboardLayout>
  );

return (
  <DashboardLayout>
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>Gestion des Paiements</h1>
          <p style={styles.headerSubtitle}>
            Validez les dépôts, retraits et paiements
          </p>
        </div>
      </div>

      <div style={styles.searchBar}>
        <div style={{ flex: 1 }}>
          <input
            placeholder="Rechercher par nom, prénom ou référence..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "8px", borderRadius: "8px", width: "100%", border: "1px solid #e5e7eb" }}
          />
        </div>
      </div>

      <div style={styles.tabs}>
        <div
          style={{ ...styles.tab, ...(activeTab === "deposits" ? styles.tabActive : {}) }}
          onClick={() => { setActiveTab("deposits"); setCurrentPage(1); }}
        >
          Dépôts
        </div>
        <div
          style={{ ...styles.tab, ...(activeTab === "withdrawals" ? styles.tabActive : {}) }}
          onClick={() => { setActiveTab("withdrawals"); setCurrentPage(1); }}
        >
          Retraits
        </div>
        <div
          style={{ ...styles.tab, ...(activeTab === "payments" ? styles.tabActive : {}) }}
          onClick={() => { setActiveTab("payments"); setCurrentPage(1); }}
        >
          Paiements
        </div>
      </div>

      <div style={styles.card}>
        {activeTab === "deposits" && renderTransactions(deposits, "deposit")}
        {activeTab === "withdrawals" && renderTransactions(withdrawals, "withdrawal")}
        {activeTab === "payments" && renderTransactions(payments, "payment")}
      </div>

      {selectedTransaction && modalType === "view" && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Détails de la transaction</h2>
            <p><b>Nom:</b> {selectedTransaction.first_name} {selectedTransaction.last_name}</p>
            <p><b>Méthode:</b> {selectedTransaction.payment_method || "-"}</p>
            <p><b>Montant:</b> {selectedTransaction.amount} Ar</p>
            <p><b>Date:</b> {selectedTransaction.created_at}</p>
            <p><b>Référence:</b> {selectedTransaction.reference || "N/A"}</p>
            {selectedTransaction.proof_image && (
              <img
                src={`${BASE_URL}uploads/proofs/${selectedTransaction.proof_image}`}
                alt="Justificatif"
                style={{ width: "100%", marginTop: "12px", borderRadius: "8px" }}
              />
            )}
            <div style={styles.modalButtons}>
              <button style={styles.button} onClick={() => setModalType(null)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  </DashboardLayout>
);
}

export default Transactions;