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

function DaeUv({ navigation }) {
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
            DAE - Direccion de asuntos estudiantiles
          </Text>
        </View>

        <View style={styles.contentCard}>
          <View style={styles.videoCard}>
            <YoutubePlayer
              height={Math.max(height * 0.28, 220)}
              width={width * 0.78}
              videoId="k7LKQ6YYm_U"
            />
          </View>

          <Text style={styles.infoText}>
            Si tienes dudas o necesitas ayuda, contactanos mediante los
            siguientes medios:
          </Text>

          <TouchableOpacity
            style={[styles.actionButton, styles.callButton]}
            onPress={() => Linking.openURL('tel:32-2507291')}
          >
            <MaterialCommunityIcons name="phone" size={18} color="#FFF" />
            <Text style={styles.buttonText}>Llamar a N. 1</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.callButton]}
            onPress={() => Linking.openURL('tel:32-2507772')}
          >
            <MaterialCommunityIcons name="phone" size={18} color="#FFF" />
            <Text style={styles.buttonText}>Llamar a N. 2</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.emailButton]}
            onPress={() => Linking.openURL('mailto:dae@uv.cl')}
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
    minHeight: 230,
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
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 18,
    paddingHorizontal: 10,
  },
  actionButton: {
    width: '85%',
    minHeight: 48,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
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
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    flexShrink: 1,
    textAlign: 'center',
  },
});

export default DaeUv;
