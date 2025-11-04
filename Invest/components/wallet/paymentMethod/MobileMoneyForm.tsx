import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

interface MobileMoneyFormProps {
  provider: 'mvola' | 'orange' | 'airtel';
  onProviderChange: (provider: 'mvola' | 'orange' | 'airtel') => void;
  phoneNumber: string;
  onPhoneNumberChange: (phone: string) => void;
}

export function MobileMoneyForm({
  provider,
  onProviderChange,
  phoneNumber,
  onPhoneNumberChange,
}: MobileMoneyFormProps) {
  const providers = {
    mvola: { name: 'MVola', code: '+261' },
    orange: { name: 'Orange Money', code: '+261' },
    airtel: { name: 'Airtel Money', code: '+261' },
  };

  const handlePhoneChange = (text: string) => {
    // Permettre seulement les chiffres
    const numericValue = text.replace(/[^0-9]/g, '');
    onPhoneNumberChange(numericValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Transférer, saisir le numéro indiqué</Text>
      
      <TouchableOpacity style={styles.providerSelector}>
        <Text style={styles.providerText}>{providers[provider].name}</Text>
        <ChevronDown size={20} color="#6B7280" />
      </TouchableOpacity>

      <View style={styles.phoneInputContainer}>
        <Text style={styles.countryCode}>{providers[provider].code}</Text>
        <TextInput
          style={styles.phoneInput}
          value={phoneNumber}
          onChangeText={handlePhoneChange}
          placeholder="34 00 000 00"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          maxLength={11}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
    fontWeight: '500',
  },
  providerSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  providerText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
  },
  countryCode: {
    fontSize: 16,
    color: '#1F2937',
    marginRight: 12,
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
});