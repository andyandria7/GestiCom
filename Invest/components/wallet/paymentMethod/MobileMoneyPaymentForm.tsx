import { ChevronRight } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { PhotoUpload } from '../PhotoUpload';

interface MobileMoneyPaymentFormProps {
  type: 'deposit'| 'withdrawal',
  provider: 'mvola' | 'orange' | 'airtel';
  onProviderChange: (provider: 'mvola' | 'orange' | 'airtel') => void;
  userPhoneNumber: string;
  onUserPhoneNumberChange: (phone: string) => void;
  photoUri: string | null;
  onPhotoSelected: (uri: string) => void;
}

export function MobileMoneyPaymentForm({
  type,
  provider,
  onProviderChange,
  userPhoneNumber,
  onUserPhoneNumberChange,
  photoUri,
  onPhotoSelected,
}: MobileMoneyPaymentFormProps) {
  const [showOptions, setShowOptions] = useState(false);
  const providers = {
    mvola: { name: 'MVola', adminNumber: '034 12 345 67' },
    orange: { name: 'Orange Money', adminNumber: '032 98 765 43' },
    airtel: { name: 'Airtel Money', adminNumber: '033 11 222 33' },
  };

  const formatDisplayNumber = (number: string) => {
    let cleaned = number.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
    if (cleaned.length <= 7) return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4)}`;
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  };

  const handlePhoneChange = (text: string) => {
    let numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue.startsWith('0')) numericValue = numericValue.substring(1);
    if (numericValue.length > 9) numericValue = numericValue.slice(0, 9);
    onUserPhoneNumberChange(numericValue);
  };

  const formatPhoneNumber = (number: string) => {
    const cleaned = number.replace(/[^0-9]/g, '');
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
    if (cleaned.length <= 7) return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4)}`;
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}> {type=='deposit'? "Transférer l'argent au numéro indiqué et indiquer votre numéro": "Indiquer le numéro de reception" }</Text>
      <View style={{ position: 'relative' }}>
        <TouchableOpacity
          style={styles.providerSelector}
          onPress={() => setShowOptions(!showOptions)}
        >
          <Text style={styles.providerText}>{providers[provider].name}</Text>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {showOptions && (
          <View style={styles.dropdown}>
            {Object.entries(providers).map(([key, data]) => (
              <TouchableOpacity
                key={key}
                style={styles.option}
                onPress={() => {
                  onProviderChange(key as 'mvola' | 'orange' | 'airtel');
                  setShowOptions(false);
                }}
              >
                <Text style={styles.optionText}>{data.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Numéro admin */}
      <View style={[type==='deposit'? styles.inputContainer: {display:'none'}]}>
        <Text style={styles.countryCode}>+261</Text>
        <Text style={styles.adminNumber}>{formatDisplayNumber(providers[provider].adminNumber)}</Text>
      </View>

      {/* Votre numéro */}
      <View style={styles.inputContainer}>
        <Text style={styles.countryCode}>+261</Text>
        <TextInput
          style={styles.phoneInput}
          value={formatPhoneNumber(userPhoneNumber)}
          onChangeText={handlePhoneChange}
          placeholder="Votre numéro"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          maxLength={12}
        />
      </View>

      {/* Upload justificatif */}
      <View style={type==='deposit'? {flex:1}:{display:'none'}}>
        <PhotoUpload
          onPhotoSelected={onPhotoSelected}
          photoUri={photoUri}
          placeholder="Photo justificatif"
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  sectionTitle: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 16,
    fontWeight: '500',
  },
  providerSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
  },
  providerText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginTop: 4,
    zIndex: 999,
    elevation: 5,
  },
  option: {
    padding: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 12,
    overflow: 'hidden',
  },
  countryCode: {
    fontSize: 16,
    padding: 10,
    backgroundColor: '#EFEFEF',
    color: '#1F2937',
    marginRight: 8,
    fontWeight: '500',
  },
  adminNumber: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
});
