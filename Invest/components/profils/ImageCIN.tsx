import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ImageCINProps {
  userId: number;
  onUploaded: (url: string) => void;
  uploadCINImage: (uri: string, userId: string) => Promise<string>;
  existingImageUrl?: string;
}

const ImageCIN = ({ userId, onUploaded, uploadCINImage, existingImageUrl }: ImageCINProps) => {
  const [image, setImage] = useState<string | null>(existingImageUrl || null);

  // Initialiser l'image avec l'URL existante si disponible
  useEffect(() => {
    if (existingImageUrl) {
      console.log("📷 CIN imageUrl reçu:", existingImageUrl);
      setImage(existingImageUrl);
    }
  }, [existingImageUrl]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission d'accès à la galerie requise");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);

      try {
        const url = await uploadCINImage(uri, userId.toString());
        onUploaded(url); 
      } catch (error) {
        console.error("Erreur upload CIN:", error);
      }
    }
  };

  return (
    <View>
      <Text>Carte d'Identité Nationale (CIN)</Text>
      <TouchableOpacity
        style={[styles.inputField, { padding: 15, marginHorizontal: 10, marginTop: 15 }]}
        onPress={pickImage}
      >
        <Text style={{ color: "#333" }}>
          {image ? "Changer l'image" : "Ajouter une image"}
        </Text>
      </TouchableOpacity>

      {image && (
        <Image
          source={{ uri: image }}
          style={{
            width: 200,
            height: 200,
            marginTop: 10,
            alignSelf: "center",
            borderRadius: 10,
          }}
        />
      )}
    </View>
  );
};

export default ImageCIN;

const styles = StyleSheet.create({
  inputField: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#f0f1f6",
    alignItems: "center",
    justifyContent: "center",
  },
});
