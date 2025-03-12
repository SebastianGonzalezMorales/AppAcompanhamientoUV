// React imports
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

// Custom styles
import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';

// Obtener dimensiones de la pantalla
const { width, height } = Dimensions.get('window');

// Datos de los videos
const studentVideos = [
  { id: 1, videoId: 'y60M56rfWAg' },
];

function AreaDeporteyRecreacion({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [playingIndex, setPlayingIndex] = useState(null);

  // Manejar la reproducción del video
  const onVideoPlay = (index) => {
    setPlayingIndex(index);
  };

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {/* Sección Azul del Encabezado */}
      <View style={{ height: 215, padding: 15 }}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={GlobalStyle.welcomeText}>Espacio UV</Text>
        <Text style={[GlobalStyle.subtitleMenu, { color: '#FFFFFF' }]}>
          Servicios y apoyo estudiantil
        </Text>
        <Text style={[GlobalStyle.text, { textAlign: 'justify', color: '#FFFFFF' }]}>
          Unidad de deporte y recreación
        </Text>
      </View>

      {/* Contenedor para el Carrusel de Videos */}
      <View style={[GlobalStyle.rowTwo, styles.centeredContainer]}>
        <View style={styles.carouselWrapper}>
          <Animated.ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            contentContainerStyle={styles.carouselContainer}
            onMomentumScrollEnd={(event) => {
              const slideIndex = Math.round(event.nativeEvent.contentOffset.x / (width * 0.8));
              setCurrentIndex(slideIndex);
            }}
          >
            {studentVideos.map((video, index) => (
              <View key={video.id} style={styles.slide}>
                <Text style={styles.videoTitle}>{video.title}</Text>
                <YoutubePlayer
                  height={height * 0.25}
                  width={width * 0.7}
                  play={playingIndex === index}
                  videoId={video.videoId}
                  onChangeState={(state) => {
                    if (state === 'playing') {
                      onVideoPlay(index);
                    } else if (state === 'ended' || state === 'paused') {
                      setPlayingIndex(null);
                    }
                  }}
                />
              </View>
            ))}
          </Animated.ScrollView>
        </View>

        {/* Frase adicional */}
        <Text style={styles.helpText}>
          Si tienes dudas o necesitas ayuda, contáctanos mediante los siguientes medios:
        </Text>

        {/* Botones de contacto */}
        <View style={styles.contactButtonsContainer}>
          {/* Botón de llamada */}
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => Linking.openURL('tel:322508488')}
          >
            <MaterialCommunityIcons name="phone" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Llamar al 32-2508488</Text>
          </TouchableOpacity>

          {/* Botón de correo */}
          <TouchableOpacity
            style={styles.emailButton}
            onPress={() => Linking.openURL('mailto:areadeportes@uv.cl')}
          >
            <MaterialCommunityIcons name="email" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Enviar correo</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    position: 'relative',
    width: width * 0.9,
    height: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center'
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    paddingTop: 20,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5c6169',
    marginBottom: 10,
    textAlign: 'center',
  },
  helpText: {
    marginTop: 15,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  contactButtonsContainer: {
    marginVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50', // Verde para botón de llamada
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '80%',
    marginVertical: 10,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3', // Azul para botón de correo
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '60%',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default AreaDeporteyRecreacion;
