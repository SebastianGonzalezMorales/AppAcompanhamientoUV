// React imports
import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  ScrollView,
  View,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';

import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';

const { width, height } = Dimensions.get('window');

const adviceImages = [
  require('../../../assets/images/Consejos/1.png'),
  require('../../../assets/images/Consejos/2.png'),
  require('../../../assets/images/Consejos/3.png'),
  require('../../../assets/images/Consejos/4.png'),
  require('../../../assets/images/Consejos/5.png'),
  require('../../../assets/images/Consejos/6.png'),
  require('../../../assets/images/Consejos/7.png'),
  require('../../../assets/images/Consejos/8.png'),
  require('../../../assets/images/Consejos/9.png'),
  require('../../../assets/images/Consejos/10.png'),
];

function Consejos({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / (width * 0.84));
    setCurrentIndex(slideIndex);
  };

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={[GlobalStyle.welcomeText, { color: '#FFFFFF' }]}>Aprende sobre salud mental</Text>
          <Text style={[GlobalStyle.subtitleMenu, { color: '#FFFFFF' }]}>Consejos</Text>
          <Text style={[GlobalStyle.text, styles.heroText]}>
            A continuación, te ofrecemos algunos consejos extraídos de la Red de
            Salud Digital de las Universidades del Estado (RSDUE) para apoyar tu
            bienestar emocional y salud mental.
          </Text>
        </View>

        <View style={[GlobalStyle.rowTwo, styles.centeredContainer]}>
          <View style={styles.scrollContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              contentContainerStyle={styles.carouselContainer}
            >
              {adviceImages.map((image, index) => (
                <View key={index} style={styles.slide}>
                  <Image source={image} style={styles.image} />
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.pagination}>
            {adviceImages.map((_, index) => (
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    minHeight: Math.min(height * 0.28, 260),
    padding: 15,
    paddingBottom: 12,
  },
  heroText: {
    textAlign: 'left',
    lineHeight: 24,
  },
  centeredContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexGrow: 1,
    marginTop: 20,
    paddingTop: 14,
    paddingBottom: 24,
  },
  scrollContainer: {
    width: width * 0.84,
    minHeight: Math.max(height * 0.34, 280),
  },
  carouselContainer: {
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12,
  },
  slide: {
    width: width * 0.84,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  image: {
    width: '96%',
    height: Math.max(height * 0.34, 280),
    resizeMode: 'contain',
    borderRadius: 30,
  },
  pagination: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    paddingBottom: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
    backgroundColor: '#D1D5DB',
  },
});

export default Consejos;
