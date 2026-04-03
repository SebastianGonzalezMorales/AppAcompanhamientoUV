// react imports
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React, { useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../utils/api';

import { AuthContext } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

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

const Login = ({ navigation }) => {
  const { login } = useContext(AuthContext);

  // states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hasPasswordRecoveryToResume, setHasPasswordRecoveryToResume] = useState(false);
  const sanitizePasswordEdges = (value) => value.replace(/^\s+|\s+$/g, '');
  const handlePasswordChange = (value) => setPassword(sanitizePasswordEdges(value));

  /*
   * *******************
   * **** Functions ****
   * *******************
   */

  // clear onboarding from asyncstorage
  const clearOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('@viewedOnboarding');
    } catch (error) {
      console.log('Error @clearOnboarding', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const loadRecoveryState = async () => {
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

          if (!isRecoveryValid && (storedEmail || requestedAt)) {
            await AsyncStorage.multiRemove([
              'resetPasswordEmail',
              'resetPasswordAutoResume',
              'resetPasswordRequestedAt',
            ]);
          }

          setHasPasswordRecoveryToResume(isRecoveryValid);
        } catch (error) {
          console.log('Error @loadRecoveryState', error);
          setHasPasswordRecoveryToResume(false);
        }
      };

      loadRecoveryState();
    }, [])
  );

  // Login function
  const handleLogin = async (emailValue, passwordValue) => {
    try {
      // Convertir el correo electrónico a minúsculas
      const sanitizedEmail = emailValue.trim().toLowerCase();
      const sanitizedPassword = passwordValue.trim();
      const response = await api.post(`${API_URL}/auth/login`, {
        email: sanitizedEmail,
        password: sanitizedPassword,
      });

      const { token } = response.data;
      await login(token);
      navigation.replace('Home');

      // Mostrar alerta de éxito
      Alert.alert(
        'Inicio de sesión exitoso',
        '¡Has iniciado sesión correctamente!',
        [
          {
            text: 'OK',
            onPress: () =>
              console.log('Usuario presionó OK al inicio de sesión exitoso'),
          },
        ]
      );
    } catch (error) {
      console.log('[LOGIN ERROR]');
      console.log('Mensaje:', error.message);
      console.log('Código:', error.code);
      console.log('Response:', error.response);
      console.log('Config:', error.config);

      let errorMessage =
        'Ha ocurrido un error inesperado. Por favor, inténtalo nuevamente.';

      // Casos más comunes:
      if (error.code === 'ECONNABORTED') {
        errorMessage =
          'El servidor tardó demasiado en responder. Revisa tu conexión a internet.';
      } else if (error.message === 'Network Error') {
        errorMessage =
          'No se pudo conectar con el servidor. Asegúrate de estar conectado a la red y que el servidor esté activo.';
      } else if (error.response?.status === 401 || error.response?.status === 400) {
        errorMessage =
          'Correo o contraseña incorrectos. Por favor, verifica tus credenciales.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Alert.alert('Error al iniciar sesión', errorMessage, [
        {
          text: 'OK',
          onPress: () =>
            console.log('Usuario presionó OK en el alerta de error'),
        },
      ]);
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
        {/*
         * *********************
         * ***** Section 1 *****
         * *********************
         */}
        <View style={AuthStyle.rowOne}>
          <Svg style={{ position: 'absolute' }}>
            <Circle opacity={0.2} fill="#abced5" cx="10%" cy="30%" r="25" />
          </Svg>
          <Svg style={{ position: 'absolute' }}>
            <Circle opacity={0.2} fill="#abced5" cx="2%" cy="70%" r="25" />
          </Svg>
          <Svg style={{ position: 'absolute' }}>
            <Circle opacity={0.2} fill="#abced5" cx="30%" cy="50%" r="30" />
          </Svg>
          <Svg style={{ position: 'absolute' }}>
            <Circle opacity={0.2} fill="#abced5" cx="25%" cy="95%" r="30" />
          </Svg>
          <Svg style={{ position: 'absolute' }}>
            <Circle opacity={0.2} fill="#abced5" cx="52%" cy="70%" r="25" />
          </Svg>
          <Svg style={{ position: 'absolute' }}>
            <Circle opacity={0.2} fill="#abced5" cx="64%" cy="20%" r="25" />
          </Svg>
          <Svg style={{ position: 'absolute' }}>
            <Circle opacity={0.2} fill="#abced5" cx="70%" cy="100%" r="25" />
          </Svg>
          <Svg style={{ position: 'absolute' }}>
            <Circle opacity={0.2} fill="#abced5" cx="75%" cy="60%" r="30" />
          </Svg>
          <Svg style={{ position: 'absolute' }}>
            <Circle opacity={0.2} fill="#abced5" cx="95%" cy="35%" r="25" />
          </Svg>
          <Svg style={{ position: 'absolute' }}>
            <Circle opacity={0.2} fill="#abced5" cx="100%" cy="85%" r="30" />
          </Svg>
          <SafeAreaView style={AuthStyle.logo}>
            <TouchableOpacity
              onPress={clearOnboarding}
              style={{ marginTop: 20 }}
            >
              <Image
                style={{ width: 130, height: 130 }}
                source={require('./../../assets/images/SlidesOnboarding/Icon_Application.png')}
              />
            </TouchableOpacity>
          </SafeAreaView>
        </View>
        {/*
         * *********************
         * ***** Section 2 *****
         * *********************
         */}

        {/* inputs */}
        <View style={AuthStyle.rowTwo}>
          <Text style={AuthStyle.title}>Iniciar sesión</Text>
          <View style={AuthStyle.inputContainer}>
            <MaterialCommunityIcons
              name="email-outline"
              size={24}
              style={AuthStyle.icon}
            />
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text.replace(/\s+/g, ''))}
              placeholder="Correo institucional"
              placeholderTextColor="#92959f"
              selectionColor="#5da5a9"
              style={AuthStyle.input}
              value={email}
            />
          </View>
          <View style={AuthStyle.inputContainer}>
            <MaterialCommunityIcons
              name="lock-open-outline"
              size={24}
              style={AuthStyle.icon}
            />
            <TextInput
              onChangeText={handlePasswordChange}
              placeholder="Contraseña"
              placeholderTextColor="#92959f"
              secureTextEntry={!showPassword}
              selectionColor="#5da5a9"
              style={AuthStyle.input}
              value={password}
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

          {/* buttons */}
          <AuthButton
            onPress={() => {
              const sanitizedEmail = email.trim();
              const sanitizedPassword = sanitizePasswordEdges(password).trim();

              setEmail(sanitizedEmail);
              setPassword(sanitizedPassword);

              if (!sanitizedEmail) {
                Alert.alert('Error', 'Por favor, ingresa tu correo electrónico.');
                return;
              }
              if (!sanitizedPassword) {
                Alert.alert('Error', 'Por favor, ingresa tu contraseña.');
                return;
              }
              handleLogin(sanitizedEmail, sanitizedPassword);
            }}
            text="Ingresar"
            iconName="log-in"
          />

          <View style={AuthStyle.changeScreenContainer}>
            <Text style={AuthStyle.changeScreenText}>
              ¿Aún no tienes una cuenta?
            </Text>
            <SmallAuthButton
              text="Regístrate"
              onPress={() => navigation.replace('Register')}
            />
          </View>

          {hasPasswordRecoveryToResume ? (
            <View style={{ marginTop: 12, marginBottom: 16, alignItems: 'center' }}>
              <Text
                style={[
                  AuthStyle.changeScreenText,
                  { paddingBottom: 6, right: 0, textAlign: 'center' },
                ]}
              >
                Tienes una recuperación de contraseña pendiente.
              </Text>
              <SmallAuthButton
                text="Continuar recuperación"
                onPress={async () => {
                  await AsyncStorage.setItem('resetPasswordAutoResume', 'true');
                  navigation.replace('ChangePassword');
                }}
              />
            </View>
          ) : (
            <View style={AuthStyle.changeScreenContainer}>
              <SmallAuthButton
                text="Olvidaste tu contraseña"
                onPress={() => navigation.replace('ForgotPassword')}
              />
            </View>
          )}

          <TouchableOpacity
            onPress={() => navigation.replace('Onboarding')}
            style={{ marginTop: 4 }}
          >
            <Text>Conoce las funcionalidades</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Login;
