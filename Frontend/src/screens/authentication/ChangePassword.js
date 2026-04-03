// react imports
import { Image, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../utils/api';

// Import the API URL from environment variables
import Constants from 'expo-constants';
import { useFocusEffect } from '@react-navigation/native';

// Asigna API_URL desde la configuración
const { API_URL } = Constants.expoConfig?.extra || {};


// components
import AuthButton from '../../components/buttons/AuthButton';
import SmallAuthButton from '../../components/buttons/SmallAuthButton';

// customisation
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AuthStyle from '../../assets/styles/AuthStyle';

const ChangePassword = ({ navigation }) => {
  // states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const sanitizePasswordEdges = (value) => value.replace(/^\s+|\s+$/g, '');
  const handleNewPasswordChange = (value) => setNewPassword(sanitizePasswordEdges(value));
  const handleConfirmPasswordChange = (value) =>
    setConfirmPassword(sanitizePasswordEdges(value));

  useFocusEffect(
    React.useCallback(() => {
      const markRecoveryAsResumable = async () => {
        try {
          const recoveryState = await AsyncStorage.multiGet([
            'resetPasswordEmail',
            'resetPasswordRequestedAt',
          ]);
          const storedEmail = recoveryState[0]?.[1];
          const requestedAtRaw = recoveryState[1]?.[1];
          const requestedAt = Number(requestedAtRaw || 0);

          if (storedEmail && !requestedAtRaw) {
            await AsyncStorage.setItem(
              'resetPasswordRequestedAt',
              Date.now().toString()
            );
          }

          const isRecoveryValid =
            !!storedEmail &&
            ((requestedAt > 0 &&
              Date.now() - requestedAt < 60 * 60 * 1000) ||
              !requestedAtRaw);

          if (isRecoveryValid) {
            await AsyncStorage.setItem('resetPasswordAutoResume', 'true');
          }
        } catch (error) {
          console.error('Error al guardar el estado de recuperación:', error);
        }
      };

      markRecoveryAsResumable();
    }, [])
  );

  /*
   * *******************
   * **** Functions ****
   * *******************
   */

  const handleChangePassword = async () => {
    const sanitizedNewPassword = sanitizePasswordEdges(newPassword).trim();
    const sanitizedConfirmPassword = sanitizePasswordEdges(confirmPassword).trim();

    setNewPassword(sanitizedNewPassword);
    setConfirmPassword(sanitizedConfirmPassword);

    // Validar si los campos están vacíos
    if (!sanitizedNewPassword) {
      Alert.alert("Error", "Por favor, ingresa la nueva contraseña.");
      return;
    }

    if (!sanitizedConfirmPassword) {
      Alert.alert("Error", "Por favor, confirma tu contraseña.");
      return;
    }

    // Validar si las contraseñas coinciden
    if (sanitizedNewPassword !== sanitizedConfirmPassword) {
      Alert.alert("Error", "Las contraseñas ingresadas no coinciden. Por favor, verifica y vuelve a intentarlo.");
      return;
    }
  

  try {
    // Recuperar el correo electrónico desde AsyncStorage
    const retrievedEmail = await AsyncStorage.getItem('resetPasswordEmail');
    if (!retrievedEmail) {
      Alert.alert("Error", "No se ha encontrado un correo para restablecer la contraseña.");
      return;
    }

    // Obtener el token de restablecimiento desde el backend
    const tokenResponse = await api.post(
      `${API_URL}/password/getReset-PasswordToken`,
      { email: retrievedEmail }
    );

    const token = tokenResponse.data.resetPasswordToken;

    if (!token) {
      Alert.alert("Error", "No se ha encontrado un token de restablecimiento.");
      return;
    }

    // Cambiar la contraseña usando el token y las nuevas contraseñas
    await api.post(
      `${API_URL}/password/change-password`,
      {
        token: token,
        newPassword: sanitizedNewPassword,
        confirmPassword: sanitizedConfirmPassword,
      }
    );

    await AsyncStorage.multiRemove([
      'resetPasswordEmail',
      'resetPasswordAutoResume',
      'resetPasswordRequestedAt',
    ]);

    Alert.alert("¡Listo!", "Contraseña cambiada exitosamente.");
    navigation.replace('Login');
  } catch (error) {
    // Obtener el mensaje de error del backend
    const errorMessage = error.response?.data?.message || 'Error al cambiar la contraseña. Intenta nuevamente más tarde.';

     // Mostrar el mensaje de error al usuario
     Alert.alert("Error", errorMessage);

    console.log('Error @handleChangePassword:', error.response || error.message);

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
      {/* Section 1 */}
      <View style={AuthStyle.rowOne}>
        <Svg style={{ position: 'absolute' }}>
          <Circle opacity={0.2} fill="#abced5" cx="10%" cy="30%" r="25" />
        </Svg>
        <SafeAreaView style={AuthStyle.logo}>
          <Image
            style={{ width: 120, height: 120 }}
            source={require('./../../assets/images/SlidesOnboarding/Icon_Application.png')}
          />
        </SafeAreaView>
      </View>

      {/* Section 2 */}
      <View style={AuthStyle.rowTwo}>
        <Text style={AuthStyle.title}>Cambiar contraseña</Text>

        {/* Nueva Contraseña */}
        <View style={AuthStyle.inputContainer}>
          <MaterialCommunityIcons
            name="lock-outline"
            size={24}
            style={AuthStyle.icon}
          />
          <TextInput
            placeholder="Nueva Contraseña"
            placeholderTextColor="#92959f"
            secureTextEntry={!showPassword}
            selectionColor="#5da5a9"
            style={AuthStyle.input}
            onChangeText={handleNewPasswordChange}
            value={newPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={AuthStyle.showPasswordButton}
          >
            <MaterialCommunityIcons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color="#92959f"
            />
          </TouchableOpacity>
        </View>

        {/* Confirmar Contraseña */}
        <View style={AuthStyle.inputContainer}>
          <MaterialCommunityIcons
            name="lock-outline"
            size={24}
            style={AuthStyle.icon}
          />
          <TextInput
            placeholder="Confirmar Contraseña"
            placeholderTextColor="#92959f"
            secureTextEntry={!showPassword}
            selectionColor="#5da5a9"
            style={AuthStyle.input}
            onChangeText={handleConfirmPasswordChange}
            value={confirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={AuthStyle.showPasswordButton}
          >
            <MaterialCommunityIcons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color="#92959f"
            />
          </TouchableOpacity>
        </View>

        {/* Cambiar Contraseña Button */}
        <AuthButton
          onPress={handleChangePassword}
          text="Cambiar contraseña"
        />

        <View style={AuthStyle.changeScreenContainer}>
          <Text style={AuthStyle.changeScreenText}>
            ¿Recordaste tu contraseña?
          </Text>
          <SmallAuthButton
            text="Iniciar sesión"
            onPress={async () => {
              await AsyncStorage.setItem('resetPasswordAutoResume', 'false');
              navigation.replace('Login');
            }}
          />
        </View>

      </View>
    </View>
  </KeyboardAwareScrollView>
);
};

export default ChangePassword;
