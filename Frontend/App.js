import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import Constants from 'expo-constants';

import { registerForPushNotificationsAsync } from "./src/utils/notifications";

LogBox.ignoreLogs(['ExpoFaceDetector has been deprecated']);

export default function App() {
  useEffect(() => {
    // Forma segura de acceder a variables desde app.config.js
    const apiUrl =
      Constants?.expoConfig?.extra?.API_URL ??
      Constants?.manifest?.extra?.API_URL ??
      'NO_API_URL_FOUND';

    const baseUrl =
      Constants?.expoConfig?.extra?.BASE_URL ??
      Constants?.manifest?.extra?.BASE_URL ??
      'NO_BASE_URL_FOUND';

    console.log('API_URL:', apiUrl);
    console.log('BASE_URL:', baseUrl);

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
