import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type RoleType = "investor" | "commercial";

interface RoleSelectorProps {
  selected: RoleType | "";
  onSelect: (role: RoleType) => void;
}

const roles: { type: RoleType; title: string; description: string; icon: any; iconColor: string }[] = [
  {
    type: "investor",
    title: "Investisseur",
    description: "Vous cherchez à investir dans des opportunités",
    icon: "trending-up",
    iconColor: "#4CAF50",
  },
  {
    type: "commercial",
    title: "Commercial",
    description: "Vous proposez des opportunités d'investissement",
    icon: "briefcase",
    iconColor: "#FF9800",
  },
];

const RoleSelector: React.FC<RoleSelectorProps> = ({ selected, onSelect }) => (
  <View>
    {roles.map((role) => {
      const isSelected = selected === role.type;
      return (
        <TouchableOpacity
          key={role.type}
          style={[styles.card, isSelected && styles.selectedCard]}
          onPress={() => onSelect(role.type)}
          activeOpacity={0.8}
        >
          <View style={[styles.iconContainer, { backgroundColor: role.iconColor + "20" }]}> 
            <Ionicons name={role.icon} size={28} color={role.iconColor} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, isSelected && styles.selectedTitle]}>{role.title}</Text>
            <Text style={[styles.description, isSelected && styles.selectedDescription]}>
              {role.description}
            </Text>
          </View>
          {isSelected && (
            <Ionicons name="checkmark-circle" size={24} color="#007AFF" style={{ marginLeft: 8 }} />
          )}
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  selectedCard: {
    borderColor: "#007AFF",
    backgroundColor: "#F8FAFF",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
  },
  selectedTitle: {
    color: "#007AFF",
  },
  description: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  selectedDescription: {
    color: "#005BB5",
  },
});

export default RoleSelector; 