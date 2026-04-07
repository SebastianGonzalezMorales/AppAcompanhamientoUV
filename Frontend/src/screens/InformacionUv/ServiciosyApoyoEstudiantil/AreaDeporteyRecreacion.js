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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';

const { width, height } = Dimensions.get('window');

function AreaDeporteyRecreacion({ navigation }) {
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
            Unidad de deporte y recreacion
          </Text>
        </View>

        <View style={styles.contentCard}>
          <View style={styles.videoCard}>
            <YoutubePlayer
              height={Math.max(height * 0.25, 220)}
              width={width * 0.78}
              videoId="y60M56rfWAg"
            />
          </View>

          <Text style={styles.helpText}>
            Si tienes dudas o necesitas ayuda, contactanos mediante los
            siguientes medios:
          </Text>

          <TouchableOpacity
            style={[styles.actionButton, styles.callButton]}
            onPress={() => Linking.openURL('tel:322508488')}
          >
            <MaterialCommunityIcons name="phone" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Llamar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.emailButton]}
            onPress={() => Linking.openURL('mailto:areadeportes@uv.cl')}
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
    minHeight: 215,
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

export default AreaDeporteyRecreacion;
