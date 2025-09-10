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
import GlobalStyle from '../../../../assets/styles/GlobalStyle';
import BackButton from '../../../../components/buttons/BackButton';

const { width, height } = Dimensions.get('window');

const adviceImages = [
  require('../../../../assets/images/Informacion/Evaluacion/1.jpg'),
  require('../../../../assets/images/Informacion/Evaluacion/2.jpg'),
  require('../../../../assets/images/Informacion/Evaluacion/3.jpg'),
  require('../../../../assets/images/Informacion/Evaluacion/4.jpg'),
  require('../../../../assets/images/Informacion/Evaluacion/5.jpg'),
];

function Evaluacion({ navigation }) {
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
            Aprende sobre cómo enfrentar una evaluación
          </Text>
        </View>

        <Text style={[GlobalStyle.text, styles.headerDescription]}>
          A continuación, encuentra información sobre cómo afrontar emocionalmente una evaluación.
        </Text>
      </View>

      {/* Sección Blanca con Carrusel */}
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
                <ScrollView
                  maximumZoomScale={3}
                  minimumZoomScale={1}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.zoomContainer}
                >
                  <Image source={image} style={styles.image} />
                </ScrollView>
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
  headerSubtitle: {
    color: '#FFFFFF',
    marginTop: 5,
    textAlign: 'center',
  },
  headerDescription: {
    color: '#FFFFFF',
    marginTop: 10,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomContainer: {
    width: width * 0.95,
    height: height * 0.47,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
    backgroundColor: '#D1D5DB',
  },
});

export default Evaluacion;
