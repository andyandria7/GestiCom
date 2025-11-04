import React from "react";
import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";


interface ButtonProps {
    style?: StyleProp<ViewStyle>, 
    text: string,
    onPress: () => void;
    disabled?: boolean;
}
function ButtonForm({text, onPress, style, disabled}:ButtonProps) {
  return (
    <TouchableOpacity style={[styles.btn, style]} onPress={onPress} disabled={disabled}>  
      <Text style={styles.title}>{text}</Text>
    </TouchableOpacity>
  );
}

export default ButtonForm;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#339af0",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 17
  }
});
