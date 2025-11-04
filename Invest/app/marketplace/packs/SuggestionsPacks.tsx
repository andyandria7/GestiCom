import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, ActivityIndicator, Dimensions, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "@/constants/apiConfig";
import CardPack from "@/components/marketplace/CardPack";
import Solde from "@/components/item/Solde";
import SearchBar from "@/components/item/SearchBar";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { SafeAreaView } from "react-native-safe-area-context";
import BackArrow from "@/components/item/BackArrow";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { apiFetch } from "@/utils/apiFetch";
import { ArrowLeft, ChevronLeft, Filter } from "lucide-react-native";

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

export default function SuggestionsPacks() {
const [packs, setPacks] = useState<Pack[]>([]);
const [filteredData, setFilteredData] = useState<Pack[]>([]);
const [searchQuery, setSearchQuery] = useState("");
const [loading, setLoading] = useState(true);
const [wallet, setWallet] = useState(0);
const [role, setRole] = useState("");


  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const decoded: any = jwtDecode(token);
        setRole(decoded?.user?.role || "");
      }

      const [resPacks,resWallet] = await Promise.all([
        apiFetch(`${API_BASE_URL}/api/packs/list`),
        apiFetch(`${API_BASE_URL}/api/wallets/show`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      if(!resPacks || !resWallet) return;

      const packsData = await resPacks.json();
      const walletData = await resWallet.json();
      setPacks(packsData);
      setFilteredData(packsData);
      setWallet(walletData.wallet.balance || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchData();

      const interval = setInterval(() => {
      fetchData();
      }, 1000);

      return () => clearInterval(interval);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const lowerQuery = query.toLowerCase();
    setFilteredData(
      packs.filter(
        (p) =>
          p.pack_name.toLowerCase().includes(lowerQuery) ||
          p.product_name.toLowerCase().includes(lowerQuery)
      )
    );
  };

  const handlePress = (product_id: number) => {
    router.push({
      pathname:
        role === "commercial"
          ? "/customer/client"
          : "/marketplace/details/[product_id]",
      params: { product_id: product_id.toString() },
    });
  };

  const handlePressInvest = (pack_id: number) => {
    router.push({
      pathname: "/marketplace/investment/[pack_id]",
      params: { pack_id: pack_id.toString() },
    });
  };

  const renderPackItem = ({ item }: { item: Pack }) => {
    const screenWidth = Dimensions.get("window").width;
    const itemWidth = (screenWidth-10) / 2;

    return (
      <View style={{ width: itemWidth, marginBottom: 15 }}>
        <CardPack
          product_id={item.product_id}
          image_url={item.image_url}
          pack_name={item.pack_name}
          product_name={item.product_name}
          min_investment={Number(item.min_investment)}
          return_on_investment={item.return_on_investment}
          available={item.objective_quantity}
          onPress={() => handlePress(item.product_id)}
          onPressInvest={() => handlePressInvest(item.pack_id)}
          role={role}
        />
      </View>
    );
  };

  if (loading)
    return (
      <View style={styles.activity}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );

  return (

    <SafeAreaView style={styles.container} edges={["top", "right","left"]}>
        <FlatList
            data={filteredData}
            keyExtractor={(item) => item.pack_id.toString()}
            renderItem={renderPackItem}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                  {searchQuery
                  ? "Aucun résultat pour cette recherche."
                  : "Aucun investissement en cours."}
              </Text>
              }
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListHeaderComponent={
            <>
                <View style={styles.header}>
                    <TouchableOpacity style={{position: "absolute", left: 0, padding: 10,backgroundColor: '#ffffff', borderRadius: 100}} onPress={()=>router.back()}>
                      <ChevronLeft size={20}/>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Suggestions de packs</Text>
                    <View style={styles.headerUnderline} />
                </View>
                <View style={{ flex: 1, marginBottom:20}}>
                    <SearchBar onSearch={handleSearch} placeholder="Rechercher un Pack" />
                </View> 
            </>}
          />
        </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
  container: {     
    flex:1,
    flexDirection: 'column',
    marginHorizontal:10,
    gap: 15,
  },  
  backArrow:{
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    zIndex: 10000
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    width: '100%',
    fontSize: 24,
    fontWeight: "700",
    color: "#158EFA",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  headerUnderline: {
    marginTop: 6,
    height: 3,
    width: 60,
    borderRadius: 2,
    backgroundColor: "#158EFA",
  },
  activity: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 20,
  },
});
