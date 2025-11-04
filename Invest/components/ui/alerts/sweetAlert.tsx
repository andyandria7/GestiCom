import React, { useState } from 'react';
import { CustomAlert } from './CustomAlert';
import { View } from 'react-native';

let showAlertCallback: ((title: string, message: string, type?: 'success' | 'error' | 'warning') => void) | null = null;

export const SweetAlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error' | 'warning'>('success');

  showAlertCallback = (t: string, m: string, ty: 'success' | 'error' | 'warning' = 'success') => {
    setTitle(t);
    setMessage(m);
    setType(ty);
    setVisible(true);
  };

  return (
    <View style={{ flex: 1 }}>
      {children}
      <CustomAlert
        visible={visible}
        title={title}
        message={message}
        type={type}
        onClose={() => setVisible(false)}
      />
    </View>
  );
};

export const sweetAlert = (
  title: string,
  message: string,
  type: 'success' | 'error' | 'warning' = 'success'
) => {
  if (showAlertCallback) {
    showAlertCallback(title, message, type);
  }
};
