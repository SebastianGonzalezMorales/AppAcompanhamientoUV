// react imports
import {
  SafeAreaView,
  Text,
  ScrollView,
  View,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';

// customisation
import GlobalStyle from '../../../assets/styles/GlobalStyle';

// Components
import SettingsButton from '../../../components/buttons/SettingsButton';
import BackButton from '../../../components/buttons/BackButton';

const { height } = Dimensions.get('window');

function MenuUv({ navigation }) {
  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={GlobalStyle.welcomeText}>Espacio UV</Text>
          <Text style={GlobalStyle.welcomeText}>Contactarse con apoyo UV</Text>
          <Text style={[GlobalStyle.text, styles.heroText]}>
            Accede a los servicios de apoyo para estudiantes y conecta con
            quienes están para ayudarte.
          </Text>

          <Image
            source={require('../../../assets/images/SlidesOnboarding/Logo_SaludMental_UV.png')}
            style={styles.heroImage}
          />
        </View>

        <View style={styles.contentCard}>
          <View style={styles.buttonsWrapper}>
            <SettingsButton
              text="Asistente social"
              onPress={() => navigation.navigate('AsistenteSocial')}
            />
            <SettingsButton
              text="Conectados UV"
              onPress={() => navigation.navigate('Conectados')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default MenuUv;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    minHeight: height * 0.38,
    padding: 10,
    paddingBottom: 12,
  },
  heroText: {
    textAlign: 'justify',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  heroImage: {
    width: '100%',
    height: Math.min(height * 0.22, 180),
    resizeMode: 'contain',
    marginTop: 18,
  },
  contentCard: {
    flexGrow: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
  },
  buttonsWrapper: {
    marginTop: 2,
  },
});
