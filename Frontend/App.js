import React, { useEffect } from 'react';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import Constants from 'expo-constants';

export default function App() {

  useEffect(() => {
    // Forma segura de acceder a variables desde app.config.js
    const apiUrl =
      Constants?.expoConfig?.extra?.API_URL ??
      Constants?.manifest?.extra?.API_URL ??
      'NO_API_URL_FOUND';


    //console.log('API_URL:', apiUrl);
  }, []);

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
