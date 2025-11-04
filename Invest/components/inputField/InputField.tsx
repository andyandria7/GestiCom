import { Feather, Ionicons } from "@expo/vector-icons";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface InputFieldProps {
  label?: string;
  onFocus?: () => void;
  value: string;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  onChangeText: (text: string) => void;
  toggleVisibility?: () => void;
  isPassword?: boolean;
  secureTextEntry?: boolean;
  isNumber?: "numeric";
  editable?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

function InputField({
  label,
  onFocus,
  value,
  placeholder,
  style,
  onChangeText,
  isPassword,
  toggleVisibility,
  secureTextEntry,
  isNumber,
  editable = true,
  icon,
  autoCapitalize = "none",
}: InputFieldProps) {

  // ✅ Fonction pour formater les numéros
  const formatPhoneNumber = (num: string) => {
    if (!num) return "";
    const cleaned = num.replace(/\D/g, ""); // garder que les chiffres
    const match = cleaned.match(/^(\d{0,3})(\d{0,2})(\d{0,3})(\d{0,2})$/);
    if (!match) return cleaned;
    return [match[1], match[2], match[3], match[4]].filter(Boolean).join(" ");
  };

  // ✅ Gestion de la saisie
  const handleChangeText = (text: string) => {
    if (isNumber === "numeric") {
      const formatted = formatPhoneNumber(text);
      onChangeText(formatted);
    } else {
      onChangeText(text);
    }
  };

  return (
    <View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.container, style]}>
        {icon && (
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={20} color="#333" />
          </View>
        )}

        <TextInput
          value={value}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          placeholderTextColor="#555"
          style={styles.input}
          onChangeText={handleChangeText}
          keyboardType={isNumber ? "numeric" : "default"}
          editable={editable}
          onFocus={onFocus}
          autoCapitalize={autoCapitalize}
        />

        {isPassword && (
          <TouchableOpacity onPress={toggleVisibility} style={styles.icon}>
            <Feather
              name={secureTextEntry ? "eye-off" : "eye"}
              size={20}
              color="#333"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default InputField;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#000",
    backgroundColor: "#f0f1f6",
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  iconContainer: {
    paddingHorizontal: 6,
  },
  label: {
    fontSize: 15,
    color: "#333",
    marginBottom: 5,
  },
  icon: {
    paddingHorizontal: 6,
  },
});
