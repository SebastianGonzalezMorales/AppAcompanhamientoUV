import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Animated,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';

const { width, height } = Dimensions.get('window');

const studentVideos = [
  { id: 1, videoId: 'oFv7tnu2dA0', title: 'UV Inclusiva' },
  { id: 2, videoId: 'COxxvvwMGNw', title: 'Conceptos clave sobre Inclusion' },
  { id: 3, videoId: 'Bvhpyb9pT4I', title: 'Beneficios de la Credencial de Discapacidad' },
  { id: 4, videoId: 'Cnhru0OSNRE', title: 'Como Solicitar la Credencial de Discapacidad' },
];

function UvInclusiva({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={GlobalStyle.welcomeText}>Espacio UV</Text>
          <Text style={[GlobalStyle.subtitleMenu, styles.heroSubtitle]}>
            Servicios y apoyo estudiantil
          </Text>
          <Text style={[GlobalStyle.text, styles.heroText]}>UV Inclusiva</Text>
        </View>

        <View style={styles.contentCard}>
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
                const slideIndex = Math.round(
                  event.nativeEvent.contentOffset.x / (width * 0.82)
                );
                setCurrentIndex(slideIndex);
              }}
            >
              {studentVideos.map((video) => (
                <View key={video.id} style={styles.slide}>
                  <Text style={styles.videoTitle}>{video.title}</Text>
                  <YoutubePlayer
                    height={Math.max(height * 0.22, 210)}
                    width={width * 0.76}
                    videoId={video.videoId}
                  />
                </View>
              ))}
            </Animated.ScrollView>

            <View style={styles.pagination}>
              {studentVideos.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    { backgroundColor: index === currentIndex ? '#000C7B' : '#D1D5DB' },
                  ]}
                />
              ))}
            </View>
          </View>

          <Text style={styles.infoText}>
            Si tienes dudas o necesitas ayuda, contactanos mediante los
            siguientes medios:
          </Text>

          <TouchableOpacity
            style={[styles.actionButton, styles.callButton]}
            onPress={() => Linking.openURL('tel:322995601')}
          >
            <MaterialCommunityIcons name="phone" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Llamar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.emailButton]}
            onPress={() => Linking.openURL('mailto:uv.inclusiva@uv.cl')}
          >
            <MaterialCommunityIcons name="email" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Enviar correo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    minHeight: 190,
    padding: 15,
    paddingBottom: 12,
  },
  heroSubtitle: {
    color: '#FFFFFF',
  },
  heroText: {
    textAlign: 'justify',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  contentCard: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
  },
  carouselWrapper: {
    width: width * 0.84,
    minHeight: Math.max(height * 0.34, 320),
  },
  carouselContainer: {
    alignItems: 'flex-start',
  },
  slide: {
    width: width * 0.82,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    paddingTop: 14,
    paddingBottom: 12,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5c6169',
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
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
    color: '#333',
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 10,
    paddingHorizontal: 10,
    lineHeight: 20,
  },
  actionButton: {
    width: '85%',
    minHeight: 48,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButton: {
    backgroundColor: '#4CAF50',
  },
  emailButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    flexShrink: 1,
    textAlign: 'center',
  },
});

export default UvInclusiva;
