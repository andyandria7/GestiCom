import API_BASE_URL from "@/constants/apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import InputField from "../inputField/InputField";
import ImageCIN from "./ImageCIN";
import { apiFetch } from "@/utils/apiFetch";

type ProfileData = {
  first_name?: string;
  last_name?: string;
  number?: string;
  phone_number?: string;
  email?: string;
  birthDate?: string;
  date_of_birth?: string;
  imgCIN?: string;
};

interface InfoProfilsProps {
  profile?: ProfileData;
  userId?: number;
  uploadCINImage?: (uri: string, userId: string) => Promise<string>;
  onCINUploaded?: (url: string) => void;
  onProfileUpdated?: () => void;
}

const InfoProfils = ({
  profile,
  userId,
  uploadCINImage,
  onCINUploaded,
  onProfileUpdated,
}: InfoProfilsProps) => {
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [number, setnumber] = React.useState("");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [secureConff, setSecureConff] = useState(true);
  const [secureNew, setSecureNew] = useState(true);
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
  if (profile) {
    setName(profile.first_name || "");      
    setUsername(profile.last_name || "");   
    setnumber(profile.phone_number || "");
    setEmail(profile.email || "");
    if (profile.birthDate || profile.date_of_birth) {
      const dateString = profile.birthDate || profile.date_of_birth;
      if (dateString) {
        const d = new Date(dateString);
        setBirthDate(d);
        setDate(d);
      }
    }
  }
}, [profile]);


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

  const handleUpdateProfile = async () => {
    if (!userId) {
      Alert.alert("Erreur", "ID utilisateur manquant");
      return;
    }

    setIsUpdating(true);

    try {
      const token = await AsyncStorage.getItem("token"); 

      if (!token) {
        Alert.alert("Erreur", "Token d'authentification manquant");
        return;
      }

      // Validation...
      if (!name.trim() || !username.trim() || !number.trim() || !email.trim()) {
        Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert("Erreur", "Veuillez entrer une adresse email valide");
        return;
      }

      const wantsToChangePassword = password || newPassword || confirmPassword;

      if (wantsToChangePassword) {
        if (!password || !newPassword || !confirmPassword) {
          Alert.alert(
            "Erreur",
            "Veuillez remplir tous les champs de mot de passe"
          );
          return;
        }
        if (newPassword !== confirmPassword) {
          Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
          return;
        }
      }

      const updateData: any = {
        first_name: name.trim(),
        last_name: username.trim(),
        phone_number: number.trim(),
        email: email.trim(),
        date_of_birth: birthDate ? birthDate.toISOString().split("T")[0] : null,
      };

      if (wantsToChangePassword) {
        updateData.password = password;
        updateData.new_password = newPassword;
        updateData.confirm_password = confirmPassword;
      }

      const response = await apiFetch(
        `${API_BASE_URL}/api/users/update/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
          body: JSON.stringify(updateData),
        }
      );
      if(!response)return;
      const json = await response.json();

      if (!json.status) {
        Alert.alert("Erreur", json.message || "Une erreur est survenue");
        setIsUpdating(false);
        return;
      }

      Alert.alert("Succès", "Profil mis à jour avec succès !");
      

      if (response.ok && json.status) {
        Alert.alert("Succès", "Profil mis à jour avec succès");

        setPassword("");
        setNewPassword("");
        setConfirmPassword("");

        if (onProfileUpdated) {
          onProfileUpdated();
        }
      } else {
        Alert.alert("Erreur", json.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      Alert.alert("Erreur", "Erreur de connexion. Veuillez réessayer.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setName(profile.first_name || "");
      setUsername(profile.last_name || "");
      setnumber(profile.phone_number || "");
      setEmail(profile.email || "");
      if (profile.birthDate) {
        const d = new Date(profile.birthDate);
        setBirthDate(d);
        setDate(d);
      }
    }

    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      router.replace("/(auth)/login");
    } catch (e) {
      Alert.alert("Erreur", "Une erreur est survenue lors de la déconnexion.");
    }
  };
  return (
      <View>
        <Text style={styles.text}>Informations sur votre compte</Text>
        <View style={{gap:20}}>
          <InputField
            label="Nom"
            placeholder="Nom"
            value={name}
            onChangeText={(text) => setName(text)}
            style={styles.input}
          />
          <InputField
            label="Prénom"
            placeholder="Prénom"
            value={username}
            onChangeText={(text) => setUsername(text)}
            style={styles.input}
          />
          <InputField
            label="Numéro"
            placeholder="Numéro"
            value={number}
            onChangeText={(text) => setnumber(text)}
            style={styles.input}
          />
          <InputField
            label="Email"
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />

          <View>
            <Text>Date de naissance</Text>
            <TouchableOpacity
              onPress={showDatePicker}
              style={[styles.inputField, { padding: 12}]}
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
              <Modal visible={show} transparent={true} animationType="slide">
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="spinner"
                      onChange={onChange}
                      maximumDate={new Date()}
                    />
                    {/* <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShow(false)}
                >
                  <Text style={styles.modalButtonText}>Fermer</Text>
                </TouchableOpacity> */}
                  </View>
                </View>
              </Modal>
            )}
          </View>

          <ImageCIN
            userId={userId || 0}
            onUploaded={onCINUploaded || (() => {})}
            uploadCINImage={uploadCINImage || (async () => "")}
            existingImageUrl={profile?.imgCIN}
          />
        </View>
        <View >
          <Text style={styles.text}>Changer de mot de passe</Text>
          <View style={{gap:20}}>
            <InputField
              label="Ancien mot de passe"
              placeholder="Ancien mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secure}
              isPassword
              toggleVisibility={() => setSecure(!secure)}
              style={styles.input}
            />
            <InputField
              label="Nouveau mot de passe"
              placeholder="Nouveau mot de passe"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={secureNew}
              isPassword
              toggleVisibility={() => setSecureNew(!secureNew)}
              style={styles.input}
            />
            <InputField
              label="Confirmer le nouveau mot de passe"
              placeholder="Confirmer le nouveau mot de passe"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={secureConff}
              isPassword
              toggleVisibility={() => setSecureConff(!secureConff)}
              style={styles.input}
            />
          </View>
        </View>
        <View style={styles.validButton}>
          <TouchableOpacity
            onPress={handleUpdateProfile}
            disabled={isUpdating}
            style={[styles.updateButton, isUpdating && styles.disabledButton]}
          >
            <Text style={styles.validButtonText}>
              {isUpdating ? "Mise à jour..." : "Enregistrer les modifications"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
};

export default InfoProfils;

const styles = StyleSheet.create({
  input: {
  },
  text: {
    width:'100%',
    textAlign: 'center',
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
    padding: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  inputField: {
    backgroundColor: "#f0f1f6",
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "black",
  },
  validButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  validButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  updateButton: {
    backgroundColor: "#158EFA",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#E53935",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
