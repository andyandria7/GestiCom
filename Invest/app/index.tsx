import AsyncStorage from '@react-native-async-storage/async-storage';
import * as NavigationBar from "expo-navigation-bar";
import { router } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';


export default function Index() {
  useEffect(() => {
      NavigationBar.setVisibilityAsync("hidden");
    });
  useEffect(() => {
    const bootstrap = async () => {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        router.replace('/(auth)/login');
        return;
      }

      try {
        const decoded: any = jwtDecode(token);
        const role = decoded?.user?.role || 'default';

        if (role === 'commercial') {
          router.replace('/(tabs)/list'); 
        } else {
          router.replace('/(tabs)/marketplace'); 
        }
      } catch (err) {
        console.error('Erreur de décodage du token', err);
        router.replace('/(auth)/login');
      }
    };

    bootstrap();
  }, []);

  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" />
    </View>
  );
}
