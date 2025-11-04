import React from 'react';
import { View } from 'react-native';
import { PhotoUpload } from '../PhotoUpload';

interface CheckPaymentFormProps {
  photoUri: string | null;
  onPhotoSelected: (uri: string) => void;
}

export function CheckPaymentForm({ photoUri, onPhotoSelected }: CheckPaymentFormProps) {
  return (
    <View style={{ marginTop: 20 }}>
      <PhotoUpload
        onPhotoSelected={onPhotoSelected}
        photoUri={photoUri}
        placeholder="Photo du chèque"
      />
    </View>
  );
}