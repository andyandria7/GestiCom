import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

type NumberInputProps = {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
};

const NumberInput = ({ value, onChange, min = 0, max = 0 }: NumberInputProps) => {
  const handleMinus = () => {
    if (value > min) onChange(value - 1);
  };

  const handlePlus = () => {
    if (value < max) onChange(value + 1);
  };

  const handleInputChange = (text: string) => {
    const num = parseInt(text, 10);
    if (!isNaN(num) && num >= min && num <= max) {
      onChange(num);
    } else if (text === '') {
      onChange(0);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleMinus}>
        <Text style={styles.buttonText}>−</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        value={value.toString()}
        onChangeText={handleInputChange}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handlePlus}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#d9d9d9',
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  input: {
    color: '#000000',
    marginHorizontal: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default NumberInput;
