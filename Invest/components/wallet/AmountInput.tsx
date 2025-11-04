import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface AmountInputProps {
  value: string;
  editable : boolean;
  placeholder: string;
  onChangeText: (text: string) => void;
}

export function AmountInput({ value, editable, placeholder, onChangeText}: AmountInputProps) {
  const handleAmountChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    onChangeText(numericValue);
  };

  return (
      <View style={styles.amountInputContainer}>
        <TextInput
          style={styles.amountInput}
          value={value ? Number(value).toLocaleString('fr-FR') : ''}
          onChangeText={handleAmountChange}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          editable={editable}
        />
        <Text style={styles.currencyText}>Ar</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  currencyText: {
    fontSize: 16,
    padding:10,
    backgroundColor: '#efefef',
    fontWeight: '500',
 },
});