import React, { useEffect, useRef, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Animated, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle, faTimesCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const { width } = Dimensions.get('window');

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning';
  onClose: () => void;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({ visible, title, message, type = 'success', onClose }) => {
  const [scale] = useState(new Animated.Value(0));
  const iconAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start();

      if (type === 'success') {
        Animated.spring(iconAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }).start();
      } else if (type === 'error') {
        Animated.sequence([
          Animated.timing(iconAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
          Animated.timing(iconAnim, { toValue: -1, duration: 100, useNativeDriver: true }),
          Animated.timing(iconAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
          Animated.timing(iconAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
        ]).start();
      } else if (type === 'warning') {
        Animated.loop(
          Animated.sequence([
            Animated.timing(iconAnim, { toValue: -10, duration: 150, useNativeDriver: true }),
            Animated.timing(iconAnim, { toValue: 10, duration: 150, useNativeDriver: true }),
            Animated.timing(iconAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
          ]),
          { iterations: 2 }
        ).start();
      }
    } else {
      scale.setValue(0);
      iconAnim.setValue(0);
    }
  }, [visible, type]);

  const getIcon = () => {
    let icon = null;
    let color = "#2ecc71";

    switch (type) {
      case 'success':
        icon = faCheckCircle;
        color = "#2ecc71";
        break;
      case 'error':
        icon = faTimesCircle;
        color = "#e74c3c";
        break;
      case 'warning':
        icon = faExclamationTriangle;
        color = "#f1c40f";
        break;
    }

    const animatedStyle =
      type === 'success'
        ? { transform: [{ scale: iconAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }] }
        : type === 'error'
        ? { transform: [{ translateX: iconAnim }] }
        : { transform: [{ translateX: iconAnim }] };

    return (
      <Animated.View style={animatedStyle}>
        <FontAwesomeIcon icon={icon!} size={60} color={color} />
      </Animated.View>
    );
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
          {getIcon()}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#158EFA',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
