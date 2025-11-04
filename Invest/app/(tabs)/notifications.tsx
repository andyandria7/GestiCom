import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import API_BASE_URL from "@/constants/apiConfig";
import { apiFetch } from "@/utils/apiFetch";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: "success" | "warning" | "error" | "info";
  icon: string;
  status_icon: string;
  status_color: string;
  read: number; // 1 ou 0
  created_at: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/api/notifications/get`, {
        method: "GET",
      });
      if (!res) return;

      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur de chargement des notifications:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await apiFetch(
        `${API_BASE_URL}/api/notifications/markAllRead`,
        { method: "POST" }
      );
      if (!res) return;

      setNotifications((prev) =>
        Array.isArray(prev)
          ? prev.map((n) => ({ ...n, read: 1 }))
          : []
      );
    } catch (err) {
      console.error("Erreur lors du marquage comme lu:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 3000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => Number(n.read) === 0).length;

  return (
    <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>
            {unreadCount} nouvelle{unreadCount !== 1 ? "s" : ""} notification
            {unreadCount !== 1 ? "s" : ""}
          </Text>
        </View>
        <TouchableOpacity style={styles.markAllBtn} onPress={markAllAsRead}>
          <Text style={styles.markAllText}>Tout marquer comme lu</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#158EFA"
            style={{ marginTop: 50 }}
          />
        ) : notifications.length === 0 ? (
          <View style={styles.emptyBox}>
            <FontAwesome name="bell-o" size={40} color="#999" />
            <Text style={styles.emptyText}>Aucune notification</Text>
          </View>
        ) : (
          notifications.map((notif) => {

            return (
              <View
                key={notif.id}
                style={[
                  styles.notificationCard,
                  { backgroundColor: String(notif.read) === "1" ? "#e5e7ebff" : "#FFFFFF" },
                ]}
              >
                <View style={styles.iconWrapper}>
                  <FontAwesome
                    name={notif.icon as any}
                    size={30}
                    color='#158EFA'
                  />
                </View>

                <View style={styles.info}>
                  <Text style={styles.notifTitle}>{notif.title}</Text>
                  <Text style={styles.notifMessage}>{notif.message}</Text>
                  <Text style={styles.notifTime}>{notif.created_at}</Text>
                </View>

                <View style={{ alignSelf: "flex-start" }}>
                  <FontAwesome
                    name={notif.status_icon as any}
                    size={22}
                    color={notif.status_color}
                  />
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#1A1A1A" },
  subtitle: { fontSize: 14, color: "#6B7280", marginTop: 2 },
  markAllBtn: {
    borderColor: "#158EFA",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  markAllText: { color: "#158EFA", fontWeight: "600" },

  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  info: { flex: 1 },
  notifTitle: { fontSize: 15, fontWeight: "600", color: "#000000", marginBottom: 2 },
  notifMessage: { fontSize: 13, color: "#000000", marginBottom: 2 },
  notifTime: { fontSize: 12, color: "#000000" },

  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  emptyText: { marginTop: 10, color: "#777", fontSize: 15 },
});
