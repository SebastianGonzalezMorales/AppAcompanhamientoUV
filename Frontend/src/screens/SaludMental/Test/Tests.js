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
import GlobalStyle from '../../../assets/styles/GlobalStyle';

// Components
import BackButton from '../../../components/buttons/BackButton';
import SettingsButton from '../../../components/buttons/SettingsButton';

const { height } = Dimensions.get('window');

function SaludMental({ navigation }) {
  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={GlobalStyle.welcomeText}>Salud mental </Text>
          <Text style={GlobalStyle.subtitle}>Tests psicológicos</Text>
          <Text style={[GlobalStyle.text, styles.heroText]}>
            A continuación, podrás realizar diferentes tests psicológicos para
            conocer mejor tu bienestar emocional y recibir orientación sobre tu
            estado de ánimo.
          </Text>

          <Image
            source={require('../../../assets/images/SlidesOnboarding/test.png')}
            style={styles.heroImage}
          />
        </View>

        <View style={styles.contentCard}>
          <View style={styles.buttonsWrapper}>
            <SettingsButton
              text="Depresión"
              onPress={() => navigation.navigate('DepressionTestMain')}
            />
            <SettingsButton
              text="Ansiedad"
              onPress={() => navigation.navigate('AnsiedadTestMain')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SaludMental;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    minHeight: height * 0.38,
    padding: 10,
    paddingBottom: 14,
  },
  heroText: {
    textAlign: 'left',
    lineHeight: 24,
  },
  heroImage: {
    width: '100%',
    height: Math.min(height * 0.18, 180),
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
    marginTop: 10,
  },
});
