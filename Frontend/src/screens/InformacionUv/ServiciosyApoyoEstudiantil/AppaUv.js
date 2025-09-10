import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Animated
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

const studentVideos = [
  { id: 1, videoId: 'RER9MW267Js', title: '', type: 'video' },
];

const AppaUv = ({ navigation }) => {
  const [currentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const makeCall = () => {
    Linking.openURL('tel:322500000').catch(() =>
      alert('No se pudo realizar la llamada. Verifica tu dispositivo.')
    );
  };

  const sendEmail = () => {
    const mailtoURL = `mailto:appauv@uv.cl?subject=${encodeURIComponent(
      '[Apoyo emocional - AppAcompañamientoUv]'
    )}&body=${encodeURIComponent(
      'Hola,\n\nQuisiera solicitar apoyo emocional a través de AppAcompañamiento UV.\n\nGracias.'
    )}`;
    Linking.openURL(mailtoURL).catch(() => alert('No se pudo abrir el cliente de correo.'));
  };

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {/* Header azul */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Appa UV</Text>
        </View>
        <Text style={[GlobalStyle.text, styles.headerDescription]}>
          Es un programa de Atención Preferencial a los Primeros Años. Si tienes dudas o
          necesitas ayuda, contáctanos mediante los medios proporcionados a continuación.
        </Text>
      </View>

      {/* Contenedor blanco con ScrollView */}
      <View style={styles.whiteSection}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <YoutubePlayer
            height={height * 0.33}
            width={width * 0.8}
            videoId={studentVideos[currentIndex].videoId}
          />

          <Text style={styles.infoText}>
            Si tienes dudas o necesitas ayuda, contáctanos mediante los siguientes medios:
          </Text>

          {/* Botón de llamada */}
          <TouchableOpacity style={[styles.button, { backgroundColor: '#4CAF50' }]} onPress={makeCall}>
            <MaterialCommunityIcons name="phone" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Llamar</Text>
          </TouchableOpacity>

          {/* Botón de correo */}
          <TouchableOpacity style={[styles.button, { backgroundColor: '#2196F3' }]} onPress={sendEmail}>
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

export default AppaUv;
