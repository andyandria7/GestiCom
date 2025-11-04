import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faWallet, faPhone, faBuilding, faFileText} from '@fortawesome/free-solid-svg-icons';

export type PaymentMethod = 'wallet' | 'mobile_money' | 'bank' | 'check';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodSelect: (method: PaymentMethod) => void;
  availableMethods: PaymentMethod[];
}

export function PaymentMethodSelector({ 
  selectedMethod, 
  onMethodSelect, 
  availableMethods 
}: PaymentMethodSelectorProps) {
  const methods = [
    {
      id: 'wallet' as PaymentMethod,
      title: 'Solde principal',
      icon: faWallet,
    },
    {
      id: 'mobile_money' as PaymentMethod,
      title: 'Mobile money',
      icon: faPhone,
    },
    {
      id: 'check' as PaymentMethod,
      title: 'Chèque',
      icon: faFileText,
    },
    {
      id: 'bank' as PaymentMethod,
      title: 'Virement bancaire',
      icon: faBuilding,
    },
  ];

  const filteredMethods = methods.filter(method => 
    availableMethods.includes(method.id)
  );

  return (
    <View style={styles.container}>
      <View style={styles.methodsContainer}>
        {filteredMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          
          return (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodButton,
                isSelected && styles.selectedMethod
              ]}
              onPress={() => onMethodSelect(method.id)}
            >
              <View style={[
                styles.iconContainer,
              ]}>
                <FontAwesomeIcon icon={Icon} size={20} color={isSelected ? "#158EFA" : "#6B7280"} />
              </View>
              <Text style={[
                styles.methodText,
                isSelected && styles.selectedMethodText
              ]}>
                {method.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  methodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  methodButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 80,
    justifyContent: 'center',
  },
  selectedMethod: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  methodText: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 14,
  },
  selectedMethodText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
});