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

// Custom styles
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
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(slideIndex);
  };

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {/* Sección Azul del Encabezado */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>
            Consejos
          </Text>
        </View>

        <Text style={[GlobalStyle.text, styles.headerDescription]}>
          A continuación, te ofrecemos algunos consejos extraídos de la Red de Salud Digital de las Universidades del Estado (RSDUE) para apoyar tu bienestar emocional y salud mental.
        </Text>
      </View>

      {/* Sección Blanca con Scroll */}
      <ScrollView
        style={styles.whiteSection}
        contentContainerStyle={{ paddingVertical: 20 }}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.scrollContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingEnd: width * 0.1 }}
          >
            {adviceImages.map((image, index) => (
              <View key={index} style={styles.slide}>
                <Image source={image} style={styles.image} />
              </View>
            ))}
          </ScrollView>

          {/* Puntos de Paginación */}
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
  scrollContainer: {
    width: width,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.9,
    height: height * 0.45,
    resizeMode: 'contain',
    borderRadius: 30,
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

export default Consejos;
