// React imports
import React from 'react';
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

// Components
import BackButton from '../../../components/buttons/BackButton';
import SettingsButton from '../../../components/buttons/SettingsButton';

const { height } = Dimensions.get('window');

function AprendeSobreSaludMental({ navigation }) {
  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <BackButton onPress={() => navigation.goBack()} />

          <Text style={[GlobalStyle.welcomeText, styles.heroTitle]}>
            Salud mental
          </Text>
          <Text style={[GlobalStyle.subtitleMenu, styles.heroSubtitle]}>
            Aprende sobre salud mental
          </Text>

          <Text style={[GlobalStyle.text, styles.heroText]}>
            Encuentra herramientas y recursos destinados a fortalecer tu salud
            mental y emocional como estudiante.
          </Text>

          <Image
            source={require('./../../../assets/images/Menu/salud_Mental.png')}
            style={styles.heroImage}
          />
        </View>

        <View style={styles.contentCard}>
          <View style={styles.buttonsWrapper}>
            <SettingsButton
              text="Información"
              onPress={() => navigation.navigate('Informacion')}
            />
            <SettingsButton
              text="Consejos"
              onPress={() => navigation.navigate('Consejos')}
            />
            <SettingsButton
              text="Consejos de estudiantes"
              onPress={() => navigation.navigate('ConsejosDeEstudiantes')}
            />
            <SettingsButton
              text="Redes de apoyo"
              onPress={() => navigation.navigate('RedesDeApoyo')}
              backgroundColor="#FFE0B2"
              textColor="#FF762C"
              iconColor="#E65100"
            />
            <SettingsButton
              text="Contactarse con apoyo UV"
              onPress={() => navigation.navigate('ContactarseConApoyoUV')}
              backgroundColor="#fbcdd1"
              textColor="#F20C0C"
              iconColor="#c62828"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AprendeSobreSaludMental;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    minHeight: height * 0.34,
    padding: 15,
    paddingBottom: 12,
  },
  heroTitle: {
    color: '#FFFFFF',
    marginTop: 0,
  },
  heroSubtitle: {
    color: '#FFFFFF',
    marginTop: 8,
  },
  heroText: {
    textAlign: 'justify',
    color: '#FFFFFF',
    marginTop: 8,
    lineHeight: 24,
  },
  heroImage: {
    width: '100%',
    height: Math.min(height * 0.14, 130),
    resizeMode: 'contain',
    marginTop: 12,
  },
  contentCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingTop: 14,
    paddingBottom: 24,
    flexGrow: 1,
  },
  buttonsWrapper: {
    marginTop: 2,
  },
});
