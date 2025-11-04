import SearchBar from "@/components/item/SearchBar";
import Solde from "@/components/item/Solde";
import BottomModal from '@/components/ui/BottomModal';
import { WithdrawForm } from '@/components/wallet/transactionType/WithdrawForm';
import API_BASE_URL from "@/constants/apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as NavigationBar from "expo-navigation-bar";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

interface Product {
  product_id: number;
  image_url: string;
  name: string;
  description: string;
  unit_price: number;
  available_quantity: number;
  pack_id?: number;
}

const ProductCard = ({
  product_id,
  image_url,
  name,
  description,
  unit_price,
  available_quantity,
}: Product) => {
  const truncateText = (text: string, limit: number) => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { color: "#E74C3C", text: "Rupture de stock" };
    if (quantity < 10)
      return { color: "#F39C12", text: `${quantity} en stock (faible)` };
    return { color: "#ee7221", text: `${quantity} en stock` };
  };

  const stockStatus = getStockStatus(available_quantity);

   const handlePress = (product_id: number) => {
        router.push({
          pathname: "../marketplace/details/[product_id]",
          params: { product_id: product_id.toString() },
        });
    };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => handlePress(product_id)}>
      <View style={styles.imageContainer}>
        <Image
          source={{  uri: `${API_BASE_URL.replace(/\/$/, '')}/${image_url.replace(/^\/+/, '')}`}}
          style={styles.image}
          resizeMode="contain"
        />
        {available_quantity === 0 && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Épuisé</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {unit_price.toLocaleString("fr-FR")} Ar
          </Text>
          <Text style={styles.priceLabel}>Prix unitaire</Text>
        </View>

        <Text style={styles.description} numberOfLines={3}>
          {truncateText(description, 80)}
        </Text>

        <View style={styles.footer}>
          <View
            style={[styles.stockBadge, { backgroundColor: stockStatus.color }]}
          >
            <View style={styles.stockDot} />
            <Text style={styles.stockText}>{stockStatus.text}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

function List() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0)).current;
  const [wallet, setWallet] = useState<number>(0);
  const [showWithdraw, setShowWithdraw] = useState(false); // État pour le modal de retrait

  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(titleScale, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadWallet = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); 
      if (!token) {
        console.warn("Aucun token trouvé");
        return;
      }
  
      const res = await fetch(`${API_BASE_URL}/api/wallets/show`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        console.error("Erreur API wallet:", res.status);
        return;
      }
  
      const walletData = await res.json();
      setWallet(walletData.wallet?.balance || 0);
    } catch (error) {
      console.error("Erreur lors du chargement du wallet:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/list`);
      const data = await res.json();
  
      const mapped = data.map((item: any) => ({
        ...item,
        unit_price: Number(item.unit_price),
        available_quantity: Number(item.available_quantity ?? 0),
      }));
  
      setProducts(mapped);
      setFilteredProducts(mapped);
    } catch (e) {
      console.error("Erreur lors du chargement des produits:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    loadWallet();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchProducts(), loadWallet()]);
  };

  const getProductStats = () => {
    const totalProducts = filteredProducts.length;
    return { totalProducts };
  };

  const handleSearch = (query: string) => {
    if (query.trim() === "") {
      setFilteredProducts(products);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = products.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerQuery) ||
          item.description.toLowerCase().includes(lowerQuery)
      );
      setFilteredProducts(filtered);
    }
  };

  // Fonction pour fermer le modal et rafraîchir le wallet
  const handleWithdrawClose = () => {
    setShowWithdraw(false);
    loadWallet(); // Rafraîchir le solde après retrait
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ee7221" />
        <Text style={styles.loadingText}>Chargement des produits...</Text>
      </SafeAreaView>
    );
  }

  const stats = getProductStats();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Composant Solde avec le bouton de retrait */}
        <Solde 
          balance={Number(wallet)} 
          onWithdrawPress={() => setShowWithdraw(true)}
        />

        <View style={styles.topContainer}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <SearchBar
              onSearch={handleSearch}
              placeholder="Rechercher un produit"
            />
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Liste des Produits</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.statNumber}>{stats.totalProducts}</Text>
            <Text style={styles.statLabel}>
              produit{stats.totalProducts > 1 ? "s" : ""}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.product_id.toString()}
        renderItem={({ item }) => <ProductCard {...item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Aucun produit disponible</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Modal de retrait */}
      <BottomModal visible={showWithdraw} onClose={handleWithdrawClose}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Retirer votre argent</Text>
          <TouchableOpacity onPress={handleWithdrawClose}>
            <FontAwesomeIcon icon={faX} size={24} />
          </TouchableOpacity>
        </View>
        <WithdrawForm balance={wallet} onClose={handleWithdrawClose} />
      </BottomModal>
    </SafeAreaView>
  );
}

const screenWidth = Dimensions.get("window").width;
const cardWidth = screenWidth - 30;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEFEF",
    marginBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#2C3E50",
    fontWeight: "500",
  },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingBottom: 15,
    paddingTop: 20,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  statsContainer: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ee7221",
  },
  statLabel: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  list: {
    padding: 15,
    paddingTop: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    width: cardWidth,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 200,
  },
  outOfStockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  outOfStockText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  info: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 8,
    lineHeight: 24,
  },
  priceContainer: {
    marginBottom: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E74C3C",
  },
  priceLabel: {
    fontSize: 12,
    color: "#95A5A6",
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 15,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  stockBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "white",
    marginRight: 6,
  },
  stockText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#7F8C8D",
    textAlign: "center",
  },
  buttonParticipate: {
    backgroundColor: "#E74C3C",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: "center",
    marginVertical: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  imageLogo: {
    width: 60,
    height: 60,
  },
  // Styles pour le modal
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
});

export default List;