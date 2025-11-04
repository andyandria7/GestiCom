import BackArrow from "@/components/item/BackArrow";
import API_BASE_URL from "@/constants/apiConfig";
import { apiFetch } from "@/utils/apiFetch";
import { Ionicons } from "@expo/vector-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Product = {
  product_id: number;
  product_name?: string;
  name?: string;  
  image_url: string;
  description: string;
  unit_price?: number;
  pack_name?: string;
  min_investment?: number;
  return_on_investment?: number;
  objective_quantity?: number;
};

export default function ProductDetail() {
  const { product_id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  const loadRole = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const decoded: any = jwtDecode(token);
        const userRole = decoded?.user?.role || "default";
        setRole(userRole);
      } else {
        setRole("default");
      }
    } catch (e) {
      console.error("Erreur de décodage du token", e);
      setRole("default");
    } finally {
      setLoading(false);
    }
  };

  loadRole();

  const fetchProduct = async () => {
    try {
      const [resProductDetails] = await Promise.all([
        apiFetch(`${API_BASE_URL}/api/products/show/${product_id}`),
      ]);

      if(!resProductDetails)return;
      const data = await resProductDetails.json();
      setProduct(data);
    } catch (error) {
      console.error("Erreur lors du chargement du produit :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchProduct();
      
      const interval = setInterval(() => {
      fetchProduct();
      }, 1000);

      return () => clearInterval(interval);
  }, []);


  if (loading) return <ActivityIndicator style={styles.loading} size="large" color="blue" />;

  if (!product) {
    return <Text>Produit introuvable.</Text>;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.detailsContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.titleHeader}>Produit</Text>
          <View style={styles.rightPlaceholder} />
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{  uri: `${API_BASE_URL.replace(/\/$/, '')}/${product.image_url.replace(/^\/+/, '')}`}}
            style={styles.image}
            resizeMode="contain"
            onError={(e) => console.log("Erreur image pour", product.pack_name, e.nativeEvent)}
          />
        </View>

        <View style={styles.descriptionContainer}>
          <View style={styles.descriptionHeader}>
            <Text style={styles.title}>{product.product_name || product.name}</Text>
            <Text style={styles.price}>{Number(product.min_investment || product.unit_price).toLocaleString('fr-FR')} Ar</Text>
          </View>

          {role !== "commercial" && (
          <View style={styles.packContainer}>
            <Text style={styles.packName}>{product.pack_name}</Text>
          </View>
          )}

          {role !== "commercial" && (
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityText}>Quantité disponible</Text>
            <Text style={styles.quantity}>{product.objective_quantity}</Text>
          </View>
          )}

          {role !== "commercial" && (
          <View style={styles.footer}>
            <Text style={styles.roiTitle}>Retour en investissement</Text>
            <Text style={styles.roiText}>{product.return_on_investment}%</Text>
          </View>
          )}

          <ScrollView style={styles.descriptionText}>
            <Text style={styles.description}>{product.description}</Text>
          </ScrollView>

        </View>
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  detailsContainer: {
    flex: 1,
    flexDirection: 'column',
    width: width,
    height: 250,
  },
  imageContainer: {
    padding: 20,
  },
  image: {
    width: '100%',
    height: 250,
  },

  // ---------- DESCRIPTION CONTAINER ----------
  descriptionContainer: {
    flex: 1,
    flexDirection: 'column',
    marginTop: -30, // conservé
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#ffffff',
    zIndex: 10,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  descriptionHeader: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  header: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    zIndex: 10,
  },
  backButton: {
    width: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  titleHeader: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  rightPlaceholder: {
    width: 40, 
  },
  title: {
    flex: 1,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: 22,
    fontWeight: '600',
    color: '#158EFA',
  },
  packContainer: {
    backgroundColor: '#F0F4F8',
    padding: 10,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  packName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: '#E8F6EA',
  },
  quantityText: {
    flex: 1,
    fontSize: 18,
    color: '#333',
  },
  quantity: {
    color: '#fff',
    backgroundColor: 'green',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontWeight: 'bold',
  },
  descriptionText: {
    flex: 1,
    marginVertical: 10,
  },
  description: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: "justify",
    color: '#555',
  },
  
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: '#E8F6EA',
  },
  roiTitle:{
    flex: 1,
    fontSize: 18,
    color: '#333',
  },
  roiText: {
    color: '#fff',
    backgroundColor: 'green',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontWeight: 'bold',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#158EFA',
    padding: 2,
    borderRadius: 25,
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
    color: '#ffffff',
  },
  circle: {
      height: 39,
      width: 39,
      borderRadius: 50,
      backgroundColor: '#000',
      alignItems: 'center',
      justifyContent: 'center',
  },
});
