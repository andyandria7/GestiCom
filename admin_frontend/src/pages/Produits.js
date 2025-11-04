import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import Swal from "sweetalert2";
import { Edit, Trash2 } from "lucide-react";
import styles from "./ProduitsStyle";
import api from "../services/api";

function Produits() {
  const [produits, setProduits] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");
  const [quantite, setQuantite] = useState("");
  const [image, setImage] = useState(null);
  const [reference, setReference] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [commissionRate, setCommissionRate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;


  // Recherche synchronisée avec l'URL
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchParams(value ? { search: value } : {});
  };

  // Après (version corrigée)
  const fetchProduits = async () => {
    try {
      let res;
      const getPaths = ["api/products"];
      let got = null;
      for (const pth of getPaths) {
        try {
          res = await api.get(pth);
          got = res;
          break;
        } catch (e) {
          // continue
        }
      }
      if (!got)
        throw new Error(
          "Aucune route GET de produits valide trouvée (produits/products)"
        );

      console.log("Réponse API produits:", got.data);

      let arr = [];
      if (Array.isArray(got.data)) {
        arr = got.data;
      } else if (Array.isArray(got.data.data)) {
        arr = got.data.data;
      }

      setProduits(arr);
      setError("");
      console.log("✅ Produits chargés:", arr.length);
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;
      setError(
        `Erreur lors du chargement des produits${msg ? ` (${msg})` : ""}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduits();
  }, []);

  // Fermer la modal avec la touche Échap
  useEffect(() => {
    if (!isFormOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsFormOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFormOpen]);

  // Gestion de l'image et aperçu
  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  };

  // Nettoyer l'URL de prévisualisation pour éviter les fuites mémoire
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Gestion du formulaire d'ajout de produit
 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  const formData = new FormData();
  formData.append("name", nom);
  formData.append("description", description);
  formData.append("unit_price", Number(prix));
  formData.append("available_quantity", Number(quantite));
  formData.append("reference", reference);
  formData.append("commission_rate", Number(commissionRate));
  if (image) formData.append("image", image);

  try {
    if (editingId) {
      // 🔄 Mode édition : POST vers /update
      await api.post(`/api/products/${editingId}`, formData);
      Swal.fire({
        icon: 'success',
        title: 'Produit mis à jour',
        text: 'Le produit a été mis à jour avec succès 🎯',
      });
    } else {
      // ➕ Mode création : POST
      await api.post("/api/products", formData);
      Swal.fire({
        icon: 'success',
        title: 'Produit créé',
        text: 'Le produit a été créé avec succès 🎯',
      });
    }

    // Réinitialiser le formulaire
    setNom("");
    setDescription("");
    setPrix("");
    setQuantite("");
    setReference("");
    setImage(null);
    setPreviewUrl(null);
    setEditingId(null);

    // Recharger la liste
    setIsLoading(true);
    await fetchProduits();
    setTimeout(() => setIsFormOpen(false), 800);

  } catch (error) {
    console.error(error);
    const serverMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message;
    Swal.fire({
      icon: 'error',
      title: `Erreur lors de ${editingId ? "la mise à jour" : "la création"}`,
      text: serverMsg || "Une erreur est survenue ❌",
    });
  } finally {
    setIsSubmitting(false);
  }
};

  // Fonction pour modifier un produit
  const handleEdit = (produit) => {
    setEditingId(produit.product_id); // ⚡ identifiant pour PUT
    setNom(produit.name || "");
    setReference(produit.ref || produit.reference || "");
    setPrix(produit.unit_price || "");
    setQuantite(produit.available_quantity || "");
    setDescription(produit.description || "");
    setPreviewUrl(
      produit.image_url ? `http://localhost:8080/${produit.image_url}` : null
    );
    setIsFormOpen(true);
  };

  // Fonction pour supprimer un produit
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Es-tu sûr ?",
      text: "Tu ne pourras pas revenir en arrière !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/products/${id}`);

          // ⚡ Mise à jour immédiate du state
          setProduits((prevProduits) =>
            prevProduits.filter((produit) => produit.product_id !== id)
          );

          Swal.fire("Supprimé !", "Le produit a été supprimé.", "success");
        } catch (error) {
          console.error("Erreur suppression :", error);
          Swal.fire("Erreur !", "Impossible de supprimer ce produit.", "error");
        }
      }
    });
  };

  const formStyles = {
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
    textarea: {
      padding: "0.75rem 1rem",
      fontSize: "1rem",
      border: "1px solid #d1d5db",
      borderRadius: "0.75rem",
      marginBottom: "1.25rem",
      width: "100%",
      minHeight: "120px",
      resize: "vertical",
      outline: "none",
      transition: "border 0.2s ease-in-out",
      boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
    },
    button: {
      padding: "0.75rem 1.5rem",
      background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
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
    message: {
      textAlign: "center",
      fontWeight: "600",
      color: isSuccess ? "#16a34a" : "#dc2626",
      marginBottom: "1.5rem",
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
    helper: {
      fontSize: "0.875rem",
      color: "#6b7280",
      marginTop: "-4px",
      marginBottom: "12px",
    },
    previewContainer: {
      marginTop: "12px",
      marginBottom: "12px",
      border: "1px dashed #d1d5db",
      borderRadius: "12px",
      padding: "12px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      background: "#f9fafb",
    },
    previewImage: {
      width: "72px",
      height: "72px",
      objectFit: "cover",
      borderRadius: "10px",
      border: "1px solid #e5e7eb",
    },
    removeImageBtn: {
      marginLeft: "auto",
      background: "transparent",
      border: "none",
      color: "#ef4444",
      cursor: "pointer",
      fontWeight: 600,
    },
  };

  const modalStyles = {
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
      padding: "10px 14px",
      background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
      color: "#fff",
      fontWeight: 700,
      fontSize: "0.95rem",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
    },
  };

  const totalProduits = produits.length;

  const totalValue = produits.reduce((sum, p) => {
    const prix = p.unit_price || 0;
    const quantite = p.available_quantity || 0;
    return sum + prix * quantite;
  }, 0);
  // Filtrer les produits selon la recherche
  // Filtrer les produits selon la recherche (tous les champs)
  const filteredProduits = produits.filter((produit) => {
    const term = searchTerm.toLowerCase();

    return (
      produit.name?.toLowerCase().includes(term) ||
      produit.description?.toLowerCase().includes(term) ||
      produit.reference?.toLowerCase().includes(term) ||
      produit.ref?.toLowerCase().includes(term) ||
      String(produit.unit_price)?.toLowerCase().includes(term) ||
      String(produit.available_quantity)?.toLowerCase().includes(term) ||
      String(produit.commission_rate)?.toLowerCase().includes(term)
    );
  });


  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProduits = filteredProduits.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredProduits.length / itemsPerPage);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div style={styles.container}>
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Produits</h1>
          <p style={styles.subtitle}>
            Catalogue de tous vos produits d'investissement
          </p>
        </div>

        {/* ➕ Bouton d'ouverture du formulaire */}
        <div style={modalStyles.openerWrap}>
          <button
            style={modalStyles.openerBtn}
            onClick={() => setIsFormOpen(true)}
          >
            + Nouveau produit
          </button>
        </div>

        {/* 🪟 Modal du formulaire d'ajout de produit */}
        {isFormOpen && (
          <div
            style={modalStyles.overlay}
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsFormOpen(false);
            }}
          >
            <div style={modalStyles.modal}>
              <div style={modalStyles.modalHeader}>
                <h3 style={modalStyles.modalTitle}>Ajouter un produit</h3>
                <button
                  type="button"
                  aria-label="Fermer"
                  style={modalStyles.closeBtn}
                  onClick={() => setIsFormOpen(false)}
                >
                  ×
                </button>
              </div>
              <div style={modalStyles.modalBody}>
                <form
                  onSubmit={handleSubmit}
                  style={{
                    ...formStyles.form,
                    margin: 0,
                    maxWidth: "unset",
                    boxShadow: "none",
                    border: "none",
                    padding: 0,
                  }}
                  encType="multipart/form-data"
                >
                  {message && <div style={formStyles.message}>{message}</div>}
                  {/* Ligne Nom + Référence côte à côte */}
                  <div style={formStyles.row}>
                    <div>
                      <label style={formStyles.label}>Nom du produit</label>
                      <input
                        type="text"
                        placeholder="Ex: Montre"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        style={formStyles.input}
                        required
                      />
                    </div>
                    <div>
                      <label style={formStyles.label}>
                        Référence du produit
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: R12345"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        style={formStyles.input}
                        required
                      />
                    </div>
                  </div>

                  <label
                    style={{
                      fontWeight: "600",
                      color: "#111827",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Description
                  </label>
                  <textarea
                    placeholder="Décrivez brièvement le produit"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={styles.descriptionInput}
                    required
                    maxLength={250} // 🔥 limite à 250 caractères
                  />
                  <div style={formStyles.row}>
                    <div>
                      <label style={formStyles.label}>Commission (%)</label>
                      <input
                        type="number"
                        placeholder="Ex: 10"
                        min="0"
                        step="1"
                        value={commissionRate}
                        onChange={(e) => setCommissionRate(e.target.value)}
                        style={formStyles.input}
                        required
                      />
                    </div>
                    {/* Prix + Quantité */}


                    <div>
                      <label style={formStyles.label}>
                        Quantité disponible
                      </label>
                      <input
                        type="number"
                        placeholder="Ex: 10"
                        min="0"
                        step="1"
                        value={quantite}
                        onChange={(e) => setQuantite(e.target.value)}
                        style={formStyles.input}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label style={formStyles.label}>Prix unitaire (Ar)</label>
                    <input
                      type="number"
                      placeholder="Ex: 250000"
                      min="0"
                      step="1"
                      value={prix}
                      onChange={(e) => setPrix(e.target.value)}
                      style={formStyles.input}
                      required
                    />
                  </div>

                  {/* Image améliorée */}
                  <label style={formStyles.label}>Image du produit</label>
                  <div
                    style={{
                      border: "2px dashed #d1d5db",
                      borderRadius: "12px",
                      padding: "20px",
                      textAlign: "center",
                      cursor: "pointer",
                      background: "#f9fafb",
                    }}
                    onClick={() =>
                      document.getElementById("imageInput").click()
                    }
                  >
                    <p style={{ color: "#6b7280", margin: 0 }}>
                      Cliquez ou glissez-déposez une image ici Cliquez ou
                      glissez-déposez une image ici
                    </p>
                    <input
                      id="imageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                  </div>

                  {/* Aperçu image */}
                  {previewUrl && (
                    <div style={formStyles.previewContainer}>
                      <img
                        src={previewUrl}
                        alt="Aperçu"
                        style={formStyles.previewImage}
                      />
                      <div>Prévisualisation</div>
                      <button
                        type="button"
                        style={formStyles.removeImageBtn}
                        onClick={() => {
                          setImage(null);
                          setPreviewUrl((prev) => {
                            if (prev) URL.revokeObjectURL(prev);
                            return null;
                          });
                        }}
                      >
                        Retirer
                      </button>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      ...formStyles.button,
                      opacity: isSubmitting ? 0.7 : 1,
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                    }}
                  >
                    {isSubmitting
                      ? "..."
                      : editingId
                        ? "Mettre à jour"
                        : "Ajouter"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* 🔍 Barre de recherche */}
        <div style={{ marginTop: "16px", marginBottom: "24px" }}>
          <input
            type="text"
            placeholder=" Rechercher un produit par nom..."
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

        {/* 🚨 Message d'erreur */}
        {error && (
          <div style={styles.alertError}>
            <div style={styles.alertContent}>
              <div style={styles.alertDot}></div>
              <p style={{ color: "#991b1b", fontWeight: "500", margin: 0 }}>
                {error}
              </p>
            </div>
          </div>
        )}

        {/* ✅ Résumé : nombre total + valeur totale */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "24px",
            background: "#ecfdf5",
            padding: "16px 24px",
            borderRadius: "12px",
            border: "1px solid #d1fae5",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
          }}
        >
          <div>
            <h4 style={{ margin: 0, fontSize: "1rem", color: "#047857" }}>
              Nombre total de produits
            </h4>
            <p
              style={{
                margin: 0,
                fontWeight: "bold",
                fontSize: "1.25rem",
                color: "#065f46",
              }}
            >
              {totalProduits}
            </p>
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "1rem", color: "#047857" }}>
              Valeur totale du stock
            </h4>
            <p
              style={{
                margin: 0,
                fontWeight: "bold",
                fontSize: "1.25rem",
                color: "#065f46",
              }}
            >
              {totalValue.toLocaleString()} Ar
            </p>
          </div>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nom</th>
              <th style={styles.th}>Référence</th>
              <th style={styles.th}>Prix unitaire</th>
              <th style={styles.th}>Quantité</th>
              <th style={styles.th}>Commission</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProduits.map((produit, index) => (
              <tr key={index} style={index % 2 === 0 ? {} : styles.trHover}>
                <td style={styles.td}>{produit.name}</td>
                <td style={styles.td}>{produit.ref ?? produit.reference}</td>
                <td style={styles.td}>{produit.unit_price} Ar</td>
                <td style={styles.td}>{produit.available_quantity}</td>
                <td style={styles.td}>
                  {produit.commission_rate
                    ? `${parseInt(produit.commission_rate).toLocaleString("fr-FR")} %`
                    : "0 %"}
                </td>
                <td style={styles.td}>
                  <button
                    style={{ ...styles.actionButton, ...styles.editButton, marginRight: "8px" }}
                    onClick={() => handleEdit(produit)}
                    title="Modifier"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    style={{ ...styles.actionButton, ...styles.deleteButton }}
                    onClick={() => handleDelete(produit.product_id)}
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>






        {/* 📭 État vide */}
        {produits.length === 0 && !error && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📦</div>
            <h3 style={styles.emptyTitle}>Aucun produit disponible</h3>
            <p style={styles.emptyDescription}>
              Ajoutez vos premiers produits pour commencer
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Produits;
