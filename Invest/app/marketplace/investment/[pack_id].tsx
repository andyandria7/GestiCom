import NumberInput from "@/components/marketplace/investment/NumberInput";
import BottomModal from "@/components/ui/BottomModal";
import { PaymentForm } from "@/components/wallet/transactionType/PaymentForm";
import API_BASE_URL from "@/constants/apiConfig";
import { apiFetch } from "@/utils/apiFetch";
import { Ionicons } from "@expo/vector-icons";
import {
  faArrowRight,
  faBullseye,
  faChartLine
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

type Pack = {
  pack_id: number;
  product_id: number;
  image_url: string;
  pack_name: string;
  product_name: string;
  min_investment: number;
  return_on_investment: number;
  objective_quantity: number;
};

export default function PackInvestmentPage() {
  const { pack_id } = useLocalSearchParams();
  const [pack, setPack] = useState<Pack | null>(null);
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(0);

  const [showPayment, setShowPayment] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const fetchData = async () => {
    try {
      await AsyncStorage.getItem("token"); // récup token si nécessaire
      const [resWallet, resPack] = await Promise.all([
        apiFetch(`${API_BASE_URL}/api/wallets/show`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }),
        apiFetch(`${API_BASE_URL}/api/packs/show/${pack_id}`),
      ]);

      if (!resWallet || !resPack) return;
      const walletData = await resWallet.json();
      const packData = await resPack.json();

      setWallet(walletData.wallet.balance);
      setPack(packData);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="blue" />;
  }

  if (!pack) {
    return <Text>Pack introuvable</Text>;
  }

  const handleConfirm = () => {
    setShowPayment(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Pack</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: API_BASE_URL + pack.image_url }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <ScrollView style={styles.descriptionContainer}>
        <Text style={styles.packName}>{pack.pack_name}</Text>
        <Text style={styles.productName}>{pack.product_name}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <FontAwesomeIcon icon={faBullseye} size={20} color="#fff" />
            <Text style={styles.statValue}>{pack.objective_quantity}</Text>
            <Text style={styles.statLabel}>Objectif</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#10B981" }]}>
            <FontAwesomeIcon icon={faChartLine} size={20} color="#fff" />
            <Text style={styles.statValue}>{pack.return_on_investment}%</Text>
            <Text style={styles.statLabel}>ROI</Text>
          </View>
        </View>

        <View style={styles.quantityContainer}>
          <Text style={styles.quantityText}>Investissement minimum</Text>
          <Text style={styles.price}>
            {Number(pack.min_investment).toLocaleString("fr-FR")} Ar / unité
          </Text>
        </View>

        <View style={styles.quantityContainer}>
          <Text style={styles.quantityText}>Quantité</Text>
          <NumberInput
            value={quantity}
            onChange={setQuantity}
            min={0}
            max={pack.objective_quantity}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.totalText}>
            {Number(quantity * pack.min_investment).toLocaleString("fr-FR")} Ar
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>Passer au paiement</Text>
            <View style={styles.circle}>
              <FontAwesomeIcon icon={faArrowRight} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
      <BottomModal title = "Paiment direct" visible={showPayment} onClose={() => setShowPayment(false)}>
        <PaymentForm
          pack_id={pack.pack_id}
          product_id={pack.product_id}
          quantity={quantity}
          total_amount={String(quantity * pack.min_investment)}
          onClose={() => setShowPayment(false)}
        />
      </BottomModal>
      </ScrollView>

    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  rightPlaceholder: {
    width: 40,
  },
  imageContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 20,
  },
  descriptionContainer: {
    flex: 1,
    flexDirection: "column",
    marginTop: -30,
    padding: 15,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#ffffff",
    gap: 15,
    paddingBottom: 500,
  },
  packName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
  },
  productName: {
    fontSize: 20,
    fontWeight: "400",
    color: "#374151",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#158EFA",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  statValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  quantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    alignItems: "center",
  },
  quantityText: {
    flex: 1,
    fontSize: 18,
    color: "#374151",
  },
  price: {
    fontSize: 18,
    color: "#e74c3c",
    fontWeight: "bold",
  },
  footer: {
    width: "100%",
    flexDirection: "row",
    paddingTop: 10,
    justifyContent: "space-between",
    gap: 20,
  },
  totalText: {
    color: "#1F2937",
    fontWeight: "bold",
    fontSize: 18,
    alignSelf: "center",
    padding: 10,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#158EFA",
    padding: 2,
    borderRadius: 25,
  },
  buttonText: {
    flex: 1,
    textAlign: "center",
    color: "#ffffff",
    fontWeight: "600",
  },
  circle: {
    height: 39,
    width: 39,
    borderRadius: 50,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
});
