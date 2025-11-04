import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Tabs, usePathname } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function TabLayout() {
  const windowWidth = Dimensions.get("window").width;
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const loadRole = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          router.replace("/(auth)/login");
          return;
        }
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
  },[]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#158EFA" />
      </View>
    );
  }

  const tabBarHeight = 72;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 16,
          right: 16,
          height: tabBarHeight,
          backgroundColor: "white",
          elevation: 0,
          justifyContent: "space-around",
          alignItems: "center",
        },
      }}
    >
      <Tabs.Screen
        name="marketplace"
        options={{
          href: role === "commercial" ? null : undefined,
          tabBarIcon: ({ focused}) => (
            <View style = {{
              alignItems: 'center',
              paddingTop: 10,
              width:windowWidth/5
            }}>
              <Ionicons
                name={focused ? "home": "home-outline"}
                color = {focused ? "#158EFA": "gray"}
                size = {24}
              />
              <Text style = {{
                color: focused ? "#158EFA": "gray",
                fontSize: 10,
                marginTop: 4,
                width: "100%",
                textAlign: "center"
              }}>Marketplace</Text>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="wallet"
        options={{
          href: role === "commercial" ? null : undefined,
          tabBarIcon: ({ focused}) => (
            <View style = {{
              alignItems: 'center',
              paddingTop: 10,
              width:windowWidth/5
            }}>
              <Ionicons
                name={focused ? "cash": "cash-outline"}
                color = {focused ? "#158EFA": "gray"}
                size = {24}
              />
              <Text style = {{
                color: focused ? "#158EFA": "gray",
                fontSize: 10,
                marginTop: 4,
                width: "100%",
                textAlign: "center"
              }}>Transactions</Text>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="list"
        options={{
          href: role === "commercial" ? undefined : null,
          tabBarIcon: ({ focused}) => (
            <View style = {{
              alignItems: 'center',
              paddingTop: 10,
              width:windowWidth/5
            }}>
              <Ionicons
                name={focused ? "home": "home-outline"}
                color = {focused ? "#158EFA": "gray"}
                size = {24}
              />
              <Text style = {{
                color: focused ? "#158EFA": "gray",
                fontSize: 10,
                marginTop: 4,
                width: "100%",
                textAlign: "center"
              }}>Produits</Text>
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            if (role === "commercial") {
              e.preventDefault();
              router.navigate("/(tabs)/list");
            }
          },
        }}
      />

      <Tabs.Screen
        name="deliveries"
        options={{
          href: role === "commercial" ? undefined : null,
          tabBarIcon: ({ focused}) => (
            <View style = {{
              alignItems: 'center',
              paddingTop: 10,
              width:windowWidth/5
            }}>
              <Ionicons
                name={focused ? "cube": "cube-outline"}
                color = {focused ? "#158EFA": "gray"}
                size = {24}
              />
              <Text style = {{
                color: focused ? "#158EFA": "gray",
                fontSize: 10,
                marginTop: 4,
                width: "100%",
                textAlign: "center"
              }}>Livraisons</Text>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="listClient"
        options={{
          href: role === "commercial" ? undefined : null,
          tabBarIcon: ({ focused}) => (
            <View style = {{
              alignItems: 'center',
              paddingTop: 10,
              width:windowWidth/5
            }}>
              <Ionicons
                name= "add"
                color = {focused ? "#158EFA": "gray"}
                size = {24}
              />
              <Text style = {{
                color: focused ? "#158EFA": "gray",
                fontSize: 10,
                marginTop: 4,
                width: "100%",
                textAlign: "center"
              }}>Clients</Text>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="investments"
        options={{
          href: role === "investor" ? undefined : null,
          tabBarIcon: ({ focused}) => (
            <View style = {{
              alignItems: 'center',
              paddingTop: 10,
              width:windowWidth/5
            }}>
              <Ionicons
                name= "trending-up"
                color = {focused ? "#158EFA": "gray"}
                size = {24}
              />
              <Text style = {{
                color: focused ? "#158EFA": "gray",
                fontSize: 10,
                marginTop: 4,
                width: "100%",
                textAlign: "center"
              }}>Investissements</Text>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
        tabBarIcon: ({ focused}   ) => (
            <View style = {{
              alignItems: 'center',
              paddingTop: 10,
              width:windowWidth/5
            }}>
              <Ionicons
                name={focused ? "notifications": "notifications-outline"}
                color = {focused ? "#158EFA": "gray"}
                size = {24}
              />
              <Text style = {{
                color: focused ? "#158EFA": "gray",
                fontSize: 10,
                marginTop: 4,
                width: "100%",
                textAlign: "center"
              }}>Notifications</Text>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
        tabBarIcon: ({ focused}) => (
            <View style = {{
              alignItems: 'center',
              paddingTop: 10,
              width:windowWidth/5
            }}>
              <Ionicons
                name={focused ? "person": "person-outline"}
                color = {focused ? "#158EFA": "gray"}
                size = {24}
              />
              <Text style = {{
                color: focused ? "#158EFA": "gray",
                fontSize: 10,
                marginTop: 4,
                width: "100%",
                textAlign: "center"
              }}>Profil</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

});
