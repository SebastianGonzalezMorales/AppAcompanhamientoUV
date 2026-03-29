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
import GlobalStyle from '../../assets/styles/GlobalStyle';

// Components
import SettingsButton from '../../components/buttons/SettingsButton';

const { height } = Dimensions.get('window');

function MenuUv({ navigation }) {
  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <Text style={GlobalStyle.welcomeText}>Espacio UV</Text>
          <Text style={[GlobalStyle.text, styles.heroText]}>
            Descubre novedades, eventos y toda la información sobre salud
            mental de la Universidad de Valparaíso.
          </Text>

          <Image
            source={require('../../assets/images/Uv_Logo_White.png')}
            style={styles.heroImage}
          />
        </View>

        <View style={styles.contentCard}>
          <View style={styles.buttonsWrapper}>
            <SettingsButton
              text="Accede a servicios y apoyo estudiantil"
              onPress={() => navigation.navigate('InformacionUv')}
            />
            <SettingsButton
              text="Explora lo más reciente de la UV"
              onPress={() => navigation.navigate('RedesSociales')}
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

export default MenuUv;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    minHeight: height * 0.32,
    padding: 10,
    paddingBottom: 12,
  },
  heroText: {
    textAlign: 'left',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  heroImage: {
    width: '100%',
    height: Math.min(height * 0.16, 140),
    resizeMode: 'contain',
    marginTop: 20,
  },
  contentCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
    flexGrow: 1,
  },
  buttonsWrapper: {
    marginTop: 2,
  },
});
