import { router } from "expo-router";
import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity } from "react-native";



function BackArrow({style}: {style?: StyleProp<TextStyle>}) {
  return (
    <TouchableOpacity onPress={() => router.back()}>
      <Text style={[styles.backArrow, style]}>←</Text>
    </TouchableOpacity>
  );
}

export default BackArrow;

const styles = StyleSheet.create({
  backArrow: {
    fontSize: 50,
    fontWeight: "bold",
    flex: 1,
    position: "absolute",
    top: -25
  },
});
