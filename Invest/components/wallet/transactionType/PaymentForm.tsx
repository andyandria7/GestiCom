import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AmountInput } from '../AmountInput';
import { BankPaymentForm } from '../paymentMethod/BankPaymentForm';
import { CheckPaymentForm } from '../paymentMethod/CheckPaymentForm';
import { MobileMoneyPaymentForm } from '../paymentMethod/MobileMoneyPaymentForm';
import { PaymentMethod, PaymentMethodSelector } from '../PaymentMethodSelector';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '@/constants/apiConfig';
import { apiFetch } from '@/utils/apiFetch';
import { sweetAlert } from '@/components/ui/alerts/sweetAlert';
import { router } from 'expo-router';

interface PaymentFormProps {
  pack_id: number;
  product_id: number;
  quantity: number;
  total_amount: string;
  onClose: () => void;
}

export function PaymentForm({ pack_id, product_id, quantity, total_amount, onClose }: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('wallet');
  const [mobileProvider, setMobileProvider] = useState<'mvola' | 'orange' | 'airtel'>('mvola');
  const [userPhoneNumber, setUserPhoneNumber] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const availableMethods: PaymentMethod[] = ['wallet', 'mobile_money', 'check', 'bank'];

  const handleConfirm = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");

    if (selectedMethod === 'mobile_money' && !userPhoneNumber) {
      setLoading(false);
      sweetAlert('Erreur', 'Veuillez saisir votre numéro de téléphone', 'error');
      return;
    }

    if ((selectedMethod === 'mobile_money' || selectedMethod === 'bank' || selectedMethod === 'check') && !photoUri) {
      setLoading(false);
      sweetAlert('Erreur', 'Veuillez télécharger la pièce justificative', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('pack_id',String(pack_id));
    formData.append('product_id',String(product_id));
    formData.append('quantity', String(quantity));
    formData.append('amount', String(total_amount));
    formData.append('payment_method', selectedMethod);

    if (selectedMethod === 'mobile_money') {
      formData.append('sender_number', userPhoneNumber);
    }

    if (photoUri) {
      formData.append('proof_image', {
        uri: photoUri,
        name: 'proof.jpg',
        type: 'image/jpeg',
      } as any);
    }

    try {
      const res = await apiFetch(`${API_BASE_URL}/api/transactions/payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if(!res) return;
      const data = await res.json();
      console.log('Response status:', res.status);
      console.log('Response body:', data);

    if (res.ok) {
      sweetAlert('Succès', data.message + '\n Ref: ' + data.reference, 'success');
      onClose();
      router.push('/(tabs)/marketplace');
    } else {
      setLoading(false);
      let errorMessage = '';

      if (typeof data.messages === 'string') {
        errorMessage = data.messages;
      } else if (typeof data.messages === 'object') {
        errorMessage = Object.values(data.messages).join('\n');
      } else {
        errorMessage = `Erreur serveur (${res.status})`;
      }

      sweetAlert('Erreur', errorMessage, 'error');
    }
    } catch (error) {
      Alert.alert('Erreur', 'Problème réseau.');
      console.error(error);
    }finally{
      setLoading(false);
    }

  };

  const renderPaymentFields = () => {
    switch (selectedMethod) {
      case 'wallet':
        return null;

      case 'mobile_money':
        return (
          <MobileMoneyPaymentForm
            type='deposit'
            provider={mobileProvider}
            onProviderChange={setMobileProvider}
            userPhoneNumber={userPhoneNumber}
            onUserPhoneNumberChange={setUserPhoneNumber}
            photoUri={photoUri}
            onPhotoSelected={setPhotoUri}
          />
        );

      case 'bank':
        return <BankPaymentForm photoUri={photoUri} onPhotoSelected={setPhotoUri} />;

      case 'check':
        return <CheckPaymentForm photoUri={photoUri} onPhotoSelected={setPhotoUri} />;

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <PaymentMethodSelector
          selectedMethod={selectedMethod}
          onMethodSelect={setSelectedMethod}
          availableMethods={availableMethods}
        />

        <AmountInput value={total_amount} onChangeText={() => {}} placeholder="Montant du produit" editable={false} />

        {renderPaymentFields()}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.totalText}>{Number(total_amount).toLocaleString('fr-FR')} Ar</Text>
        {loading ? (
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: '#A0AEC0',
                justifyContent: 'center',
                alignItems: 'center', // centre horizontalement
              },
            ]}
            disabled={true}
          >
            <ActivityIndicator size="large" color="#6c5ce7" />
          </TouchableOpacity>
        ):(
        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Confirmer le paiement</Text>
          <View style={styles.circle}>
            <FontAwesomeIcon icon={faCheck} color="#fff" />
          </View>
        </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    gap: 10,
  },
  scrollContent: {
    flex: 1,
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    paddingTop: 10,
    justifyContent: 'space-between',
    gap: 20,
  },
  totalText: {
    color: '#1F2937',
    fontWeight: 'bold',
    fontSize: 18,
    alignSelf: 'center',
    padding: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#158EFA',
    padding: 2,
    borderRadius: 25,
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: '600',
  },
  circle: {
    height: 39,
    width: 39,
    borderRadius: 50,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
