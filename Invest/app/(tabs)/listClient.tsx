import API_BASE_URL from "@/constants/apiConfig";
import { apiFetch } from "@/utils/apiFetch";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface Client {
  client_id: number;
  first_name: string;
  last_name: string;
  contact: string;
  adresse: string;
}

const ClientListScreen = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Animation d'entrée
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
    ]).start();

    loadClients();
  }, []);

  // Simulation de chargement des données (remplacez par votre API)
  const loadClients = async () => {
  try {
    setLoading(true);
    const response = await apiFetch(`${API_BASE_URL}/api/clients/list`);

    if (!response) return;
    const data = await response.json();

    if (data.status && Array.isArray(data.clients)) {
      // Trier les clients par ID décroissant (les plus récents d’abord)
      const sortedClients = [...data.clients].sort(
        (a: Client, b: Client) => b.client_id - a.client_id
      );

      setClients(sortedClients);
      setFilteredClients(sortedClients);
    } else {
      console.error('Erreur API:', data);
    }
  } catch (error) {
    console.error('Erreur lors du chargement des clients:', error);
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


  // Filtrage des clients
  useEffect(() => {
    const filtered = clients.filter(
      (client) =>
        `${client.first_name} ${client.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        client.contact.includes(searchTerm) ||
        client.adresse.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  const handleCreateClient = () => {
    router.push("/customer/client");
  };

  // const formatDate = (dateString?: string) => {
  //   if (!dateString) return '';
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('fr-FR', {
  //     day: '2-digit',
  //     month: '2-digit',
  //     year: 'numeric'
  //   });
  // };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const ClientCard = ({ item, index }: { item: Client; index: number }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.clientCard,
          {
            opacity: animatedValue,
            transform: [
              {
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        {/* Barre de couleur en haut */}
        <View style={styles.colorBar} />

        <View style={styles.cardContent}>
          {/* Header avec avatar */}
          <View style={styles.cardHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {getInitials(item.first_name, item.last_name)}
              </Text>
            </View>
            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>
                {item.first_name} {item.last_name}
              </Text>
              {/* {item.created_at && (
                <Text style={styles.clientDate}>
                  Ajouté le {formatDate(item.created_at)}
                </Text>
              )} */}
            </View>
          </View>

          {/* Informations de contact */}
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <View style={styles.contactIconContainer}>
                <Ionicons name="call" size={16} color="#ee7321" />
              </View>
              <Text style={styles.contactText}>{formatMalagasyPhone(item.contact)}</Text>
            </View>

            {item.adresse && (
              <View style={styles.contactItem}>
                <View style={styles.contactIconContainer}>
                  <Ionicons name="mail" size={16} color="#339af0" />
                </View>
                <Text style={styles.contactText} numberOfLines={1}>
                  {item.adresse}
                </Text>
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.cardFooter}>
            <Text style={styles.clientId}>ID: {item.client_id}</Text>
            {/* <TouchableOpacity
              style={styles.detailsButton}
              activeOpacity={0.7}
            >
              <Text style={styles.detailsButtonText}>Détails</Text>
              <Ionicons name="chevron-forward" size={14} color="#339af0" />
            </TouchableOpacity> */}
          </View>
        </View>
      </Animated.View>
    );
  };

  const EmptyComponent = () => (
    <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="people" size={64} color="#C7C7CC" />
      </View>
      <Text style={styles.emptyTitle}>
        {searchTerm ? "Aucun client trouvé" : "Aucun client"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchTerm
          ? "Essayez avec d'autres termes de recherche"
          : "Commencez par créer votre premier client"}
      </Text>
      {!searchTerm && (
        <TouchableOpacity
          style={styles.createFirstButton}
          onPress={handleCreateClient}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.createFirstButtonText}>
            Créer le premier client
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#339af0" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#339af0" />
          <Text style={styles.loadingText}>Chargement des clients...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#339af0" />

      {/* Header avec gradient */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconContainer}>
              <Ionicons name="people" size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Liste des Clients</Text>
              <Text style={styles.headerSubtitle}>
                {filteredClients.length} client
                {filteredClients.length > 1 ? "s" : ""}
              </Text>
            </View>
          </View>

          {/* Bouton Nouveau Client */}
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateClient}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.createButtonText}>Nouveau</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#8E8E93" />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un client..."
              placeholderTextColor="#C7C7CC"
              value={searchTerm}
              onChangeText={setSearchTerm}
              returnKeyType="search"
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchTerm("")}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={20} color="#8E8E93" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Liste des clients */}
        <FlatList
          data={filteredClients}
          renderItem={({ item, index }) => (
            <ClientCard item={item} index={index} />
          )}
          keyExtractor={(item) => item.client_id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyComponent}
          refreshing={loading}
          onRefresh={loadClients}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666666",
    fontWeight: "500",
  },
  headerContainer: {
    backgroundColor: "#339af0",
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(238, 115, 33, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 6,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
    marginLeft: 12,
  },
  clearButton: {
    padding: 4,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  clientCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  colorBar: {
    height: 4,
    backgroundColor: "#ee7321",
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#339af0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  clientDate: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
  contactInfo: {
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  contactIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contactText: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "500",
    flex: 1,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  clientId: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailsButtonText: {
    fontSize: 14,
    color: "#339af0",
    fontWeight: "600",
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  createFirstButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#339af0",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  createFirstButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "500",
  },
});

export default ClientListScreen;
