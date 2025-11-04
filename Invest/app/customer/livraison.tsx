import DateTimePickerField from "@/components/inputField/DateTimePickerField";
import InputField from "@/components/inputField/InputField";
import BackArrow from "@/components/item/BackArrow";
import API_BASE_URL from "@/constants/apiConfig";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Types pour TypeScript
interface Client {
  client_id: number;
  first_name: string;
  last_name: string;
  contact: string;
}

type DecodedToken = {
  user?: {
    user_id: string | number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string | null;
    date_of_birth: string;
    role: string;
    profile_picture: string | null;
    CIN_picture: string | null;
    created_at: string;
    updated_at: string;
  };
  exp: number;
  iat: number;
  [key: string]: any;
};

interface Product {
  product_id: number;
  name: string;
  reference: string;
  unit_price: number;
}

interface FormData {
  place: string;
  delivery_date: string;
  client_id: string;
  client_contact: string;
  client_name: string;
  product_reference: string;
  product_name: string;
  quantity: string;
}

interface Errors {
  [key: string]: string | null;
}

const DeliveryForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    place: "",
    delivery_date: "",
    client_id: "",
    client_contact: "",
    client_name: "",
    product_reference: "",
    product_name: "",
    quantity: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Fonction pour vérifier si le formulaire est valide
  const isFormValid = useMemo(() => {
    // Vérifier que tous les champs obligatoires sont remplis
    const requiredFieldsValid = 
      formData.place.trim() !== "" &&
      formData.delivery_date.trim() !== "" &&
      formData.client_id.trim() !== "" &&
      formData.client_name.trim() !== "" &&
      formData.product_reference.trim() !== "" &&
      formData.product_name.trim() !== "" &&
      formData.quantity.trim() !== "";

    // Vérifier que la quantité est un nombre positif valide
    const quantityValid = 
      formData.quantity.trim() !== "" &&
      !isNaN(Number(formData.quantity)) &&
      parseInt(formData.quantity) > 0;

    // Vérifier qu'il n'y a pas d'erreurs
    const noErrors = Object.values(errors).every(error => error === null || error === undefined);

    return requiredFieldsValid && quantityValid && noErrors;
  }, [formData, errors]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;
  
        const decodedToken = jwtDecode<DecodedToken>(token);

        // Token sometimes includes user_id nested under `user` and sometimes at the top-level.
        const id = decodedToken.user?.user_id ?? decodedToken.user_id;

        if (!id) {
          // Redacted logging to help debugging without leaking sensitive fields.
          const redactedUser = decodedToken.user
            ? { user_id: decodedToken.user.user_id ?? decodedToken.user_id }
            : decodedToken.user_id
            ? { user_id: decodedToken.user_id }
            : null;

          console.warn(
            "ID utilisateur introuvable dans le token. decodedToken keys:",
            Object.keys(decodedToken || {})
          );
          // debug-level detail: only the redacted user object or top-level user_id
          console.debug("decodedToken.user (redacted):", redactedUser);
          return;
        }
  
        setUserId(String(id)); // sauvegarde dans ton state
      } catch (error) {
        console.error("Erreur lors de la récupération de l'ID utilisateur :", error);
      }
    };
  
    fetchUserId();
  }, []);
    useEffect(() => {
    const fetchData = async () => {
      try {
        const [resClients, resProducts] = await Promise.all([
          fetch(`${API_BASE_URL}/api/clients/list`),
          fetch(`${API_BASE_URL}/api/products`),
        ]);

        const clientsJson = await resClients.json();
        const productsJson = await resProducts.json();

        setClients(clientsJson.clients ?? []);
        setProducts(productsJson ?? []);
      } catch (err) {
        console.error("Erreur chargement clients/produits:", err);
      }
    };
    fetchData();
  }, []);

  const handleContact = (contact: string): void => {
    // Toujours garder ce que tape l'utilisateur
    setFormData((prev) => ({ ...prev, client_contact: contact }));

    const client = clients.find((c) => c.contact === contact);

    if (client) {
      // ✅ on met uniquement l'ID et le nom, pas le contact
      setFormData((prev) => ({
        ...prev,
        client_id: client.client_id.toString(), // ID réel
        client_name: `${client.first_name} ${client.last_name}`,
      }));
      setErrors((prev) => ({ ...prev, client_id: null }));
    } else {
      setFormData((prev) => ({
        ...prev,
        client_id: "",
        client_name: "",
      }));
      if (contact.trim() !== "") {
        setErrors((prev) => ({ ...prev, client_id: "Client non trouvé" }));
      } else {
        setErrors((prev) => ({ ...prev, client_id: null }));
      }
    }
  };

  const handleProductRefChange = (reference: string): void => {
    const upperReference = reference.toUpperCase(); // 🔥 Convertir en majuscule
  
    setFormData((prev) => ({ ...prev, product_reference: upperReference }));
  
    if (upperReference) {
      const product = products.find(
        (p) =>
          p.reference.trim().toLowerCase() === upperReference.trim().toLowerCase()
      );
      if (product) {
        setFormData((prev) => ({
          ...prev,
          product_name: product.name,
        }));
        setErrors((prev) => ({ ...prev, product_reference: null }));
      } else {
        setFormData((prev) => ({ ...prev, product_name: "" }));
        setErrors((prev) => ({
          ...prev,
          product_reference: "Produit non trouvé",
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, product_name: "" }));
      setErrors((prev) => ({ ...prev, product_reference: null }));
    }
  };

  // Validation en temps réel de la quantité
  const handleQuantityChange = (quantity: string): void => {
    setFormData((prev) => ({ ...prev, quantity }));
    
    if (quantity.trim() === "") {
      setErrors((prev) => ({ ...prev, quantity: null }));
    } else if (isNaN(Number(quantity)) || parseInt(quantity) <= 0) {
      setErrors((prev) => ({ ...prev, quantity: "La quantité doit être un nombre positif" }));
    } else {
      setErrors((prev) => ({ ...prev, quantity: null }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.place.trim()) newErrors.place = "Le lieu est requis";
    if (!formData.delivery_date.trim())
      newErrors.delivery_date = "La date et heure sont requises";
    if (!formData.client_id.trim())
      newErrors.client_id = "Le numéro client est requis";
    else if (!formData.client_name) newErrors.client_id = "Client non valide";
    if (!formData.product_reference.trim())
      newErrors.product_reference = "La référence produit est requise";
    else if (!formData.product_name)
      newErrors.product_reference = "Produit non valide";
    if (!formData.quantity.trim())
      newErrors.quantity = "La quantité est requise";
    else if (
      isNaN(Number(formData.quantity)) ||
      parseInt(formData.quantity) <= 0
    )
      newErrors.quantity = "La quantité doit être un nombre positif";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;
    setLoading(true);
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/delivery/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: parseInt(formData.client_id),
          product_id: products.find(
            (p) => p.reference === formData.product_reference
          )?.product_id,
          place: formData.place,
          delivery_date: formData.delivery_date,
          quantity: parseInt(formData.quantity),
          user_id: userId ? parseInt(userId) : null,  
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        setFormData({
          place: "",
          delivery_date: "",
          client_id: "",
          client_contact: "",
          client_name: "",
          product_reference: "",
          product_name: "",
          quantity: "",
        });
        router.replace("/(tabs)/deliveries");
        setErrors({});
      } else {
        Alert.alert("Erreur", JSON.stringify(result));
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de contacter le serveur");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#ee7321" />

      <View style={styles.header}>
        <View style={styles.backArrowContainer}>
          <BackArrow style={styles.backArrow} />
        </View>
        <Text style={styles.headerTitle}>Nouvelle Livraison</Text>
        <Text style={styles.headerSubtitle}>
          Remplissez tous les champs requis
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.formContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <InputField
            label="Lieu de livraison *"
            value={formData.place}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, place: text }))
            }
            placeholder="Entrez le lieu de livraison"
            icon="location-outline"
          />

          <DateTimePickerField
            label="Date et heure *"
            value={formData.delivery_date}
            onChange={(date) =>
              setFormData((prev) => ({ ...prev, delivery_date: date }))
            }
            error={errors.delivery_date}
          />

          <InputField
            label="Numéro du client *"
            value={formData.client_contact}
            onChangeText={handleContact}
            placeholder="Entrez le numéro du client"
            isNumber="numeric"
            icon="person-outline"
          />

          <InputField
            label="Nom du client"
            value={formData.client_name}
            onChangeText={() => {}}
            placeholder="Aucun client trouvé"
            editable={false}
            icon="person-circle-outline"
          />

          <InputField
            label="Référence du produit *"
            value={formData.product_reference}
            onChangeText={handleProductRefChange}
            placeholder="Entrez la référence du produit"
            icon="cube-outline"
            autoCapitalize="characters"
          />

          <InputField
            label="Nom du produit"
            value={formData.product_name}
            onChangeText={() => {}}
            placeholder="Aucune référence de produit trouvée"
            editable={false}
            icon="pricetag-outline"
          />

          <InputField
            label="Quantité *"
            value={formData.quantity}
            onChangeText={handleQuantityChange}
            placeholder="Entrez la quantité"
            isNumber="numeric"
            icon="layers-outline"
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              (loading || !isFormValid) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading || !isFormValid}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.submitButtonText,
              (loading || !isFormValid) && styles.submitButtonTextDisabled
            ]}>
              {loading ? "Création en cours..." : "Créer la livraison"}
            </Text>
            {!loading && isFormValid && (
              <Ionicons
                name="send-outline"
                size={20}
                color="#fff"
                style={styles.submitIcon}
              />
            )}
            {!isFormValid && !loading && (
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#999"
                style={styles.submitIcon}
              />
            )}
          </TouchableOpacity>

          {!isFormValid && (
            <View style={styles.helpSection}>
              <Text style={styles.helpTitle}>Formulaire incomplet</Text>
              <Text style={styles.helpText}>
                Veuillez remplir tous les champs obligatoires (*) et corriger les erreurs pour activer le bouton de création.
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#ee7321",
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    opacity: 0.9,
  },
  formContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e1e5e9",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputError: {
    borderColor: "#ff6b6b",
  },
  inputDisabled: {
    backgroundColor: "#f8f9fa",
    borderColor: "#dee2e6",
  },
  inputIcon: {
    marginLeft: 15,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
    paddingRight: 15,
  },
  disabledInput: {
    color: "#666",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5,
  },
  submitButton: {
    backgroundColor: "#339af0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
    elevation: 1,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  submitButtonTextDisabled: {
    color: "#999",
  },
  submitIcon: {
    marginLeft: 10,
  },
  helpSection: {
    marginTop: 20,
    backgroundColor: "#fff3cd",
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#856404",
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: "#856404",
    lineHeight: 20,
  },
  backArrowContainer: {
    position: "absolute",
    top: 50,
    left: 1,
    zIndex: 1,
  },
  backArrow: {
    color: "#fff",
  },
});

export default DeliveryForm;