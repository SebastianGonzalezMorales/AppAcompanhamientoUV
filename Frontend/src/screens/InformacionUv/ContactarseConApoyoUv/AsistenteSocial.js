import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  ScrollView,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
  Alert, // Si quieres usar Alert
} from 'react-native';
import api from '../../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer'; // Importar Buffer

// Customisation
import GlobalStyle from '../../../assets/styles/GlobalStyle';

import Icon from 'react-native-vector-icons/MaterialIcons'; // Íconos generales
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Ícono de WhatsApp
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Components
import BackButton from '../../../components/buttons/BackButton';

// Importamos API_URL y BASE_URL desde las variables de entorno
import { API_URL, BASE_URL } from '@env';

const { width, height } = Dimensions.get('window'); // Obtener dimensiones

function AsistenteSocial({ navigation }) {
  const [assistant, setAssistant] = useState(null); 
  const [firstName, setFirstName] = useState(''); 
  const [imageData, setImageData] = useState(null); 
  const [userRut, setUserRut] = useState(''); 
  const [userCareer, setUserCareer] = useState(''); 
  const [userPhone, setUserPhone] = useState(''); 

  // Estado para manejar errores:
  const [errorMessage, setErrorMessage] = useState('');

  // Función para obtener los datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await api.post(
            `${API_URL}/user-management/userdata`,
            { token },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const userData = response.data.data;
          setFirstName(userData.name.split(' ')[0]); 
          setUserRut(userData.rut); 
          setUserCareer(userData.carrera); 
          setUserPhone(userData.phoneNumber);

          console.log('Datos de usuario cargados correctamente.');
        } else {
          console.log('No se encontró el token. Por favor, inicia sesión.');
          setErrorMessage('No se encontró el token. Inicia sesión para continuar.');
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        // Mensaje genérico de error al usuario
        setErrorMessage('No se pudo conectar al servidor. Verifica tu conexión. 🌐');
      }
    };
    fetchUserData();
  }, []);

  // Función para obtener los datos del asistente social y la imagen
  useEffect(() => {
    const fetchAssistantData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await api.get(
            `${API_URL}/assistants/${userCareer}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const assistantData = response.data.assistant;

          console.log('Datos del asistente:', assistantData);

          if (assistantData.imagen) {
            assistantData.imagen = assistantData.imagen.replace(
              'http://localhost:3001',
              BASE_URL
            );
          }

          setAssistant(assistantData);
          if (assistantData.imagen) {
            const imageResponse = await api.get(assistantData.imagen, {
              headers: { Authorization: `Bearer ${token}` },
              responseType: 'arraybuffer',
            });
            const base64Image = `data:image/jpeg;base64,${Buffer.from(
              imageResponse.data,
              'binary'
            ).toString('base64')}`;
            setImageData(base64Image);
          }
        } else {
          console.log('No se encontró el token. Por favor, inicia sesión.');
          setErrorMessage('No se encontró el token. Inicia sesión para continuar.');
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // El caso en que no se encuentra un asistente social para la carrera
          console.log('Mensaje del servidor:', error.response.data.message);
          setAssistant(null);
        } else if (error.response && error.response.data.message) {
          // Otros errores provenientes del backend
          console.error('Error del servidor:', error.response.data.message);
          setErrorMessage(error.response.data.message);
        } else {
          // Errores desconocidos (por ejemplo, problemas de red)
          console.error('Error desconocido:', error);
          setErrorMessage('No se pudo conectar al servidor. Verifica tu conexión.');
        }
      }
    };

    if (userCareer) {
      fetchAssistantData();
    }
  }, [userCareer]);

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {/* Botón para regresar */}
      <BackButton onPress={() => navigation.goBack()} />

      {/* Sección superior azul */}
      <View
        style={{
          height: height * 0.32,
          padding: 10,
          backgroundColor: '#000C7B',
        }}
      >
        <Text style={GlobalStyle.welcomeText}>Contactarse con apoyo UV</Text>

        <Text
          style={[
            GlobalStyle.text,
            { textAlign: 'justify', color: '#FFFFFF' },
          ]}
        >
          Asistente social
        </Text>
        <Text
          style={[
            GlobalStyle.text,
            { textAlign: 'justify', color: '#FFFFFF' },
          ]}
        >
          {firstName
            ? `${firstName}, te presentamos a la asistente social asignada a tu carrera. Ella es tu primer contacto para recibir orientación y apoyo. Posteriormente, en caso de ser necesario podrás recibir atención psicológica`
            : errorMessage
              ? '' // No mostramos nada si hay error
              : 'Cargando...'}
        </Text>
      </View>

      {/* Contenedor principal */}
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        {/** Si existe un error, mostrarlo al usuario */}
        {errorMessage ? (
  <View style={{ alignItems: 'center', marginVertical: 12 }}>
    <MaterialCommunityIcons
     
      size={10}
      color="#666"
      style={{ marginBottom: 8 }}
    />
    <Text
      style={{
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
        fontWeight: '500',
        paddingHorizontal: 20,
        lineHeight: 24,
      }}
    >
      {errorMessage}
    </Text>
  </View>
) : null}
        {assistant ? (
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <View
              style={{
                backgroundColor: '#F5F5F5',
                borderRadius: 10,
                padding: 15,
                marginBottom: 15,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              {imageData ? (
                <Image
                  source={{ uri: imageData }}
                  style={{
                    width: '90%',
                    height: 250,
                    borderRadius: 10,
                    marginBottom: 10,
                    alignSelf: 'center',
                  }}
                  onError={(error) =>
                    console.error(
                      'Error al cargar la imagen:',
                      error.nativeEvent.error
                    )
                  }
                  resizeMode="contain"
                />
              ) : (
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#999',
                    marginBottom: 10,
                  }}
                >
                  Cargando imagen...
                </Text>
              )}

              <Text
                style={{
                  fontSize: 14,
                  color: '#555',
                  textAlign: 'center',
                  marginBottom: 5,
                }}
              >
                {assistant.ubicacion}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  marginTop: 10,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: '#4CAF50',
                    padding: 10,
                    borderRadius: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    Linking.openURL(`tel:${assistant.phone}`);
                  }}
                >
                  <Icon
                    name="phone"
                    size={20}
                    color="white"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={{ color: 'white' }}>Llamar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#2196F3',
                    padding: 10,
                    borderRadius: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    const assistantFirstName = assistant?.name
                      ? assistant.name.trim().split(' ')[0]
                      : 'Asistente';

                    Linking.openURL(
                      `mailto:${assistant.email}?subject=[Atención Salud Mental - AppAcompañamientoUV]&body=Estimada ${assistantFirstName},%0D%0A%0D%0A` +
                        `Junto con saludar y esperando que se encuentre bien, le escribo este correo porque quiero contar con acompañamiento psicológico.%0D%0A%0D%0A` +
                        `Datos del estudiante:%0D%0A` +
                        `- Nombre: ${firstName}%0D%0A` +
                        `- Carrera: ${userCareer}%0D%0A` +
                        `- RUT: ${userRut}%0D%0A` +
                        `- Teléfono: ${userPhone}%0D%0A%0D%0A` +
                        `Quedo atento.%0D%0A%0D%0A` +
                        `Muchas gracias.`
                    );
                  }}
                >
                  <Icon
                    name="email"
                    size={20}
                    color="white"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={{ color: 'white' }}>Enviar correo</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        ) : (
          /** Si no hay asistente pero tampoco hay error, mostrar "Cargando..." **/
          !errorMessage && (
            <Text
              style={{
                textAlign: 'center',
                color: '#999',
                marginTop: 20,
              }}
            >
              Cargando datos...
            </Text>
          )
        )}
      </View>
    </SafeAreaView>
  );
}

export default AsistenteSocial;
