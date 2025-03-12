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
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

// Custom styles
import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Obtener dimensiones de la pantalla
const { width, height } = Dimensions.get('window');

// Datos de los videos de los estudiantes
const studentVideos = [
  { id: 1, videoId: 'gFE02gC7plk', title: 'Conectados UV' },
];

function Conectados({ navigation }) {
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
          Conectados
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
                {/* Youtube Player */}
                <YoutubePlayer
                  height={height * 0.3}
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

          {/* Puntos de Paginación superpuestos */}
          <View style={styles.pagination}>
            {studentVideos.map((_, index) => {
              const opacity = scrollX.interpolate({
                inputRange: [
                  (index - 1) * width * 0.8,
                  index * width * 0.8,
                  (index + 1) * width * 0.8,
                ],
                outputRange: [0.3, 1, 0.3],
                extrapolate: 'clamp',
              });
              return (
                <Animated.View
                  key={index}
                  style={[
/*                     styles.dot,
                    {
                      opacity,
                      backgroundColor: index === currentIndex ? '#000C7B' : '#D1D5DB',
                    }, */
                  ]}
                />
              );
            })}
            
          </View>
        </View>

      <View style={styles.buttonContainer}>
      <Text style={styles.infoText}>
    Si necesitas apoyo psicológico, emocional o ayuda para resolver conflictos académicos, dirígete al equipo de Apoyo UV utilizando el botón a continuación.
  </Text>
        
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={() => navigation.navigate('Conectados')} // Reemplaza 'ApoyoUV' con el nombre de la ruta
        >
          <MaterialCommunityIcons name="arrow-right-circle" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Ir a "Contactarse con apoyo UV"</Text>
        </TouchableOpacity> 
          </View>
      </View>

      {/* Botón para navegar a "Apoyo UV" */}
   
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: 20, // Ajuste para igualar el primer código
  },
  carouselWrapper: {
    position: 'relative',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    paddingTop: 20,
  },
  pagination: {
    position: 'absolute',
    bottom: -20, // Ajusta este valor para acercar o alejar los puntos del video
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
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: -20, // Espaciado entre la frase y el botón
    paddingHorizontal: 15, // Espaciado lateral para mejor legibilidad
  },
});

export default Conectados;
