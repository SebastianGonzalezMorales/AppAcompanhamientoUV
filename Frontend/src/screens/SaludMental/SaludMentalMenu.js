// react imports
import {
  SafeAreaView,
  Text,
  ScrollView,
  Image,
  View,
  Dimensions,
  StyleSheet,
} from 'react-native';

// customisation
import GlobalStyle from '../../assets/styles/GlobalStyle';

// Components
import SettingsButton from '../../components/buttons/SettingsButton';

const { height } = Dimensions.get('window');

function SaludMentalMenu({ navigation }) {
  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <Text style={GlobalStyle.welcomeText}>Salud mental</Text>
          <Text style={[GlobalStyle.text, styles.heroText]}>
            Descubre recursos y consejos para fortalecer tu bienestar mental,
            con información sobre diversos aspectos de la salud emocional.
            Evalúa tu bienestar a través de tests disponibles en esta sección.
          </Text>

          <Image
            source={require('./../../assets/images/SlidesOnboarding/Icon_Application.png')}
            style={styles.heroImage}
          />
        </View>

        <View style={styles.contentCard}>
          <View style={styles.buttonsWrapper}>
            <SettingsButton
              text="Aprende sobre salud mental"
              onPress={() => navigation.navigate('AprendeSobreSaludMental')}
            />
            <SettingsButton
              text="Realiza un test y evalúa tu bienestar"
              onPress={() => navigation.navigate('Tests')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SaludMentalMenu;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    minHeight: height * 0.38,
    paddingHorizontal: 10,
    paddingBottom: 12,
  },
  heroText: {
    textAlign: 'left',
    color: '#FFFFFF',
    flexShrink: 1,
    lineHeight: 24,
  },
  heroImage: {
    width: '100%',
    height: Math.min(height * 0.18, 160),
    resizeMode: 'contain',
    marginTop: 16,
    alignSelf: 'center',
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
    marginTop: 10,
  },
});
