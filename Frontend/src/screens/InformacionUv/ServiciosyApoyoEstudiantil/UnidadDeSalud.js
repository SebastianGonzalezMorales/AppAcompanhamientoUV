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

// Datos de los videos de los estudiantes
const studentVideos = [
  { id: 1, videoId: 'kr2Aa9DnwY8' },
  /* { id: 1, videoId: 'kr2Aa9DnwY8', title: 'Unidad De Salud' }, */
  // Más videos se pueden agregar aquí.
];

function UnidadDeSalud({ navigation }) {
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
      <View style={{ height: 190, padding: 15 }}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={GlobalStyle.welcomeText}>Espacio UV</Text>
        <Text style={[GlobalStyle.subtitleMenu, { color: '#FFFFFF' }]}>
          Servicios y apoyo estudiantil
        </Text>
        <Text style={[GlobalStyle.text, { textAlign: 'justify', color: '#FFFFFF' }]}>
          Unidad de salud
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
                  height={height * 0.29}
                  width={width * 0.8}
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

          <Text style={styles.helpText}>
            Si tienes dudas o necesitas ayuda, contáctanos mediante los siguientes medios:
          </Text>

        </View>
        {/* Botones de contacto */}
        <View style={styles.contactButtonsContainer}>
          {/* Botón de llamada */}
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => Linking.openURL('tel:322507158')}
          >
            <MaterialCommunityIcons name="phone" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Llamar a N.°1</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.callButton}
            onPress={() => Linking.openURL('tel:322507186')}
          >
            <MaterialCommunityIcons name="phone" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Llamar a N.°2</Text>
          </TouchableOpacity>

          {/* Botón de correo */}
          <TouchableOpacity
            style={styles.emailButton}
            onPress={() => Linking.openURL('mailto:unidad.salud@uv.cl')}
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
    marginTop: 20,
  },
  helpText: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  carouselWrapper: {
    position: 'relative',
    width: width * 0.8,
    height: height * 0.4,
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
    marginBottom: 5,
    textAlign: 'center',
  },
  pagination: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
    backgroundColor: '#D1D5DB',
  },
  contactButtonsContainer: {
    marginVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: '60%',
    justifyContent: 'center',
    marginTop: 5
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: '60%',
    justifyContent: 'center',
    marginTop: 5
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default UnidadDeSalud;
