import API_BASE_URL from "@/constants/apiConfig";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Client {
  client_id: number;
  first_name: string;
  last_name: string;
  contact: string;
  adresse: string;
}

interface Product {
  product_id: number;
  name: string;
  description: string;
  unit_price: string | number;
  reference: string;
}

interface Delivery {
  delivery_id: number;
  client: Client;
  product: Product | null;
  place: string;
  delivery_date: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

interface DeliveryListProps {
  navigation?: {
    navigate: (screen: string) => void;
  };
}

const DeliveryListScreen: React.FC<DeliveryListProps> = ({ navigation }) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadDeliveries = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/delivery`);
      if (!response.ok) {
        throw new Error("Erreur serveur");
      }
      const data = await response.json();
  
      if (Array.isArray(data)) {
        // Tri par delivery_date du plus récent au plus ancien
        const sorted = data.sort(
          (a: Delivery, b: Delivery) => b.delivery_id - a.delivery_id
        );
        setDeliveries(sorted);
      } else {
        setDeliveries([]);
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de charger les livraisons");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatMalagasyPhone = (number: string) => {
  // Nettoyer le numéro pour ne garder que les chiffres
  const cleaned = number.replace(/\D/g, "");

  // Vérifier si le numéro commence par 0 ou +261
  if (cleaned.startsWith("261")) {
    // Exemple : 261341234567 → 034 12 345 67
    const local = "0" + cleaned.slice(3);
    return local.replace(/(\d{3})(\d{2})(\d{3})(\d{2})/, "$1 $2 $3 $4");
  } else if (cleaned.startsWith("0")) {
    // Exemple : 0341234567 → 034 12 345 67
    return cleaned.replace(/(\d{3})(\d{2})(\d{3})(\d{2})/, "$1 $2 $3 $4");
  }

  // Si le format n’est pas reconnu, on retourne le numéro original
  return number;
};

  useEffect(() => {
    loadDeliveries();
  }, []);

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await loadDeliveries();
    setRefreshing(false);
  };

  const navigateToForm = (): void => {
    router.push("/customer/livraison");
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  

  const renderDeliveryItem = ({ item }: { item: Delivery }) => {
    const product = item.product;
    const totalPrice = product
      ? (Number(product.unit_price) * Number(item.quantity)).toFixed(2)
      : "N/A";

    return (
      <View style={styles.deliveryCard}>
        {/* Header avec ID et statut */}
        <View style={styles.cardHeader}>
          <View style={styles.leftHeader}>
            <View style={styles.deliveryIdBadge}>
              <Text style={styles.deliveryIdText}>#{item.delivery_id}</Text>
            </View>
          </View>
          
        </View>

        {/* Informations principales en grid */}
        <View style={styles.mainInfo}>
          {/* Client */}
          <View style={styles.infoSection}>
            <View style={styles.iconContainer}>
              <Ionicons name="person" size={16} color="#6366F1" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Client</Text>
              {item.client ? (
                <>
                  <Text style={styles.infoValue}>
                    {item.client.first_name} {item.client.last_name}
                  </Text>
                  <Text style={styles.infoSubValue}>{formatMalagasyPhone(item.client.contact)}</Text>
                </>
              ) : (
                <Text style={styles.infoValueEmpty}>Client inconnu</Text>
              )}
            </View>
          </View>

          {/* Produit */}
          <View style={styles.infoSection}>
            <View style={[styles.iconContainer, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="cube" size={16} color="#D97706" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Produit</Text>
              {product ? (
                <>
                  <Text style={styles.infoValue}>{product.name}</Text>
                  <Text style={styles.infoSubValue}>Réf: {product.reference}</Text>
                </>
              ) : (
                <Text style={styles.infoValueEmpty}>Aucun produit</Text>
              )}
            </View>
          </View>
        </View>

        {/* Détails financiers et quantité */}
        <View style={styles.detailsRow}>
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantité</Text>
            <Text style={styles.quantityValue}>{item.quantity}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Total</Text>
            <Text style={styles.priceValue}>
              {Number(totalPrice).toLocaleString("fr-MG")} Ar
            </Text>
          </View>
        </View>

        {/* Informations de livraison */}
        <View style={styles.deliveryInfo}>
          <View style={styles.locationRow}>
            <View style={[styles.iconContainer, styles.smallIcon, { backgroundColor: "#DCFCE7" }]}>
              <Ionicons name="location" size={14} color="#16A34A" />
            </View>
            <Text style={styles.locationText}>{item.place}</Text>
          </View>
          <View style={styles.dateRow}>
            <View style={[styles.iconContainer, styles.smallIcon, { backgroundColor: "#FEE2E2" }]}>
              <Ionicons name="time" size={14} color="#DC2626" />
            </View>
            <Text style={styles.dateText}>{formatDate(item.delivery_date)}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="archive-outline" size={64} color="#D1D5DB" />
      </View>
      <Text style={styles.emptyText}>Aucune livraison</Text>
      <Text style={styles.emptySubtext}>
        Créez votre première livraison en appuyant sur le bouton +
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#ee7321" />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Livraisons</Text>
          <Text style={styles.headerSubtitle}>
            {deliveries.length} livraison{deliveries.length > 1 ? "s" : ""}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={navigateToForm}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ee7321" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : (
        <FlatList
          data={deliveries}
          renderItem={renderDeliveryItem}
          keyExtractor={(item) => item.delivery_id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#ee7321"]}
              tintColor="#ee7321"
            />
          }
          ListEmptyComponent={renderEmptyComponent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    marginBottom: 40,
  },
  header: {
    backgroundColor: "#ee7321",
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
    fontWeight: "500",
  },
  addButton: {
    backgroundColor: "#3B82F6",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  deliveryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  leftHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  deliveryIdBadge: {
    backgroundColor: "#1F2937",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  deliveryIdText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  mainInfo: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 16,
  },
  infoSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  smallIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "600",
    marginBottom: 2,
  },
  infoSubValue: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "400",
  },
  infoValueEmpty: {
    fontSize: 13,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  detailsRow: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  quantityContainer: {
    flex: 1,
    alignItems: "center",
  },
  quantityLabel: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  quantityValue: {
    fontSize: 18,
    color: "#111827",
    fontWeight: "700",
  },
  priceContainer: {
    flex: 1,
    alignItems: "center",
    borderLeftWidth: 1,
    borderLeftColor: "#E5E7EB",
  },
  priceLabel: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 18,
    color: "#059669",
    fontWeight: "700",
  },
  deliveryInfo: {
    gap: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
    flex: 1,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 22,
  },
});

export default DeliveryListScreen;