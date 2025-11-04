import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Camera, Upload } from 'lucide-react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import * as ImagePicker from 'expo-image-picker';

interface PhotoUploadProps {
  onPhotoSelected: (uri: string) => void;
  photoUri: string | null;
  placeholder: string;
}

export function PhotoUpload({onPhotoSelected, photoUri, placeholder }: PhotoUploadProps) {
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'L\'accès à la caméra est requis pour prendre une photo.');
      return false;
    }
    return true;
  };

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'L\'accès à la galerie est requis pour sélectionner une photo.');
      return false;
    }
    return true;
  };

  const showImagePicker = () => {
    Alert.alert(
      'Sélectionner une photo',
      'Choisissez comment vous souhaitez ajouter votre photo',
      [
        {
          text: 'Caméra',
          onPress: async () => {
            const hasPermission = await requestCameraPermission();
            if (hasPermission) {
              takePicture();
            }
          },
        },
        {
          text: 'Galerie',
          onPress: async () => {
            const hasPermission = await requestMediaLibraryPermission();
            if (hasPermission) {
              pickImage();
            }
          },
        },
        {
          text: 'Annuler',
          style: 'cancel',
        },
      ]
    );
  };

  const takePicture = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onPhotoSelected(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de prendre la photo');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onPhotoSelected(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sélectionner la photo');
    }
  };

  return (
    <TouchableOpacity style={styles.uploadContainer} onPress={showImagePicker}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.uploadedImage} />
      ) : (
        <View style={styles.uploadPlaceholder}>
          <View style={styles.uploadIcon}>
            <FontAwesomeIcon icon={faImage} size={40}/>
          </View>
          <Text style={styles.uploadText}>{placeholder}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  uploadContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    minHeight: 120,
  },
  uploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    fontWeight: '500',
  },
  uploadedImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
  },
});