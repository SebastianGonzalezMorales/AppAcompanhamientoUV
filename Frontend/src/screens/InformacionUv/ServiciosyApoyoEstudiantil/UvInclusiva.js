import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Linking,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';

const { width, height } = Dimensions.get('window');

const studentVideos = [
  { id: 1, videoId: 'oFv7tnu2dA0', title: 'UV Inclusiva' },
  { id: 2, videoId: 'COxxvvwMGNw', title: 'Conceptos clave sobre Inclusión' },
  { id: 3, videoId: 'Bvhpyb9pT4I', title: 'Beneficios de la Credencial de Discapacidad' },
  { id: 4, videoId: 'Cnhru0OSNRE', title: 'Cómo Solicitar la Credencial de Discapacidad' },
];

function UvInclusiva({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [playingIndex, setPlayingIndex] = useState(null);

  const onVideoPlay = (index) => setPlayingIndex(index);

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {/* Encabezado azul */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>UV Inclusiva</Text>
        </View>
        <Text style={[GlobalStyle.text, styles.headerDescription]}>
          Es un programa institucional que tiene como objetivo principal 
          “Promover la inclusión de los y las estudiantes en situación de 
          discapacidad durante el desarrollo de su vida estudiantil”.
        </Text>
      </View>

      {/* Sección blanca desplazable */}
      <View style={styles.whiteSection}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Carrusel de videos */}
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
                  {/* Título arriba del video */}
                  <Text style={styles.videoTitle}>{video.title}</Text>
                  
                  <YoutubePlayer
                    height={height * 0.33}
                    width={width * 0.8}
                    play={playingIndex === index}
                    videoId={video.videoId}
                    onChangeState={(state) => {
                      if (state === 'playing') onVideoPlay(index);
                      else if (state === 'ended' || state === 'paused') setPlayingIndex(null);
                    }}
                  />
                </View>
              ))}
            </Animated.ScrollView>

            {/* Puntos de paginación */}
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
                    style={[styles.dot, { opacity, backgroundColor: index === currentIndex ? '#000C7B' : '#D1D5DB' }]}
                  />
                );
              })}
            </View>
          </View>

          {/* Texto informativo */}
          <Text style={styles.infoText}>
            Si tienes dudas o necesitas ayuda, contáctanos mediante los siguientes medios:
          </Text>

          {/* Botones de contacto */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#4CAF50' }]}
            onPress={() => Linking.openURL('tel:322995601')}
          >
            <MaterialCommunityIcons name="phone" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Llamar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#2196F3' }]}
            onPress={() => Linking.openURL('mailto:uv.inclusiva@uv.cl')}
          >
            <MaterialCommunityIcons name="email" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Enviar correo</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
    backgroundColor: '#000C7B',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    marginLeft: 12,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  headerDescription: {
    marginTop: 10,
    color: '#FFFFFF',
    textAlign: 'justify',
  },
  whiteSection: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 10,
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  carouselWrapper: {
    width: width * 0.8,
    height: height * 0.4,
    marginBottom: 15,
  },
  carouselContainer: {
    alignItems: 'center',
  },
  slide: {
    width: width * 0.8,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000C7B',
    marginBottom: 10,
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
    backgroundColor: '#D1D5DB',
  },
  infoText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '80%',
    marginVertical: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default UvInclusiva;
