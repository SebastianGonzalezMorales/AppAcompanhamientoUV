import React, { useEffect } from 'react';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import Constants from 'expo-constants';

export default function App() {

  useEffect(() => {
    // Esta parte se ejecutará una sola vez al iniciar la app
    console.log('API_URL:', Constants.expoConfig.extra.API_URL);
    console.log('BASE_URL:', Constants.expoConfig.extra.BASE_URL);
  }, []);

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}