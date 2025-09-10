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
  ScrollView,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

const studentVideos = [
  { id: 2, videoId: 'k7LKQ6YYm_U', type: 'video' },
];

const DaeUv = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const phoneNumbers = ['322507291', '322507772'];
  const email = 'dae@uv.cl';

  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`).catch(() =>
      alert('No se pudo realizar la llamada. Verifica tu dispositivo.')
    );
  };

  const handleEmail = () => {
    const mailtoURL = `mailto:${email}?subject=${encodeURIComponent(
      '[Apoyo estudiantil - DAE UV]'
    )}&body=${encodeURIComponent('Hola, quisiera contactar con DAE UV para solicitar apoyo. Gracias.')}`;
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
          <Text style={styles.headerTitle}>DAE UV</Text>
        </View>
        <Text style={[GlobalStyle.text, styles.headerDescription]}>
          Dirección de Asuntos Estudiantiles - DAE. Si tienes dudas o necesitas ayuda, contáctanos mediante los siguientes medios.
        </Text>
      </View>

      {/* Contenedor blanco con ScrollView */}
      <View style={styles.whiteSection}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Carrusel de videos */}
          <View style={styles.carouselWrapper}>
            <Animated.ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContainer}
            >
              {studentVideos.map((item) => (
                <View key={item.id} style={styles.slide}>
                  <YoutubePlayer
                    height={height * 0.33}
                    width={width * 0.8}
                    videoId={item.videoId}
                  />
                </View>
              ))}
            </Animated.ScrollView>
          </View>

          {/* Texto justo debajo del video */}
          <Text style={styles.infoText}>
            Si tienes dudas o necesitas ayuda, contáctanos mediante los siguientes medios:
          </Text>

          {/* Botones de llamada */}
          {phoneNumbers.map((number, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.button, { backgroundColor: '#4CAF50' }]}
              onPress={() => handleCall(number)}
            >
              <MaterialCommunityIcons name="phone" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Llamar a N.°{index + 1}</Text>
            </TouchableOpacity>
          ))}

          {/* Botón de correo */}
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
    marginBottom: 0, // Sin espacio muerto
  },
  carouselContainer: {
    alignItems: 'center',
  },
  slide: {
    width: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: 0,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 14,
    marginVertical: 15,
    paddingHorizontal: 20,
    color: '#000',
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

export default DaeUv;
