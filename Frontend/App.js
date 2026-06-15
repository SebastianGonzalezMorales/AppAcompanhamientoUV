import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import Constants from 'expo-constants';

import { registerForPushNotificationsAsync } from "./src/utils/notifications";

LogBox.ignoreLogs(['ExpoFaceDetector has been deprecated']);

export default function App() {
  useEffect(() => {
    if (__DEV__) {
      const apiUrl =
        Constants?.expoConfig?.extra?.API_URL ??
        Constants?.manifest?.extra?.API_URL ??
        'NO_API_URL_FOUND';

      console.log('API_URL:', apiUrl);
    }

    const initializeApp = async () => {
      try {
        await registerForPushNotificationsAsync();
      } catch (error) {
        console.error("Error al inicializar la app:", error);
      }
    };

    initializeApp();
  }, []);

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
