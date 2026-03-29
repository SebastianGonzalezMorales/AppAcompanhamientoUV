import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';

const { width, height } = Dimensions.get('window');

function Conectados({ navigation }) {
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
          <Text style={[GlobalStyle.text, styles.heroText]}>Conectados</Text>
        </View>

        <View style={styles.contentCard}>
          <View style={styles.videoCard}>
            <YoutubePlayer
              height={Math.max(height * 0.28, 220)}
              width={width * 0.78}
              videoId="gFE02gC7plk"
            />
          </View>

          <Text style={styles.infoText}>
            Si necesitas apoyo psicologico, emocional o ayuda para resolver
            conflictos academicos, dirigete al equipo de Apoyo UV utilizando el
            boton a continuacion.
          </Text>

          <TouchableOpacity
            style={styles.navigationButton}
            onPress={() => navigation.navigate('Conectados')}
          >
            <MaterialCommunityIcons
              name="arrow-right-circle"
              size={20}
              color="#FFF"
            />
            <Text style={styles.buttonText}>Ir a Contactarse con apoyo UV</Text>
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
    minHeight: 215,
    padding: 15,
    paddingBottom: 12,
  },
  heroSubtitle: {
    color: '#FFFFFF',
  },
  heroText: {
    textAlign: 'left',
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
  infoText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 18,
    paddingHorizontal: 10,
  },
  navigationButton: {
    width: '85%',
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 16,
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

export default Conectados;
