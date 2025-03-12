import {
 SafeAreaView, Text, View,
} from 'react-native';
import React, { useState, useContext, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native'; // Importar useFocusEffect
import Icon from 'react-native-vector-icons/FontAwesome';
import { ProgressBar } from 'react-native-paper'; // Asegúrate de instalar react-native-paper
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthContext } from '../../context/AuthContext';

import { API_URL } from '@env';

import AuthButton from '../../components/buttons/AuthButton';

import GlobalStyle from '../../assets/styles/GlobalStyle';

function UserProfile({ navigation }) {
  const { logout } = useContext(AuthContext);

  // states
  const [name, setName] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [carrera, setCarrera] = useState('');
  const [phone, setPhone] = useState('');
  const [progress, setProgress] = useState(0); // Progreso inicial en días consecutivos
  const [message, setMessage] = useState('Cargando tu progreso semanal...'); // Mensaje motivacional

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const userResponse = await axios.post(
          `${API_URL}/user-management/userdata`,
          { token },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const userData = userResponse.data.data;

        // Actualizar estados con datos del usuario
        setName(userData.name);
        setRut(userData.rut);
        setEmail(userData.email);
        setBirthdate(userData.birthdate.split('T')[0]);
        setCarrera(userData.carrera);
        setPhone(userData.phoneNumber);

        // Obtener progreso semanal desde el backend
        const progressResponse = await axios.get(
          `${API_URL}/moodState/calculateStreak`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const progressData = progressResponse.data;
        setProgress(progressData.progress);
        setMessage(progressData.message);
      } else {
        console.log('No se encontró el token. Por favor, inicia sesión.');
      }
    } catch (error) {
      console.error('Error fetching user data or progress:', error);
      setMessage('Hubo un problema al cargar tu progreso. Inténtalo más tarde. 😓');
    }
  };

  // Se ejecuta cada vez que la pantalla gana foco
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const handleSignOut = async () => {
    try {
      await logout();
      navigation.replace('Login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {/* Header Section */}
      <View style={{ height: 310, alignItems: 'center' }}>
        <Text style={[GlobalStyle.welcomeText, { marginRight: 30 }]}>Mi perfil</Text>
        <Icon name="user-circle" size={100} color="#000" style={{ marginTop: 20 }} />

        {/* Mensaje motivacional */}
        <Text
          style={[
            GlobalStyle.text,
            { textAlign: 'center', color: '#FFFFFF', fontSize: 16, marginTop: 0 },
          ]}
        >
          {message}
        </Text>

        {/* Barra de progreso */}
        <View style={{ width: '80%', marginTop: 15 }}>
          <ProgressBar
            progress={progress / 7} // Progreso basado en un objetivo de 7 días
            color="#4CAF50"
            style={{ height: 10, borderRadius: 5 }}
          />
          <Text style={{ textAlign: 'center', marginTop: 5, color: '#FFFFFF' }}>
            {progress}/7 días esta semana
          </Text>
        </View>
      </View>

      {/* User Info Section */}
      <View style={GlobalStyle.rowTwo}>
        <View style={GlobalStyle.statsContainer}>
          <Text style={[GlobalStyle.statsTitle, { marginVertical: -5 }]}>
            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Nombre: </Text> {name}
          </Text>
          <Text style={[GlobalStyle.statsTitle, { marginVertical: -5 }]}>
            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Rut: </Text> {rut}
          </Text>
          <Text style={[GlobalStyle.statsTitle, { marginVertical: -5 }]}>
            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Email: </Text> {email}
          </Text>
          <Text style={[GlobalStyle.statsTitle, { marginVertical: -5 }]}>
            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Teléfono: </Text> {phone}
          </Text>
          <Text style={[GlobalStyle.statsTitle, { marginVertical: -5 }]}>
            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Carrera: </Text> {carrera}
          </Text>
          <Text style={[GlobalStyle.statsTitle, { marginVertical: -5 }]}>
            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Fecha de nacimiento: </Text> {birthdate}
          </Text>
        </View>

        {/* Logout Button */}
        <View style={{ marginTop: -7, paddingBottom: 50 }}>
          <AuthButton
            onPress={handleSignOut}
            text="Cerrar sesión"
            iconName="log-out-outline"
            iconColor="#388E3C"
            buttonStyle={{ backgroundColor: '#A5D6A7' }}
            textStyle={{ color: '#388E3C' }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default UserProfile;
