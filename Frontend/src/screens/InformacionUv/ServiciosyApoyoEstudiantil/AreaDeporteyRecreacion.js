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
  { id: 1, videoId: 'y60M56rfWAg', title: 'Unidad de Deporte y Recreación' },
];

const AreaDeporteyRecreacion = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [playingIndex, setPlayingIndex] = useState(null);

  const phoneNumbers = ['322508488'];
  const email = 'areadeportes@uv.cl';

  const onVideoPlay = (index) => setPlayingIndex(index);

  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`).catch(() =>
      alert('No se pudo realizar la llamada. Verifica tu dispositivo.')
    );
  };

  const handleEmail = () => {
    const mailtoURL = `mailto:${email}?subject=${encodeURIComponent(
      '[Unidad de Deporte y Recreación - UV]'
    )}&body=${encodeURIComponent('Hola, quisiera contactar con la Unidad de Deporte y Recreación. Gracias.')}`;
    Linking.openURL(mailtoURL).catch(() =>
      alert('No se pudo abrir el cliente de correo.')
    );
  };

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {/* Header azul */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Unidad de Deporte y Recreación</Text>
        </View>
        <Text style={[GlobalStyle.text, styles.headerDescription]}>
          Esta área orienta su quehacer hacia la promoción y desarrollo
           del Deporte, la Actividad Física y la Recreación.
        </Text>
      </View>

      {/* Contenedor blanco con scroll */}
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
          </View>

          {/* Texto informativo debajo del carrusel */}
          <Text style={styles.infoText}>
            Si tienes dudas o necesitas ayuda, contáctanos mediante los siguientes medios:
          </Text>

          {/* Botones de contacto */}
          {phoneNumbers.map((number, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.button, { backgroundColor: '#4CAF50' }]}
              onPress={() => handleCall(number)}
            >
              <MaterialCommunityIcons name="phone" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Llamar</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#2196F3' }]}
            onPress={handleEmail}
          >
            <MaterialCommunityIcons name="email" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Enviar correo</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

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
    height: height * 0.35,
    marginBottom: 15,
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
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginRight: 10,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5c6169',
    marginBottom: 10,
    textAlign: 'center',
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

export default AreaDeporteyRecreacion;
