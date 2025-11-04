import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const screenHeight = Dimensions.get("window").height;

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function BottomModal({ visible, onClose, title, children }: Props) {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(screenHeight)).current;
  const [shouldRender, setShouldRender] = useState(visible);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(translateYAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateYAnim, { toValue: screenHeight, duration: 200, useNativeDriver: true }),
      ]).start(() => setShouldRender(false));
    }
  }, [visible]);

  if (!shouldRender) return null;

  const modalStyle =
    keyboardHeight > 0
      ? {
          top: insets.top,
          height: screenHeight - keyboardHeight,
        }
      : { bottom: 0, maxHeight: screenHeight - insets.top, height: undefined };

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: "rgba(0,0,0,0.5)", opacity: opacityAnim },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.modal,
          modalStyle,
          { transform: [{ translateY: translateYAnim }] },
        ]}
      >
        <View style={styles.modalHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.modalTitle}>{title}</Text>
          </View>
          <Pressable onPress={onClose}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>✕</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
});
