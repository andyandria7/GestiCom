import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PhotoUpload } from '../PhotoUpload';

interface BankPaymentFormProps {
  photoUri: string | null;
  onPhotoSelected: (uri: string) => void;
}

export function BankPaymentForm({ photoUri, onPhotoSelected }: BankPaymentFormProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>RIB/IBAN de l'admin</Text>
      
      <View style={styles.bankInfoContainer}>
        <View style={styles.bankRow}>
          <Text style={styles.bankLabel}>Banque:</Text>
          <Text style={styles.bankValue}>BNI Madagascar</Text>
        </View>
        <View style={styles.bankRow}>
          <Text style={styles.bankLabel}>IBAN:</Text>
          <Text style={styles.bankValue}>MG46 0001 2345 6789 0123 4567 890</Text>
        </View>
        <View style={styles.bankRow}>
          <Text style={styles.bankLabel}>Titulaire:</Text>
          <Text style={styles.bankValue}>ADMIN WALLET</Text>
        </View>
      </View>

      <PhotoUpload
        onPhotoSelected={onPhotoSelected}
        photoUri={photoUri}
        placeholder="Photo justificatif"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 16,
    fontWeight: '500',
  },
  bankInfoContainer: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  bankRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bankLabel: {
    fontSize: 14,
    color: '#6B7280',
    width: 80,
    fontWeight: '500',
  },
  bankValue: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
});