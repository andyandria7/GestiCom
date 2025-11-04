import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AmountInput } from '../AmountInput';
import { BankPaymentForm } from '../paymentMethod/BankPaymentForm';
import { CheckPaymentForm } from '../paymentMethod/CheckPaymentForm';
import { MobileMoneyPaymentForm } from '../paymentMethod/MobileMoneyPaymentForm';
import { PaymentMethod, PaymentMethodSelector } from '../PaymentMethodSelector';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import API_BASE_URL from '@/constants/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '@/utils/apiFetch';
import { sweetAlert } from '@/components/ui/alerts/sweetAlert';

interface DepositFormProps {
  balance: number;
  onClose: () => void;
}

export function DepositForm({ balance,onClose }: DepositFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('mobile_money');
  const [amount, setAmount] = useState('');
  const [mobileProvider, setMobileProvider] = useState<'mvola' | 'orange' | 'airtel'>('mvola');
  const [userPhoneNumber, setUserPhoneNumber] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  
  const availableMethods: PaymentMethod[] = ['mobile_money', 'check', 'bank'];

  const handleConfirm = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");

    if (!amount) {
      setLoading(false);
      sweetAlert('Erreur', 'Veuillez saisir un montant', 'error');
      return;
    }

    if (selectedMethod === 'mobile_money' && !userPhoneNumber) {
      setLoading(false);
      sweetAlert('Erreur', 'Veuillez saisir votre numéro de téléphone', 'error');
      return;
    }

    if ((selectedMethod === 'mobile_money' || selectedMethod === 'bank') && !photoUri) {
      setLoading(false);
      sweetAlert('Erreur', 'Veuillez télécharger la pièce justificative', 'error');
      return;
    }

    if (selectedMethod === 'check' && !photoUri) {
      setLoading(false);
      sweetAlert('Erreur', 'Veuillez télécharger la photo du chèque', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('amount', amount);
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
      const res = await apiFetch(`${API_BASE_URL}/api/transactions/deposit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if(!res) return;

      const data = await res.json()
      console.log('Response status:', res.status);
      console.log('Response body:', data);

      if (res?.ok) {
        sweetAlert('Succès', data.message + '\n Ref: '+ data.reference, 'success');
        onClose();
      } else {
        sweetAlert('Erreur', data || `Erreur serveur (${res.status})`, 'error');
      }
    } catch (error) {
      sweetAlert('Erreur', 'Problème réseau.', 'error');
      console.error(error);
    }finally{
      setLoading(false);
    }
  };

  const renderPaymentFields = () => {
    switch (selectedMethod) {
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
        return (
          <BankPaymentForm
            photoUri={photoUri}
            onPhotoSelected={setPhotoUri}
          />
        );

      case 'check':
        return (
          <CheckPaymentForm
            photoUri={photoUri}
            onPhotoSelected={setPhotoUri}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.scrollContent}>
        <PaymentMethodSelector
          selectedMethod={selectedMethod}
          onMethodSelect={setSelectedMethod}
          availableMethods={availableMethods}
        />

        <AmountInput
          value={amount}
          editable={true}
          onChangeText={setAmount}
          placeholder="Montant à déposer"
        />

        {renderPaymentFields()}
      </View>

      <View style={styles.footer}>
        <Text style={styles.totalText}>
          {Number(amount).toLocaleString('fr-FR') || '0'} Ar
        </Text>
        
        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
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
        <> 
          <Text style={styles.buttonText}>Confirmer le dépôt</Text>
          <View style={styles.circle}>
            <FontAwesomeIcon icon={faCheck} color="#fff" />
          </View>
        </>
        )}
        </TouchableOpacity>
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
    width: "100%",
    flexDirection: "row",
    paddingTop: 10,
    justifyContent: "space-between",
    gap: 20,
  },
  totalText: {
    color: "#1F2930",
    fontWeight: "bold",
    fontSize: 18,
    alignSelf: "center",
    padding: 10,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#158EFA",
    padding: 2,
    borderRadius: 25,
  },
  buttonText: {
    flex: 1,
    textAlign: "center",
    color: "#ffffff",
    fontWeight: "600",
  },
  circle: {
    height: 39,
    width: 39,
    borderRadius: 50,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});