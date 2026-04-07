import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import Icon from 'react-native-vector-icons/MaterialIcons';

import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';

const { width, height } = Dimensions.get('window');

function UnidadPrimeraInfancia({ navigation }) {
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
          <Text style={[GlobalStyle.text, styles.heroText]}>
            Unidad de primera infancia
          </Text>
        </View>

        <View style={styles.contentCard}>
          <View style={styles.videoCard}>
            <YoutubePlayer
              height={Math.max(height * 0.28, 220)}
              width={width * 0.78}
              videoId="2hFy0kOe_AM"
            />
          </View>

          <Text style={styles.helpText}>
            Si tienes dudas o necesitas apoyo, envianos un correo haciendo clic
            en el boton que aparece a continuacion.
          </Text>

          <TouchableOpacity
            style={styles.emailButton}
            onPress={() => Linking.openURL('mailto:programa.infancia@uv.cl')}
          >
            <Icon name="email" size={20} color="white" style={styles.buttonIcon} />
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
    minHeight: 200,
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
  videoCard: {
    width: width * 0.84,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  helpText: {
    marginTop: 18,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 10,
    lineHeight: 20,
  },
  emailButton: {
    width: '85%',
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    flexShrink: 1,
  },
});

export default UnidadPrimeraInfancia;
