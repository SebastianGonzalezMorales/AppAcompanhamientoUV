// React imports
import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  Text,
  Animated,
  View,
  Dimensions,
  StyleSheet,
  ScrollView,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

// Custom styles
import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';

const { width, height } = Dimensions.get('window');

const studentVideos = [
  { id: 1, videoId: 'wxOigZE8ADs', title: 'Preocupaciones y ansiedad' },
  { id: 2, videoId: 'VKHqSbcW674', title: 'Vida universitaria' },
  { id: 3, videoId: 'yqzZljKwTzU', title: 'Vida universitaria' },
];

function ConsejosEstudiantes({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [playingIndex, setPlayingIndex] = useState(null);

  const onVideoPlay = (index) => {
    setPlayingIndex(index);
  };

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {/* Sección Azul del Encabezado */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Consejos de Estudiantes</Text>
        </View>

        <Text style={[GlobalStyle.text, styles.headerDescription]}>
          A continuación, encontrarás videos con consejos de estudiantes para cuidar tu bienestar emocional durante tu etapa en la Universidad de Valparaíso. Estos videos provienen de la Red de Salud Digital de las Universidades del Estado (RSDUE).
        </Text>
      </View>

      {/* Sección Blanca con Scroll */}
      <ScrollView
        style={styles.whiteSection}
        contentContainerStyle={{ paddingVertical: 20, alignItems: 'center' }}
        showsVerticalScrollIndicator={true}
      >
        <Animated.ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(event) => {
            const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(slideIndex);
          }}
          contentContainerStyle={{ paddingEnd: width * 0.1 }}
        >
          {studentVideos.map((video, index) => (
            <View key={video.id} style={styles.slide}>
              <Text style={styles.videoTitle}>{video.title}</Text>
              <YoutubePlayer
                height={height * 0.35}
                width={width * 0.9}
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

        {/* Puntos de Paginación */}
        <View style={styles.pagination}>
          {studentVideos.map((_, index) => {
            const opacity = scrollX.interpolate({
              inputRange: [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
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
      </ScrollView>
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
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
    flex: 1,
    textAlign: 'center',
    flexShrink: 1,
  },
  headerDescription: {
    color: '#FFFFFF',
    marginTop: 5,
    textAlign: 'justify',
  },
  whiteSection: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  slide: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5c6169',
    marginBottom: 10,
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
    backgroundColor: '#D1D5DB',
  },
});

export default ConsejosEstudiantes;
