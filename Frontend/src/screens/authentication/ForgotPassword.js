// react imports
import { Image, Text, TextInput, TouchableOpacity, Alert, View } from 'react-native';
import React, { useState } from 'react';
import api from '../../utils/api';
import Svg, { Circle } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import the API URL from environment variables
import Constants from 'expo-constants';

// Asigna API_URL desde la configuración
const { API_URL } = Constants.expoConfig?.extra || {};


// components
import AuthButton from '../../components/buttons/AuthButton';
import SmallAuthButton from '../../components/buttons/SmallAuthButton';

// customisation
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AuthStyle from '../../assets/styles/AuthStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ForgotPassword = ({ navigation }) => {
  // states
  const [email, setEmail] = useState('');

  /*
   * *******************
   * **** Functions ****
   * *******************
   */

  const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+@estudiantes\.uv\.cl$/;

    return emailRegex.test(email);
  };
  
  
  // Función de recuperación de contraseña
  const handlePasswordRecovery = async () => {
    try {

      if (!email.trim()) {
        return Alert.alert('Error', 'Por favor, ingresa tu correo institucional.');
      }

      // Usar antes de enviar la solicitud
      if (!validateEmail(email)) {
        return Alert.alert('Error', 'Por favor, ingresa un correo institucional válido.');
      }
      
      // Convertir el correo electrónico a minúsculas
      const lowercaseEmail = email.toLowerCase();
      
    // Enviar la solicitud al backend
    const response = await api.post(`${API_URL}/password/forgot-password`, { email: lowercaseEmail });
    console.log(response)
    // Manejar la respuesta del backend
    if (response.data.success) {
      // Mostrar mensaje de éxito
      Alert.alert('¡Correo enviado!', response.data.message);

      // Guardar el correo electrónico en AsyncStorage
      try {
        await AsyncStorage.setItem('resetPasswordEmail', lowercaseEmail);
        console.log('Correo electrónico guardado exitosamente en AsyncStorage');

      } catch (error) {
        console.error('Error al guardar en AsyncStorage:', error);
      }

      // Navegar a la pantalla de cambio de contraseña
      navigation.replace('ChangePassword');
    } else {
      alert(response.data.message || 'Error al enviar el enlace de recuperación.'); // Mensaje de error del backend
    }
  } catch (error) {
 // Manejo de errores del backend
 if (error.response) {
  // Mostrar mensaje basado en el error del backend
  Alert.alert('Error', error.response.data.message || 'Algo salió mal. Intenta nuevamente.');
} else {
  // Error general en la solicitud
  Alert.alert('Error', 'No se pudo conectar con el servidor. Por favor, revisa tu conexión.');
}
console.log('Error @handlePasswordRecovery:', error.response || error.message);
  }
};
  /*
   * ****************
   * **** Screen ****
   * ****************
   */

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={AuthStyle.container}>
        {/* Background styling with SVG */}
        <View style={AuthStyle.rowOne}>
          <Svg style={{ position: 'absolute' }}>
            <Circle opacity={0.2} fill="#abced5" cx="10%" cy="30%" r="25" />
          </Svg>
          <Svg style={{ position: 'absolute' }}>
            <Circle opacity={0.2} fill="#abced5" cx="30%" cy="50%" r="30" />
          </Svg>
          <SafeAreaView style={AuthStyle.logo}>
            <TouchableOpacity style={{ marginTop: 20 }}>
              <Image
                style={{ width: 120, height: 120 }}
                source={require('./../../assets/images/SlidesOnboarding/Icon_Application.png')}
              />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Input and buttons */}
        <View style={AuthStyle.rowTwo}>
          <Text style={AuthStyle.title}>Recuperar contraseña</Text>
          <View style={AuthStyle.inputContainer}>
            <MaterialCommunityIcons
              name="email-outline"
              size={24}
              style={AuthStyle.icon}
            />
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
              placeholder="Correo institucional"
              placeholderTextColor="#92959f"
              selectionColor="#5da5a9"
              style={AuthStyle.input}
            />
          </View>

          {/* Recover Password Button */}
          <AuthButton
            onPress={handlePasswordRecovery}
            text="Recuperar contraseña"
            iconName="lock-open"
            
           
           
          />

          <View style={AuthStyle.changeScreenContainer}>
            <Text style={AuthStyle.changeScreenText}>
              ¿Recordaste tu contraseña?
            </Text>
            <SmallAuthButton
              text="Iniciar sesión"
              onPress={() => navigation.replace('Login')}
            />
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ForgotPassword;
