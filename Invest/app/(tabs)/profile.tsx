import Solde from "@/components/item/Solde";
import InfoProfils from "@/components/profils/InfoProfils";
import ProfileHeader from "@/components/profils/ProfileHeader";
import API_BASE_URL from "@/constants/apiConfig";
import { apiFetch } from "@/utils/apiFetch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type DecodedToken = {
  user?: {
    user_id: string | number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string | null;
    date_of_birth: string;
    role: string;
    profile_picture: string | null;
    CIN_picture: string | null;
    created_at: string;
    updated_at: string;
  };
  exp: number;
  iat: number;
  [key: string]: any;
};

type ProfileData = {
  first_name?: string;
  last_name?: string;
  number?: string;
  email?: string;
  birthDate?: string;
  profil?: string;
  imgCIN?: string;
  role?: string;
};

const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileData | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(0);
  const [userId, setUserId] = useState<number>(0);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      // console.log("Token récupéré :", token);
      if (!token) return;

      const decodedToken = jwtDecode<DecodedToken>(token);
      // console.log("Données décodées du token :", decodedToken);

      // Extraire l'ID de l'utilisateur
      const id = decodedToken.user_id;
      if (!id) {
        // console.log("ID utilisateur introuvable dans le token");
        return;
      } else {
        // console.log("ID utilisateur trouvé :", id);
      }

      setUserId(Number(id)); 

      if (decodedToken.user) {
        const tokenProfileData: ProfileData = {
          first_name: decodedToken.user.first_name || "",
          last_name: decodedToken.user.last_name || "",
          number: decodedToken.user.phone_number || "",
          email: decodedToken.user.email || "",
          birthDate: decodedToken.user.date_of_birth || "",
          role: decodedToken.user.role || "",
          profil: decodedToken.user.profile_picture
            ? decodedToken.user.profile_picture.startsWith("http")
              ? decodedToken.user.profile_picture
              : `${API_BASE_URL}/${decodedToken.user.profile_picture}`
            : undefined,
          imgCIN: decodedToken.user.CIN_picture
            ? decodedToken.user.CIN_picture.startsWith("http")
              ? decodedToken.user.CIN_picture
              : `${API_BASE_URL}/${decodedToken.user.CIN_picture}`
            : undefined,
        };

        // Mettre à jour immédiatement avec les données du token
        setProfileData(tokenProfileData);
      }

      const [resProfile, resWallet] = await Promise.all([
        apiFetch(`${API_BASE_URL}/api/users/edit/${id}`, {
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

      if(!resProfile || !resWallet) return;

      const data = await resProfile.json();
      const walletData = await resWallet.json();

      setWallet(walletData.wallet.balance);

      if (data.status && data.user) {
        const profileWithFullUrls = {
          ...data.user,
          // Map the API response fields to the expected profile structure
          first_name: data.user.first_name ,
          last_name: data.user.last_name,
          number: data.user.phone_number || data.user.number,
          email: data.user.email,
          birthDate: data.user.date_of_birth,
          role: data.user.role,
          profil: data.user.profile_picture
            ? data.user.profile_picture.startsWith("http")
              ? data.user.profile_picture
              : `${API_BASE_URL}/${data.user.profile_picture}`
            : null,
          imgCIN: data.user.CIN_picture
            ? data.user.CIN_picture.startsWith("http")
              ? data.user.CIN_picture
              : `${API_BASE_URL}/${data.user.CIN_picture}`
            : null,
        };
        setProfileData(profileWithFullUrls);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du profil :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const uploadCINImage = async (uri: string, userId: string) => {
    const formData = new FormData();
    formData.append("imgCIN", {
      uri,
      name: "cin.jpg",
      type: "image/jpeg",
    } as any);

    const response = await apiFetch(
      `${API_BASE_URL}/api/users/upload-cin-image/${userId}`,
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if(!response)return;
    const data = await response.json();
    return data.imageUrl;
  };

  const uploadImage = async (uri: string, userId: string) => {
    const formData = new FormData();
    formData.append("profileImage", {
      uri,
      name: "profile.jpg",
      type: "image/jpeg",
    } as any);

    const response = await apiFetch(
      `${API_BASE_URL}/api/users/upload-profile-image/${userId}`,
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if(!response)return;

    const data = await response.json();
    return data.imageUrl;
  };

  const handleImageUploaded = (url: string) => {
    const fullUrl = `${API_BASE_URL}/${url}`;
    setProfileData((prev) => (prev ? { ...prev, profil: fullUrl } : prev));
  };

  const handleCINUploaded = (url: string) => {
    const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}/${url}`;
    setProfileData((prev) => (prev ? { ...prev, imgCIN: fullUrl } : prev));
  };

  const handleProfileUpdated = () => {
    fetchProfile();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Header de profil */}
        <ProfileHeader
          name={profileData?.first_name + ' '+ profileData?.last_name || "Chargement..."}
          role={profileData?.role || "Chargement..."}
          imageUrl={profileData?.profil}
          uploadImage={async (uri: string) => {
            if (!userId) throw new Error("Utilisateur non connecté");
            return uploadImage(uri, String(userId));
          }}
          onImageUploaded={handleImageUploaded}
        />


        {/* Contenu principal */}
        <View style={styles.content}>
          <View style={styles.balanceContainer}>
            <Solde balance={Number(wallet)} />
          </View>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#14213D" />
            </View>
          ) : (
            <InfoProfils
              profile={profileData}
              userId={userId}
              uploadCINImage={uploadCINImage}
              onCINUploaded={handleCINUploaded}
              onProfileUpdated={handleProfileUpdated}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 100,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  imageLogo: {
    width: 80,
    height: 80,
  },
  balanceContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
});