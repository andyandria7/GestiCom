import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  label: string;
  value: string;
  onChange: (date: string) => void;
  error?: string | null;
}

const DateTimePickerField: React.FC<Props> = ({ label, value, onChange, error }) => {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");
  const [tempDate, setTempDate] = useState<Date>(new Date());

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShow(false);
      return;
    }
    if (selectedDate) {
      setTempDate(selectedDate);
      if (mode === "date") {
        // Ensuite afficher le sélecteur d’heure
        setMode("time");
      } else {
        setShow(false);
        setMode("date");

        const formatted = `${selectedDate.getFullYear()}-${String(
          selectedDate.getMonth() + 1
        ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(
          2,
          "0"
        )} ${String(selectedDate.getHours()).padStart(2, "0")}:${String(
          selectedDate.getMinutes()
        ).padStart(2, "0")}:00`;

        onChange(formatted);
      }
    }
  };

  const openPicker = () => {
    setShow(true);
    setMode("date");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={openPicker} style={styles.inputWrapper}>
        <Ionicons
          name="calendar-outline"
          size={20}
          color="#666"
          style={{ marginRight: 8 }}
        />
        <Text style={value ? styles.valueText : styles.placeholder}>
          {value || "Choisissez la date et l'heure"}
        </Text>
      </Pressable>
      {error && <Text style={styles.errorText}>{error}</Text>}

      {show && (
        <DateTimePicker
          value={tempDate}
          mode={mode}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          is24Hour={true}
          onChange={handleChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e1e5e9",
    paddingVertical: 14,
    paddingHorizontal: 12,
    elevation: 2,
  },
  placeholder: {
    color: "#999",
    fontSize: 16,
  },
  valueText: {
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5,
  },
});

export default DateTimePickerField;
