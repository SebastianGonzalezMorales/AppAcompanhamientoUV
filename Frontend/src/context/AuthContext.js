import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');

        if (token) {
          //console.log(" ")
          //console.log('Token:', token);
          const decodedToken = jwtDecode(token);
          //console.log('Decoded Token:', decodedToken);
        
          const currentTime = Math.floor(Date.now() / 1000);
          if (decodedToken.exp < currentTime) {
            await AsyncStorage.removeItem('token');
            setUserToken(null);
          } else {
            setUserToken(token);
          }
        }
        
      } catch (error) {
        console.error('Error al verificar el token:', error);
        setUserToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  const login = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
      setUserToken(token);
    } catch (error) {
      console.error('Error durante el login:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setUserToken(null);
    } catch (error) {
      console.error('Error durante el logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
