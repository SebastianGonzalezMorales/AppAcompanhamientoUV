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
  { id: 1, videoId: 'oFv7tnu2dA0', title: 'UV Inclusiva' },
  { id: 2, videoId: 'COxxvvwMGNw', title: 'Conceptos clave sobre Inclusión' },
  { id: 3, videoId: 'Bvhpyb9pT4I', title: 'Beneficios de la Credencial de Discapacidad' },
  { id: 4, videoId: 'Cnhru0OSNRE', title: 'Cómo Solicitar la Credencial de Discapacidad' },
];

function UvInclusiva({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

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
          UV Inclusiva
        </Text>
      </View>

      {/* Carrusel de Videos */}
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
                  width={width * 0.8}
                  videoId={video.videoId}
                />
              </View>
            ))}
          </Animated.ScrollView>

          {/* Puntos de Paginación */}
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
                    styles.dot,
                    {
                      opacity,
                      backgroundColor: index === currentIndex ? '#000C7B' : '#D1D5DB',
                    },
                  ]}
                />
              );
            })}
          </View>
        </View>
      {/* Texto y botones de contacto */}
      <View style={styles.contactButtonsContainer}>
        {/* Frase introductoria */}
        
        <Text style={styles.infoText}>
          Si tienes dudas o necesitas ayuda, contáctanos mediante los siguientes medios:
        </Text>

        {/* Botón de llamada */}
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => Linking.openURL('tel:322995601')}
        >
          <MaterialCommunityIcons name="phone" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Llamar</Text>
        </TouchableOpacity>

        {/* Botón de correo */}
        <TouchableOpacity
          style={styles.emailButton}
          onPress={() => Linking.openURL('mailto:uv.inclusiva@uv.cl')}
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
    padding: 10,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5c6169',
    marginBottom: 10,
    textAlign: 'center',
  },
  pagination: {
    position: 'absolute',
    bottom: -5,
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
  infoText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: '40%',
    justifyContent: 'center',
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: '50%',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default UvInclusiva;
