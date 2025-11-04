import ButtonForm from "@/components/button/ButtonForm";
import InputField from "@/components/inputField/InputField";
import API_BASE_URL from "@/constants/apiConfig";
import { apiFetch } from "@/utils/apiFetch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { AlertCircle } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secure, setSecure] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");


  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    Animated.spring(titleScale, {
      toValue: 1,
      tension: 50,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, []);

const handleLogin = async () => {
  setLoading(true);
  setErrorMessage(""); 
  try {
    const url = `${API_BASE_URL}/api/users/login`;
    const response = await apiFetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response) return;

    const data = await response.json();
    if (data.status) {
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
        } else {
          router.replace("/(tabs)/marketplace");
        }
      } catch {
        setErrorMessage("Erreur lors de la lecture du token.");
      }
    } else {
      setErrorMessage(data.message || "Erreur lors de la connexion.");
    }
  } catch (error) {
    setErrorMessage("Une erreur s’est produite.");
  } finally {
    setLoading(false);
  }
};


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.Image
            source={require("@/assets/images/logo A4 in_7.png")}
            style={[
              styles.image,
              { opacity: fadeAnim, transform: [{ scale: titleScale }] },
            ]}
          />

          {errorMessage ? (
            <Animated.View style={styles.errorContainer}>
              <AlertCircle size={20} color="#e74c3c" style={{ marginRight: 8 }} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </Animated.View>
          ) : null}

          <InputField
            value={email}
            placeholder="Adresse mail"
            onChangeText={setEmail}
          />
          <InputField
            value={password}
            placeholder="Mot de passe"
            secureTextEntry={secure}
            onChangeText={setPassword}
            isPassword
            toggleVisibility={() => setSecure(!secure)}
          />

          <TouchableOpacity>
            <Text style={styles.forgot}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#6c5ce7"
              style={{ marginVertical: 20 }}
            />
          ) : (
            <ButtonForm text="Connexion" onPress={handleLogin} />
          )}

          <Text style={styles.signupText}>
            Vous n'avez pas de compte ?{" "}
            <Text
              style={styles.signupLink}
              onPress={() => router.push("/(auth)/register")}
            >
              Inscription
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    gap: 20,
  },
  forgot: {
    color: "#ee73219a",
    textAlign: "right",
  },
  signupText: {
    textAlign: "center",
    color: "#555",
  },
  signupLink: {
    color: "#ee7221",
    fontWeight: "bold",
  },
  image: {
    resizeMode: "contain",
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e74c3c",
    backgroundColor: "#fdecea",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 14,
    flexShrink: 1, 
  },

});
