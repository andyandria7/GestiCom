import SearchBar from "@/components/item/SearchBar";
import Solde from "@/components/item/Solde";
import CardPack from "@/components/marketplace/CardPack";
import CardPackInvest from "@/components/marketplace/CardPackInvest";
import API_BASE_URL from "@/constants/apiConfig";
import { apiFetch } from "@/utils/apiFetch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as NavigationBar from "expo-navigation-bar";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";


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

type PackInvest = {
  pack_id: number;
  image_url: string;
  pack_name: string;
  product_name: string;
  quantity: number;
  total_amount: number;
  objective_quantity:number;
  return_on_investment:number;
  progress_percentage:number;
  remaining_quantity:number;
  created_at: string;
  reference: string;
};
export default function Index() {
  const [filteredData, setFilteredData] = useState<Pack[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [packs, setPacks] = useState<Pack[]>([]);
  const [packsInvest, setPacksInvest] = useState<PackInvest[]>([]);
  const [wallet, setWallet] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [role, setRole] = useState<string>("");
  
  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      let userRole = "";
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          userRole = decoded?.user?.role || "";
          setRole(userRole);
          
        } catch (e) {
          console.error("Erreur lors du décodage du token:", e);
        }
      }
      const [resPacks, resPacksInvest, resWallet] = await Promise.all([
        apiFetch(`${API_BASE_URL}/api/packs/list`),
        apiFetch(`${API_BASE_URL}/api/investments/list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }),
        apiFetch(`${API_BASE_URL}/api/wallets/show`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }),
      ]);

      if(!resPacks || !resPacksInvest || !resWallet) return;

      const packsData = await resPacks.json();
      const packsInvestData = await resPacksInvest.json();
      const walletData = await resWallet.json();

      setPacks(packsData); 
      setFilteredData(packsData);
      setPacksInvest(packsInvestData);
      setWallet(walletData.wallet.balance || 0);

    } catch (error) {
      console.error("Erreur marketplace:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
  });
    
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

    const filtered = packs.filter(
      (item) =>
        item.pack_name.toLowerCase().includes(lowerQuery) ||
        item.product_name.toLowerCase().includes(lowerQuery)
    );
    setFilteredData(filtered);
  };

  const handlePress = (product_id: number) => {
    if (role === "commercial") {
      router.push({
        pathname: "/customer/client",
        params: { product_id: product_id.toString() },
      });
    } else {
      router.push({
        pathname: "../marketplace/details/[product_id]",
        params: { product_id: product_id.toString() },
      });
    }
  };

  const handlePressInvest = (pack_id: number) => {
    router.push({
      pathname: "../marketplace/investment/[pack_id]",
      params: { pack_id: pack_id.toString() },
    });
  };


  const renderPackItem = ({ item }: { item: Pack }) => (
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
  );

  const renderPackInvestItem = ({ item }: { item: PackInvest }) => (
    <CardPackInvest
      quantity={item.quantity}
      image_url={item.image_url}
      pack_name={item.pack_name}
      product_name={item.product_name}
      total_amount={item.total_amount}
      return_on_investment={item.return_on_investment}
      created_at={item.created_at} 
      objective_quantity={item.objective_quantity} 
      remaining_quantity={item.remaining_quantity} 
      progress_percentage={item.progress_percentage}    />
  );
  const insets = useSafeAreaInsets();
  if (loading) return <View style={styles.activity}>
      <ActivityIndicator size="large" color="blue" />
    </View>
  return (
  <SafeAreaView style={styles.container} edges={["top", "right","left"]}>
    <Solde balance={Number(wallet)} />
    <SearchBar onSearch={handleSearch} placeholder="Rechercher un Pack" />
    <FlatList
      data={packsInvest} 
      keyExtractor={(item) => item.reference.toString()}
      renderItem={renderPackInvestItem}
      ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: '#6B7280' }}>Aucun investissement en cours.</Text>}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollable}
      ListHeaderComponent={
        <>

          <View style={styles.title}>
            <Text style={styles.textTitle}>Suggestions de Packs</Text>           
            <TouchableOpacity style={styles.buttonSeeAllText} onPress={() => router.push({pathname:'/marketplace/packs/SuggestionsPacks'})}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.pack_id.toString()}
            renderItem={renderPackItem}
            ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: '#6B7280' }}>Aucun pack disponible.</Text>}
            horizontal
            showsHorizontalScrollIndicator={false}
          />

          <View style={styles.title}>
            <Text style={styles.textTitle}>Investissement en cours</Text>
            <TouchableOpacity  style={styles.buttonSeeAllText} onPress={() => router.push({pathname:'/(tabs)/investments'})}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>
        </>
      }
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
  scrollable:{
    flexDirection: 'column',
    paddingBottom:100,
    gap: 5,
  },
  title: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3',
    paddingVertical: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  textTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A1A' },
  buttonSeeAllText: {
    borderWidth: 1,
    backgroundColor:'#158EFA10',
    borderColor:'#158EFA',
    borderRadius:5,
    padding: 5,
  },
  seeAllText:{
    color:'#158EFA'
  },
  activity:{
    flex:1,
    justifyContent:'center',
    alignItems: 'center'
  }, 
  searchResultList: {
    width: "100%",
    marginTop: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  imageLogo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  balanceContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
});
