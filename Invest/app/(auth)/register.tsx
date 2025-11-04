import ButtonForm from "@/components/button/ButtonForm";
import InputField from "@/components/inputField/InputField";
import BackArrow from "@/components/item/BackArrow";
import RoleSelector, { RoleType } from "@/components/item/RoleSelector";
import API_BASE_URL from "@/constants/apiConfig";
import { apiFetch } from "@/utils/apiFetch";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Register() {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<RoleType | "">("");
  const [secure, setSecure] = useState(true);
  const [secureConff, setSecureConff] = useState(true);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(titleScale, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []); 


  const isStep1Valid =
    firstName.trim() && lastName.trim() && email.trim() && birthDate !== null;
  const isStep2Valid =
    password.trim() && confirmPassword.trim() && password === confirmPassword;
  const isStep3Valid = role.trim();

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShow(false);
    }

    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
      setBirthDate(selectedDate);
    }
  };

  const showDatePicker = () => {
    setShow(true);
  };

  const handleNext = () => {
    if (step === 1 && isStep1Valid) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        Alert.alert("Erreur", "Veuillez entrer une adresse email valide");
        return;
      }
      setStep(2);
    } else if (step === 2 && isStep2Valid) {
      if (password.length < 6) {
        Alert.alert(
          "Erreur",
          "Le mot de passe doit contenir au moins 6 caractères."
        );
        return;
      }
      setStep(3);
    }
  };

  const handleRegister = async () => {
    const payload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim().toLowerCase(),
      password,
      date_of_birth: birthDate?.toISOString().split("T")[0],
      role,
      confirm_password: password,
      number: "",
    };
  
    try {
      const response = await apiFetch(`${API_BASE_URL}/api/users/create`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!response) return;
      
      const data = await response.json();
  
      if (data.status) {
        if (data.token) {
          await AsyncStorage.setItem("token", data.token);
          const token = await AsyncStorage.getItem("token");
      
          if (!token) {
            router.replace("/(auth)/login");
            return;
          }
      
          try {
            const decoded: any = jwtDecode(token);
            const role = decoded?.user?.role || "default";
      
            if (role === "commercial") {
              router.replace("/(tabs)/list");
              console.log(decoded);
            } else {
              router.replace("/(tabs)/marketplace");
            }
          } catch (err) {
            router.replace("/(auth)/login");
          }
        } else {
          Alert.alert("Erreur", "L'email est deja utilisé.");
          router.replace("/(auth)/login");
        }
      } else {
        Alert.alert("Erreur", data.message || "Erreur d'inscription");
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de contacter le serveur.");
      console.error("Register error:", error);
    }
  };
  

return (
  <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Inscription</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.Image
          source={require("@/assets/images/logo A4 in_7.png")}
          style={[
            styles.image,
            { opacity: fadeAnim, transform: [{ scale: titleScale }] },
          ]}
          resizeMode="contain"
        />

        <View style={styles.form}>
          {step === 1 && (
            <View style={styles.inputContainer}>
              <InputField
                placeholder="Nom"
                value={firstName}
                onChangeText={setFirstName}
              />
              <InputField
                placeholder="Prénom"
                value={lastName}
                onChangeText={setLastName}
              />
              <InputField
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
              <TouchableOpacity
                onPress={showDatePicker}
                style={styles.inputField}
              >
                <Text style={{ color: "#333" }}>
                  {birthDate
                    ? birthDate.toLocaleDateString()
                    : "Date de naissance"}
                </Text>
              </TouchableOpacity>

              {Platform.OS === "ios" ? (
                show && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="spinner"
                    onChange={onChange}
                    maximumDate={new Date()}
                  />
                )
              ) : (
                <Modal visible={show} transparent animationType="slide">
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="spinner"
                    onChange={onChange}
                    maximumDate={new Date()}
                  />
                </Modal>
              )}

              <ButtonForm
                style={[styles.submitButton, !isStep1Valid && { opacity: 0.5 }]}
                onPress={handleNext}
                disabled={!isStep1Valid}
                text="Suivant"
              />
            </View>
          )}

          {step === 2 && (
            <View style={styles.inputContainer}>
              <InputField
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secure}
                isPassword
                toggleVisibility={() => setSecure(!secure)}
              />
              <InputField
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={secureConff}
                isPassword
                toggleVisibility={() => setSecureConff(!secureConff)}
              />
              <ButtonForm
                style={[styles.submitButton, !isStep2Valid && { opacity: 0.5 }]}
                onPress={handleNext}
                disabled={!isStep2Valid}
                text="Suivant"
              />
            </View>
          )}

          {step === 3 && (
            <View style={styles.select}>
              <RoleSelector
                selected={role}
                onSelect={(value: RoleType) => setRole(value)}
              />
              <ButtonForm
                style={[styles.submitButton, !isStep3Valid && { opacity: 0.5 }]}
                onPress={handleRegister}
                disabled={!isStep3Valid}
                text="Valider"
              />
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
);

}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    zIndex: 10,
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
  form: {
    width: "100%",
  },
  inputContainer: {
    gap: 20,
  },
  inputField: {
    padding: 15,
    backgroundColor: "#f0f1f6",
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  submitButton: {
    backgroundColor: "#339af0",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  select: {
    marginTop: 50,
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
    resizeMode: "contain",
  },
});