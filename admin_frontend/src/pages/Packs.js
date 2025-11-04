import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import styles from "./PacksStyle";
import Swal from "sweetalert2";
import { Edit, Trash2, Eye } from "lucide-react";
import api from "../services/api";

function Packs() {
  const [packs, setPacks] = useState([]);
  const [packName, setPackName] = useState("");
  const [minInvest, setMinInvest] = useState("");
  const [roi, setRoi] = useState("");
  const [objectiveQuantity, setObjectiveQuantity] = useState("");
  const [produits, setProduits] = useState([]);
  const [produitsId, setProduitsId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detailPack, setDetailPack] = useState(null);
  const [editingPack, setEditingPack] = useState(null);


  const handleOpenModal = (pack) => {
  const description = 
    produitsById[pack.product_id]?.description ||
    pack.product?.description ||
    "Pas de description disponible";

  Swal.fire({
    title: pack.pack_name || pack.name || "Pack",
    html: `<p style="text-align:left">${description}</p>`,
    icon: 'info',
    confirmButtonText: 'Fermer',
  });
};

  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  useEffect(() => {
    const pidParam = searchParams.get("productId");
    if (pidParam) {
      setProduitsId(String(pidParam));
      setIsFormOpen(true);
    }
  }, [searchParams]);

  const produitsById = useMemo(() => {
    const map = {};
    for (const p of produits) {
      const id = p.id ?? p.product_id ?? p.produit_id;
      if (id != null) map[id] = p;
    }
    return map;
  }, [produits]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchParams(value ? { search: value } : {});
  };


  useEffect(() => {
    fetchPacks();
    fetchProduits();
  }, []);

  // Fermer la fenêtre avec la touche Échap
  useEffect(() => {
    if (!isFormOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsFormOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFormOpen]);

  const fetchPacks = async () => {
    try {
      let res;
      const getPaths = ["api/packs"];
      for (const pth of getPaths) {
        try {
          res = await api.get(pth);
          break;
        } catch (e) {
          // try next
        }
      }
      const data = res?.data;
      const normalized = Array.isArray(data)
        ? data.map(p => ({
          ...p,
          product_id: p.product_id ?? p.product?.product_id ?? p.product?.id,
          pack_name: p.pack_name ?? p.name ?? "",
          product_name: p.product?.name ?? p.product_name ?? "Produit",
          product_image_url: p.product?.image_url ?? p.product_image_url ?? null,
        }))
        : [];
      setPacks(normalized);

    } catch (err) {
      console.error("GET packs failed:", err);
      const msg = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(`Erreur lors du chargement des packs${msg ? ` (${msg})` : ""}`);
    }
  };

  const generateNextPackName = () => {
    const year = new Date().getFullYear();
    // Trouver le plus grand numéro existant pour l'année en cours
    const existingNumbers = packs
      .map(p => {
        const name = p.pack_name || p.name || "";
        const match = name.match(new RegExp(`Pack ${year}-(\\d{3})`));
        return match ? parseInt(match[1], 10) : null;
      })
      .filter(n => n !== null);

    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    return `Pack ${year}-${String(nextNumber).padStart(3, "0")}`;
  };

  const fetchProduits = async () => {
    try {
      let res;
      const getPaths = ["api/products"];
      for (const pth of getPaths) {
        try {
          res = await api.get(pth);
          break;
        } catch (e) {
          // try next
        }
      }
      const arr = Array.isArray(res?.data) ? res.data : [];
      setProduits(arr);
    } catch (err) {
      console.error("GET produits failed:", err);
    }
  };

  const handleDeletePack = async (pack) => {
    try {
      const packId = pack.pack_id ?? pack.id;
      await api.delete(`/api/packs/${packId}`);
      setPacks((prev) => prev.filter((p) => (p.pack_id ?? p.id) !== packId));
    } catch (error) {
      console.error("Erreur suppression pack :", error);
      throw error;
    }
  };

  // ⚡ Confirmation SweetAlert
  const confirmDeletePack = (pack) => {
    Swal.fire({
      title: `Supprimer ${pack.pack_name || pack.name} ?`,
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeletePack(pack)
          .then(() => Swal.fire("Supprimé !", "Le pack a été supprimé.", "success"))
          .catch(() => Swal.fire("Erreur !", "Impossible de supprimer le pack.", "error"));
      }
    });
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const pid = parseInt(produitsId, 10);
      const minInv = parseFloat(minInvest);
      const roiVal = parseFloat(roi);
      const qty = parseInt(objectiveQuantity, 10);

      // Validation simple
      if (!packName.trim()) throw new Error("Le nom du pack est requis.");
      if (Number.isNaN(pid) || Number.isNaN(minInv) || Number.isNaN(qty) || Number.isNaN(roiVal)) {
        throw new Error("Données invalides: vérifiez le produit, l'investissement, le ROI et la quantité.");
      }
      if (minInv <= 0 || roiVal <= 0 || qty <= 0) {
        throw new Error("Les valeurs doivent être supérieures à 0.");
      }

      const isoDate = new Date().toISOString().slice(0, 10);

      const body = {
        product_id: pid,
        pack_name: packName.trim(),
        min_investment: minInv,
        order_start_date: isoDate,
        objective_quantity: qty,
        return_on_investment: roiVal,
      };

      // Détecter si on est en édition ou création
      const isEditing = !!editingPack;
      const route = isEditing ? `api/packs/${editingPack.pack_id ?? editingPack.id}` : "api/packs";

      if (isEditing) {
        await api.put(route, body, {
          headers: { "Content-Type": "application/json", Accept: "application/json" },
        });
        Swal.fire({
          icon: 'success',
          title: 'Modifié !',
          text: 'Le pack a été modifié avec succès ✅',
          timer: 2500,
          showConfirmButton: false
        });
      } else {
        await api.post(route, body, {
          headers: { "Content-Type": "application/json", Accept: "application/json" },
        });
        Swal.fire({
          icon: 'success',
          title: 'Ajouté !',
          text: 'Le pack a été ajouté avec succès 🎯',
          timer: 2500,
          showConfirmButton: false
        });
      }

      // Réinitialisation du formulaire
      setPackName("");
      setObjectiveQuantity("");
      setMinInvest("");
      setRoi("");
      setProduitsId("");
      setEditingPack(null);
      fetchPacks();
      setTimeout(() => setIsFormOpen(false), 600);

    } catch (err) {
      console.error("Erreur handleSubmit:", err);
      setMessage("");
      Swal.fire({
        icon: 'error',
        title: 'Erreur !',
        text: err.message || "Erreur lors de l'ajout/modification du pack ❌",
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  const resolvePackProductId = (pack) => pack.product_id;

  const resolveProduct = (pack) => {
    const pid = resolvePackProductId(pack);
    return pack.product || produitsById[pid];
  };

  const resolveProductName = (pack) => {
    const prod = resolveProduct(pack);
    return (
      pack.product_name ||
      prod?.name || prod?.nom ||
      'Produit'
    );
  };


  const packFormStyles = {
    form: {
      background: "#fff",
      borderRadius: "1rem",
      padding: "2rem",
      maxWidth: "600px",
      margin: "0 auto 2rem",
      boxShadow: "0 12px 30px rgba(0, 0, 0, 0.05)",
      border: "1px solid #e2e8f0",
    },
    input: {
      padding: "0.75rem 1rem",
      fontSize: "1rem",
      border: "1px solid #d1d5db",
      borderRadius: "0.75rem",
      marginBottom: "1.25rem",
      width: "100%",
      outline: "none",
      transition: "border 0.2s ease-in-out",
      boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
    },
    label: {
      display: "block",
      fontWeight: 600,
      color: "#111827",
      marginBottom: "8px",
    },
    row: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
    },
    button: {
      padding: "0.75rem 1.5rem",
      background: "linear-gradient(to right, #6366f1, #0ea5e9)",
      color: "#ffffff",
      fontWeight: "700",
      fontSize: "1rem",
      borderRadius: "0.75rem",
      border: "none",
      cursor: "pointer",
      transition: "opacity 0.2s ease-in-out",
      display: "block",
      width: "100%",
    },
  };

  const thStyle = {
    padding: "12px 16px",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "0.95rem",
    color: "#374151",
    borderBottom: "2px solid #e5e7eb",
  };

  const tdStyle = {
    padding: "12px 16px",
    fontSize: "0.9rem",
    color: "#374151",
    textAlign: "left",
  };

  const actionBtnStyle = {
    padding: "6px 12px",
    marginRight: "6px",
    background: "#10b981",
    color: "#fff",
    fontWeight: "600",
    fontSize: "0.85rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    transition: "background 0.2s ease-in-out",
  };

  const packModalStyles = {
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(15,23,42,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
      zIndex: 50,
    },
    modal: {
      background: "#fff",
      borderRadius: "16px",
      width: "100%",
      maxWidth: "680px",
      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
      border: "1px solid #e2e8f0",
      overflow: "hidden",
    },
    modalHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 20px",
      borderBottom: "1px solid #e5e7eb",
    },
    modalTitle: {
      margin: 0,
      fontSize: "1.25rem",
      fontWeight: 700,
      color: "#111827",
    },
    closeBtn: {
      background: "transparent",
      border: "none",
      fontSize: "1.25rem",
      cursor: "pointer",
      color: "#6b7280",
    },
    modalBody: {
      padding: "20px",
    },
    openerWrap: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "8px",
      marginBottom: "16px",
    },
    openerBtn: {
      padding: "10px 14px", background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
      color: "#fff",
      fontWeight: 700,
      fontSize: "0.95rem",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
    },
  };

  return (
    <DashboardLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Packs d'investissement</h1>
          <p style={styles.subtitle}>Gérez vos opportunités d'investissement</p>
        </div>

        {message && (
          <div style={styles.alertSuccess}>
            <div style={styles.alertContent}>
              <div style={{ ...styles.alertDot, ...styles.alertDotSuccess }}></div>
              <p style={{ color: "#065f46", fontWeight: "500", margin: 0 }}>{message}</p>
            </div>
          </div>
        )}

        {error && (
          <div style={styles.alertError}>
            <div style={styles.alertContent}>
              <div style={{ ...styles.alertDot, ...styles.alertDotError }}></div>
              <p style={{ color: "#991b1b", fontWeight: "500", margin: 0 }}>{error}</p>
            </div>
          </div>
        )}

        <div style={packModalStyles.openerWrap}>
          <button
            style={packModalStyles.openerBtn}
            onClick={() => {
              setEditingPack(null); // ✅ Tsy mode édition intsony
              setPackName(generateNextPackName()); // ✅ Génère nom automatique vaovao
              setMinInvest("");     // ✅ Reset valeurs
              setRoi("");
              setObjectiveQuantity("");
              setProduitsId("");
              setIsFormOpen(true);
            }}
          >
            + Nouveau pack
          </button>
        </div>

        {isFormOpen && (
          <div
            style={packModalStyles.overlay}
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsFormOpen(false);
            }}
          >
            <div style={packModalStyles.modal}>
              <div style={packModalStyles.modalHeader}>
                <h3 style={packModalStyles.modalTitle}>Créer un pack</h3>
                <button
                  type="button"
                  aria-label="Fermer"
                  style={packModalStyles.closeBtn}
                  onClick={() => setIsFormOpen(false)}
                >
                  ×
                </button>
              </div>
              <div style={packModalStyles.modalBody}>
                <form onSubmit={handleSubmit} style={{ ...packFormStyles.form, margin: 0, maxWidth: "unset", boxShadow: "none", border: "none", padding: 0 }}>

                  <div>
                    <div>
                      <label style={packFormStyles.label}>Investissement minimum (Ar)</label>
                      <input
                        type="number"
                        placeholder="Ex: 10000"
                        value={minInvest}
                        onChange={(e) => setMinInvest(e.target.value)}
                        style={packFormStyles.input}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <div>
                      <label style={packFormStyles.label}>ROI (%)</label>
                      <input
                        type="number"
                        placeholder="Ex: 10"
                        value={roi}
                        onChange={(e) => setRoi(e.target.value)}
                        style={packFormStyles.input}
                      />
                    </div>
                  </div>
                  <div>
                    <div>
                      <label style={packFormStyles.label}>Disponible</label>
                      <input
                        type="number"
                        placeholder="Ex: 100"
                        value={objectiveQuantity}
                        onChange={e => setObjectiveQuantity(e.target.value)}
                        style={packFormStyles.input}
                        required
                      />
                    </div>
                  </div>

                  <label style={packFormStyles.label}>Produit associé</label>
                  <select
                    value={produitsId}
                    onChange={(e) => setProduitsId(e.target.value)}
                    style={packFormStyles.input}
                    required
                  >
                    <option value="">-- Choisir un produit --</option>
                    {produits.map((p, idx) => (
                      <option
                        key={`${p.id ?? p.product_id ?? 'prod'}-${idx}`}
                        value={String(p.id ?? p.product_id)}
                      >
                        {p.name ?? p.nom ?? `Produit ${p.id ?? p.product_id}`}
                      </option>
                    ))}
                  </select>


                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{ ...packFormStyles.button, opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
                  >
                    {isSubmitting ? "Ajout en cours..." : "Ajouter"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {detailPack && (
          <div
            style={packModalStyles.overlay}
            onClick={(e) => {
              if (e.target === e.currentTarget) setDetailPack(null);
            }}
          >
            <div style={packModalStyles.modal}>
              <div style={packModalStyles.modalHeader}>
                <h3 style={packModalStyles.modalTitle}>Description du produit</h3>
                <button
                  type="button"
                  aria-label="Fermer"
                  style={packModalStyles.closeBtn}
                  onClick={() => setDetailPack(null)}
                >
                  ×
                </button>
              </div>
              <div style={packModalStyles.modalBody}>
                <div style={{ fontSize: "1rem", color: "#374151" }}>
                  {
                    produitsById[detailPack.product_id]?.description
                    || detailPack.product?.description
                    || "Pas de description disponible"
                  }
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setDetailPack(null)}
                  style={{
                    padding: '10px 16px', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}


        <div style={{ marginTop: "16px", marginBottom: "24px" }}>
          <input
            type="text"
            placeholder=" Rechercher un pack par nom ou produit..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              width: "40%",
              padding: "12px 16px",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              outline: "none",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          />
        </div>

        <div style={{ marginTop: "24px" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}>
            <thead style={{ background: "#f3f4f6" }}>
              <tr>
                <th style={thStyle}>Nom du pack</th>
                <th style={thStyle}>Produit</th>
                <th style={thStyle}>Min Invest (Ar)</th>
                <th style={thStyle}>ROI (%)</th>
                <th style={thStyle}>Disponible</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
  {packs
    .filter((pack) => {
      const term = searchTerm.toLowerCase();

      // On regarde tous les champs pertinents
      return (
        (pack.pack_name?.toLowerCase().includes(term)) ||
        (pack.name?.toLowerCase().includes(term)) ||
        (pack.product_name?.toLowerCase().includes(term)) ||
        (pack.product?.name?.toLowerCase().includes(term)) ||
        (String(pack.min_investment).toLowerCase().includes(term)) ||
        (String(pack.return_on_investment).toLowerCase().includes(term)) ||
        (String(pack.objective_quantity).toLowerCase().includes(term)) ||
        (pack.product?.description?.toLowerCase().includes(term))  // si tu veux chercher dans la description
      );
    })
    .map((pack) => (
      <tr key={pack.pack_id ?? pack.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
        <td style={tdStyle}>{pack.pack_name || pack.name}</td>
        <td style={tdStyle}>{resolveProductName(pack)}</td>
        <td style={tdStyle}>{pack.min_investment}</td>
        <td style={tdStyle}>{pack.return_on_investment}</td>
        <td style={tdStyle}>{pack.objective_quantity}</td>
        <td style={{
          ...tdStyle,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "6px"
        }}>
          <button
            style={{ ...actionBtnStyle, background: "#6b7280", display: "flex", alignItems: "center", gap: "6px" }}
            onClick={() => handleOpenModal(pack)}
          >
            <Eye size={16} />
          </button>

          <button
            style={{ ...actionBtnStyle, background: "#3b82f6", display: "flex", alignItems: "center", gap: "6px" }}
            onClick={() => {
              setIsFormOpen(true);
              setEditingPack(pack);
              setPackName(pack.pack_name || pack.name || "");
              setMinInvest(pack.min_investment || "");
              setRoi(pack.return_on_investment || "");
              setObjectiveQuantity(pack.objective_quantity || "");
              setProduitsId(resolvePackProductId(pack) || "");
            }}
          >
            <Edit size={16} />
          </button>

          <button
            style={{ ...actionBtnStyle, background: "#dc2626", display: "flex", alignItems: "center", gap: "6px" }}
            onClick={() => confirmDeletePack(pack)}
          >
            <Trash2 size={16} />
          </button>
        </td>
      </tr>
    ))}
</tbody>

          </table>
        </div>


        {packs.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📦</div>
            <h3 style={styles.emptyTitle}>Aucun pack disponible</h3>
            <p style={styles.emptyDescription}>Créez votre premier pack d'investissement ci-dessus</p>
          </div>
        )}
      </div>
    </DashboardLayout >
  );
}

export default Packs;