import { useState, useEffect } from "react";
import {
ActivityIndicator,
FlatList,
StyleSheet,
Text,
View,
TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as NavigationBar from "expo-navigation-bar";
import { jwtDecode } from "jwt-decode";

import SearchBar from "@/components/item/SearchBar";
import Solde from "@/components/item/Solde";
import CardPackInvest from "@/components/marketplace/CardPackInvest";
import API_BASE_URL from "@/constants/apiConfig";
import { apiFetch } from "@/utils/apiFetch";

type PackInvest = {
pack_id: number;
image_url: string;
pack_name: string;
product_name: string;
quantity: number;
total_amount: number;
objective_quantity: number;
return_on_investment: number;
created_at: string;
reference: string;  
progress_percentage: number;
remaining_quantity: number;
};

export default function Index() {
const [filteredData, setFilteredData] = useState<PackInvest[]>([]);
const [searchQuery, setSearchQuery] = useState("");
const [packsInvest, setPacksInvest] = useState<PackInvest[]>([]);
const [wallet, setWallet] = useState<number>(0);
const [loading, setLoading] = useState<boolean>(true);
const [role, setRole] = useState<string>("");
const [filter, setFilter] = useState<string>("all");

useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
}, []);

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
    const [resPacksInvest, resWallet] = await Promise.all([
        apiFetch(`${API_BASE_URL}/api/investments/list`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        }),
        apiFetch(`${API_BASE_URL}/api/wallets/show`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        }),
    ]);

    if (!resPacksInvest || !resWallet) return;

    const packsInvestData = await resPacksInvest.json();
    const walletData = await resWallet.json();

    const packsWithProgress = packsInvestData.map((p: PackInvest) => ({
        ...p,
        progress: p.progress_percentage,
    }));

    setPacksInvest(packsWithProgress);
    setWallet(walletData.wallet.balance || 0);
    } catch (error) {
    console.error("Erreur marketplace:", error);
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

    const filtered = packsInvest.filter(
    (item) =>
        item.pack_name.toLowerCase().includes(lowerQuery) ||
        item.product_name.toLowerCase().includes(lowerQuery) ||
        item.reference.toLowerCase().includes(lowerQuery)
    );
    setFilteredData(filtered);
};

const applyFilter = (data: PackInvest[]) => {
    switch (filter) {
    case "+25":
        return data.filter((item) => (item.progress_percentage ?? 0) >= 25);
    case "+50":
        return data.filter((item) => (item.progress_percentage ?? 0) >= 50);
    case "+75":
        return data.filter((item) => (item.progress_percentage ?? 0) >= 75);
    default:
        return data;
    }
};

const renderPackInvestItem = ({ item }: { item: PackInvest }) => (
    <CardPackInvest
    quantity={item.quantity}
    image_url={item.image_url}
    pack_name={item.pack_name}
    product_name={item.product_name}
    total_amount={item.total_amount}
    return_on_investment={item.return_on_investment}
    progress_percentage={item.progress_percentage}
    created_at={item.created_at}
    objective_quantity={item.objective_quantity}
    remaining_quantity={item.remaining_quantity}
    />
);

if (loading)
    return (
    <View style={styles.activity}>
        <ActivityIndicator size="large" color="blue" />
    </View>
    );

const baseData = searchQuery ? filteredData : packsInvest;
const finalData = applyFilter(baseData);

return (
    <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
    <FlatList
        data={finalData}
        keyExtractor={(item) => item.reference.toString()}
        renderItem={renderPackInvestItem}
        ListEmptyComponent={
        <Text style={styles.emptyText}>
            {searchQuery
            ? "Aucun résultat pour cette recherche."
            : "Aucun investissement en cours."}
        </Text>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollable}
        ListHeaderComponent={
        <>
            <View style={styles.header}>
            <Text style={styles.headerTitle}>Investissements en cours</Text>
            <View style={styles.headerUnderline} />
            </View>

            <View style={styles.searchFilterRow}>
            <View style={{ flex: 1 }}>
                <SearchBar
                onSearch={handleSearch}
                placeholder="Rechercher un Pack"
                />
            </View>
            </View>

            <View style={styles.filterRow}>
            <TouchableOpacity
                style={[
                styles.filterBtn,
                filter === "all" && styles.filterBtnActive,
                ]}
                onPress={() => setFilter("all")}
            >
                <Text
                style={[
                    styles.filterBtnText,
                    filter === "all" && styles.filterBtnTextActive,
                ]}
                >
                Tous
                </Text>
            </TouchableOpacity>
            {["+25", "+50", "+75"].map((val) => (
                <TouchableOpacity
                key={val}
                style={[
                    styles.filterBtn,
                    filter === val && styles.filterBtnActive,
                ]}
                onPress={() => setFilter(val)}
                >
                <Text
                    style={[
                    styles.filterBtnText,
                    filter === val && styles.filterBtnTextActive,
                    ]}
                >
                    {val}%
                </Text>
                </TouchableOpacity>
            ))}
            </View>
        </>
        }
    />
    </SafeAreaView>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    marginHorizontal: 10,
    gap: 15,
},
scrollable: {
    paddingBottom: 100,
    gap: 10,
},
header: {
    alignItems: "center",
    marginBottom: 20,
},
headerTitle: {
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
    alignItems: "center",
},
searchFilterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
},
filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
},
filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#158EFA",
    backgroundColor: "#158EFA20",
},
filterBtnActive: {
    backgroundColor: "#158EFA",
},
filterBtnText: {
    color: "#158EFA",
    fontWeight: "500",
    fontSize: 14,
},
filterBtnTextActive: {
    color: "#fff",
    fontWeight: "600",
},
emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 20,
},
});
