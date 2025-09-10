import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

const studentVideos = [
  { id: 1, videoId: 'gFE02gC7plk', title: 'Conectados UV' },
];

function Conectados({ navigation }) {
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
                <Text style={styles.headerTitle}>Conectados UV</Text>
              </View>
              <Text style={[GlobalStyle.text, styles.headerDescription]}>
                El grupo Conectados UV nace por iniciativa de la Dirección de Asuntos Estudiantiles,
                 en el marco del fortalecimiento de la línea de Acompañamiento Socio-emocional, implementado 
                 por el equipo de Asistentes sociales DAE desde el año 2018.


              </Text>
            </View>

      {/* Sección blanca desplazable */}
      <View style={styles.whiteSection}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
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

          <Text style={styles.infoText}>
            Si necesitas apoyo psicológico, emocional o ayuda para resolver conflictos académicos,
            dirígete al equipo de Apoyo UV utilizando el botón a continuación.
          </Text>

          <TouchableOpacity
            style={styles.navigationButton}
            onPress={() => navigation.navigate('Conectados')} // Ajusta la ruta según corresponda
          >
            <MaterialCommunityIcons name="arrow-right-circle" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Ir a "Contactarse con apoyo UV"</Text>
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
  },
  infoText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#000',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default Conectados;
