import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProfileHeaderProps {
  name: string;
  role: string;
  imageUrl?: string;
  uploadImage?: (uri: string) => Promise<string>;
  onImageUploaded?: (url: string) => void;
}

const ProfileHeader = ({
  name,
  role,
  imageUrl,
  uploadImage,
  onImageUploaded,
}: ProfileHeaderProps) => {
  const [image, setImage] = useState<string | null>(imageUrl || null);

  useEffect(() => {
    if (imageUrl) {
      // console.log("📷 imageUrl reçu:", imageUrl);
      setImage(imageUrl);
    }
  }, [imageUrl]);

  const pickImage = async () => {
    // Demande les permissions
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission d'accès à la galerie requise");
      return;
    }

    // Ouvre la galerie
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      setImage(localUri);
      if (uploadImage) {
        try {
          const uploadedUrl = await uploadImage(localUri);
          if (onImageUploaded) onImageUploaded(uploadedUrl);
        } catch (e) {
          alert("Erreur lors de l'upload de l'image");
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        {/* Section image de profil */}
        <View style={styles.imageContainer}>
          {image || imageUrl ? (
            <Image
              source={{ uri: image || imageUrl }}
              style={styles.profileImage}
            />
          ) : (
            <Image
              source={{
                uri: "https://www.w3schools.com/howto/img_avatar.png",
              }}
              style={styles.defaultImage}
            />
          )}
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={pickImage}
          >
            <FontAwesome name="camera" size={15} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Section informations utilisateur */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.role}>{role}</Text>
        </View>
      </View>
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    gap: 20,
  },
  imageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#14213D",
  },
  defaultImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#ccc",
  },
  cameraButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#14213D",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  userInfo: {
    flex: 1,
    alignItems: "flex-start",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#14213D",
    marginBottom: 8,
  },
  role: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e9ecef",
    textAlign: "center",
    minWidth: 100,
  },
});