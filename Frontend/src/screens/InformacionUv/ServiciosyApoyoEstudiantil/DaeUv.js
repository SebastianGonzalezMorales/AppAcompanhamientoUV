import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  Text,
  Animated,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Importación de estilos personalizados y componentes
import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';

// Obtener dimensiones de la pantalla
const { width, height } = Dimensions.get('window');

// Datos de los videos de los estudiantes
const studentVideos = [
  { id: 2, videoId: 'k7LKQ6YYm_U', type: 'video' },
];

function DaeUv({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [playingIndex, setPlayingIndex] = useState(null);

  // Datos de contacto
  const phoneNumber = '32-2507291';
  const phoneNumberOne= '32-2507772';
  const email = 'dae@uv.cl';

  // Manejar llamadas y correos
  const handleCall = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {/* Sección Azul del Encabezado */}
      <View style={{ height: 230, padding: 15 }}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={GlobalStyle.welcomeText}>Espacio UV</Text>
        <Text style={[GlobalStyle.subtitleMenu, { color: '#FFFFFF' }]}>
          Servicios y apoyo estudiantil
        </Text>
        <Text style={[GlobalStyle.text, { textAlign: 'justify', color: '#FFFFFF' }]}>
          DAE - Dirección de asuntos estudiantiles
        </Text>
      </View>

      {/* Contenedor para el Carrusel de Videos */}
      <View style={[GlobalStyle.rowTwo, styles.centeredContainer]}>
        <View style={styles.carouselWrapper}>
          <View style={styles.scrollContainer}>
            <Animated.ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContainer}
            >
              {studentVideos.map((item) => (
                <View key={item.id} style={styles.slide}>
          
                  <YoutubePlayer height={height * 0.33} width={width * 0.8} videoId={item.videoId} />
                </View>
              ))}
            </Animated.ScrollView>
          </View>
        </View>  
              <Text style={[styles.infoText,{ marginTop: -40}]}>
          Si tienes dudas o necesitas ayuda, contáctanos mediante los siguientes medios:
        </Text>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <MaterialCommunityIcons name="phone" size={18} color="#FFF" />
          <Text style={styles.callButtonText}>Llamar al {phoneNumber}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <MaterialCommunityIcons name="phone" size={18} color="#FFF" />
          <Text style={styles.callButtonText}>Llamar al {phoneNumberOne}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emailButton} onPress={handleEmail}>
          <MaterialCommunityIcons name="email" size={20} color="#FFF" />
          <Text style={styles.emailButtonText}>Enviar correo</Text>
        </TouchableOpacity>
 
      </View>

      {/* Botones de contacto */}
  

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: 20,
  },
  carouselWrapper: {
    width: width * 0.8,
    height: height * 0.4,
  },
  scrollContainer: {
    width: '100%',
    height: '100%',
  },
  carouselContainer: {
    alignItems: 'center',
  },
  slide: {
    width: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingTop: 20,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5c6169',
    marginBottom: 5,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 15,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginVertical: 5,
  },
  callButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
  },
  emailButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default DaeUv;
