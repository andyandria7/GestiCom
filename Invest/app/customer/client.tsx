import InputField from "@/components/inputField/InputField";
import API_BASE_URL from "@/constants/apiConfig";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const ClientFormScreen = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    adresse: "",
    contact: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  // const product_id = useMemo(() => {
  //   if (params && typeof params.product_id === "string")
  //     return params.product_id;
  //   if (
  //     params &&
  //     typeof params.product_id === "object" &&
  //     params.product_id != null
  //   )
  //     return params.product_id.toString();
  //   return "";
  // }, [params]);

  // Refs pour la navigation entre les champs
  const prenomRef = useRef<TextInput>(null);
  const adresseRef = useRef<TextInput>(null);
  const contactRef = useRef<TextInput>(null);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateForm = () => {
    const newErrors: any = {};
    // Seul le numéro de téléphone est obligatoire
    if (!formData.contact.trim()) {
      newErrors.contact = "Le numéro de téléphone est requis";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    Alert.alert(
      "Annuler",
      "Êtes-vous sûr de vouloir annuler ? Les données saisies seront perdues.",
      [
        { text: "Non", style: "cancel" },
        {
          text: "Oui",
          style: "destructive",
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleDelivery = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const clientData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        adresse: formData.adresse.trim(),
        contact: formData.contact.trim(),
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/clients/create`,
        clientData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201) {
        Alert.alert("Succès", "Client créé avec succès !");
        router.push("/(tabs)/list");
      } else {
        Alert.alert("Erreur", "Impossible de créer le client");
      }
    } catch (error: any) {
      console.log("Erreur API:", error.response?.data || error.message);
      Alert.alert(
        "Erreur",
        error.response?.data?.message || "Problème serveur"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field] && value.trim()) {
      setErrors((prev: any) => ({ ...prev, [field]: null }));
    }
  };

  const isFormValid = () => {
    return formData.contact.trim() !== "";
  };

  const FormField = ({
    label,
    value,
    onChangeText,
    placeholder,
    icon,
    keyboardType = "default",
    autoCapitalize = "words",
    error,
    fieldKey,
    nextFieldRef,
    multiline = false,
    required = false,
  }: any) => {
    const isFocused = focusedField === fieldKey;
    const hasValue = value.trim().length > 0;

    return (
      <View style={[styles.fieldContainer, { opacity: 1 }]}>
        <Text
          style={[
            styles.fieldLabel,
            isFocused && styles.fieldLabelFocused,
            error && styles.fieldLabelError,
          ]}
        >
          {label} {required && <Text style={styles.requiredStar}>*</Text>}
        </Text>
        <View
          style={[
            styles.inputContainer,
            isFocused && styles.inputContainerFocused,
            error && styles.inputContainerError,
            hasValue && styles.inputContainerFilled,
          ]}
        >
          <View
            style={[
              styles.iconContainer,
              isFocused && styles.iconContainerFocused,
              error && styles.iconContainerError,
            ]}
          >
            <Ionicons
              name={icon}
              size={20}
              color={
                isFocused
                  ? "#007AFF"
                  : error
                  ? "#FF3B30"
                  : hasValue
                  ? "#34C759"
                  : "#8E8E93"
              }
            />
          </View>
          <TextInput
            ref={nextFieldRef ? nextFieldRef : undefined}
            style={[
              styles.textInput,
              multiline && styles.textInputMultiline,
              isFocused && styles.textInputFocused,
            ]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#C7C7CC"
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            returnKeyType={nextFieldRef ? "next" : "done"}
            onSubmitEditing={() => {
              if (nextFieldRef) {
                nextFieldRef.current?.focus();
              }
            }}
            onFocus={() => setFocusedField(fieldKey)}
            onBlur={() => setFocusedField(null)}
            multiline={multiline}
            numberOfLines={multiline ? 3 : 1}
            selectionColor="#007AFF"
          />
          {hasValue && !error && (
            <View style={styles.checkmarkContainer}>
              <Ionicons name="checkmark-circle" size={18} color="#34C759" />
            </View>
          )}
        </View>
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={14} color="#FF3B30" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

        {/* Header avec gradient */}
        <View style={styles.headerContainer}>
          <View style={styles.headerGradient} />
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <View style={styles.backButtonContainer}>
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Informations Client</Text>
            <View style={styles.placeholder} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View
            style={[
              styles.content,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
          >
            {/* Hero Section */}
            <View style={styles.heroSection}>
              <View style={styles.heroIconContainer}>
                <Ionicons name="person-add" size={32} color="#007AFF" />
              </View>
              <Text style={styles.heroTitle}>Informations du client</Text>
              <Text style={styles.heroSubtitle}>
                Saisissez les informations du client pour la livraison
              </Text>
            </View>

            {/* Formulaire avec effet glassmorphism */}
            <Animated.View
              style={[
                styles.formContainer,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>Détails du client</Text>
                <View style={styles.formDivider} />
              </View>

              <InputField
                label="Nom"
                value={formData.first_name}
                onChangeText={(value: string) =>
                  updateField("first_name", value)
                }
                placeholder="Nom de famille"
              />

              <InputField
                label="Prénom"
                value={formData.last_name}
                onChangeText={(value: string) =>
                  updateField("last_name", value)
                }
                placeholder="Prénom"
              />

              <InputField
                label="Adresse mail"
                value={formData.adresse}
                onChangeText={(value: string) => updateField("adresse", value)}
                placeholder="ex: exemple@gmail.com"
              />

              <InputField
                label="Numéro de téléphone"
                value={formData.contact}
                onChangeText={(value: string) => updateField("contact", value)}
                placeholder="033 12 345 67"
                isNumber="numeric"
              />
            </Animated.View>

            {/* Boutons d'action */}
            <Animated.View
              style={[styles.buttonContainer, { opacity: fadeAnim }]}
            >
              {/* Bouton Annuler */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                activeOpacity={0.8}
              >
                <View style={styles.buttonContent}>
                  <Ionicons
                    name="close-circle-outline"
                    size={20}
                    color="#FF3B30"
                  />
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </View>
              </TouchableOpacity>

              {/* Bouton Livraison */}
              <TouchableOpacity
                style={[
                  styles.deliveryButton,
                  isFormValid()
                    ? styles.deliveryButtonActive
                    : styles.deliveryButtonInactive,
                ]}
                onPress={handleDelivery}
                disabled={!isFormValid() || loading}
                activeOpacity={0.8}
              >
                <View style={styles.buttonContent}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Text
                        style={[
                          styles.deliveryButtonText,
                          isFormValid()
                            ? styles.deliveryButtonTextActive
                            : styles.deliveryButtonTextInactive,
                        ]}
                      >
                        Valider
                      </Text>
                      {isFormValid() && (
                        <Ionicons
                          name="arrow-forward"
                          size={20}
                          color="#FFFFFF"
                        />
                      )}
                    </>
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Note améliorée */}
            <Animated.View
              style={[styles.noteContainer, { opacity: fadeAnim }]}
            >
              <View style={styles.noteIconContainer}>
                <Ionicons name="information-circle" size={18} color="#007AFF" />
              </View>
              <Text style={styles.noteText}>
                Seul le numéro de téléphone est obligatoire
              </Text>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerContainer: {
    position: "relative",
    paddingBottom: 20,
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: "#007AFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    zIndex: 1,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heroSection: {
    alignItems: "center",
    paddingVertical: 30,
    marginBottom: 20,
  },
  heroIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  formHeader: {
    marginBottom: 30,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 15,
  },
  formDivider: {
    height: 3,
    backgroundColor: "#007AFF",
    borderRadius: 2,
    width: 50,
  },
  fieldContainer: {
    marginBottom: 28,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 12,
  },
  fieldLabelFocused: {
    color: "#007AFF",
  },
  fieldLabelError: {
    color: "#FF3B30",
  },
  requiredStar: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "700",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    minHeight: 56,
  },
  inputContainerFocused: {
    borderColor: "#007AFF",
    backgroundColor: "#FFFFFF",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainerError: {
    borderColor: "#FF3B30",
    backgroundColor: "#FFF8F8",
  },
  inputContainerFilled: {
    borderColor: "#34C759",
    backgroundColor: "#F8FFF8",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconContainerFocused: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
  iconContainerError: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
    paddingVertical: 12,
    minHeight: 48,
  },
  textInputFocused: {
    color: "#007AFF",
  },
  textInputMultiline: {
    minHeight: 80,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  checkmarkContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 48,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 14,
    color: "#FF3B30",
    marginLeft: 6,
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 4,
    marginBottom: 30,
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#FF3B30",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  deliveryButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  deliveryButtonActive: {
    backgroundColor: "#007AFF",
  },
  deliveryButtonInactive: {
    backgroundColor: "#E8E8E8",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF3B30",
  },
  deliveryButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  deliveryButtonTextActive: {
    color: "#FFFFFF",
  },
  deliveryButtonTextInactive: {
    color: "#999999",
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 122, 255, 0.05)",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 20,
  },
  noteIconContainer: {
    marginRight: 10,
  },
  noteText: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
});

export default ClientFormScreen;
