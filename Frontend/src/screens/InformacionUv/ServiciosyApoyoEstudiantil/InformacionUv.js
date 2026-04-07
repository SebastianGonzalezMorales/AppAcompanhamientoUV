import {
  SafeAreaView,
  Text,
  View,
  FlatList,
  Dimensions,
  StyleSheet,
} from 'react-native';

// Customisation
import GlobalStyle from '../../../assets/styles/GlobalStyle';

// Components
import BackButton from '../../../components/buttons/BackButton';
import GridSettingsButton from '../../../components/buttons/GridSettingsButton';

const { height } = Dimensions.get('window');

function InformacionUv({ navigation }) {
  const servicios = [
    { text: 'DAE', screen: 'DaeUv', imageSource: require('../../../assets/images/RedesDeApoyo/Dae.png') },
    { text: 'APPA', screen: 'AppaUv', imageSource: require('../../../assets/images/RedesDeApoyo/Appa.png') },
    { text: 'Conectados', screen: 'ConectadosUv', imageSource: require('../../../assets/images/RedesDeApoyo/Conectados/conectados_logo.png') },
    { text: 'UV Inclusiva', screen: 'UvInclusiva', imageSource: require('../../../assets/images/RedesDeApoyo/UvInclusiva.png') },
    { text: 'Unidad de salud', screen: 'UnidadDeSalud', imageSource: require('../../../assets/images/RedesDeApoyo/AreaDeSaluddd.png') },
    { text: 'Unidad primera de infancia', screen: 'UnidadPrimeraInfancia', imageSource: require('../../../assets/images/RedesDeApoyo/AreaDePrimeraInfancia.png') },
    { text: 'Unidad deporte y recreación', screen: 'AreaDeporteyRecreacion', imageSource: require('../../../assets/images/RedesDeApoyo/druv.png') },
    { text: 'Unidad de atención arancelaria', screen: 'AreaDeAtencionArancelaria', imageSource: require('../../../assets/images/RedesDeApoyo/ArancelesUv.png') },
    { text: 'Tne', screen: 'Tne', imageSource: require('../../../assets/images/RedesDeApoyo/tne.png') },
    { text: 'Baes', screen: 'Baes', imageSource: require('../../../assets/images/RedesDeApoyo/baes.png') },
  ];

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      <BackButton onPress={() => navigation.goBack()} />
      <View style={styles.heroSection}>
        <Text style={GlobalStyle.welcomeText}>Espacio UV</Text>
        <Text style={[GlobalStyle.subtitleMenu, styles.heroSubtitle]}>
          Servicios y apoyo estudiantil
        </Text>
        <Text style={[GlobalStyle.text, styles.heroText]}>
          Conoce los servicios creados para ayudarte en tu experiencia
          universitaria, desde salud y bienestar hasta inclusión y recreación.
        </Text>
      </View>

      <View style={styles.contentCard}>
        <FlatList
          data={servicios}
          keyExtractor={(item) => item.text}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <GridSettingsButton
                text={item.text}
                imageSource={item.imageSource}
                onPress={() => navigation.navigate(item.screen)}
              />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

export default InformacionUv;

const styles = StyleSheet.create({
  heroSection: {
    minHeight: height * 0.22,
    padding: 10,
    paddingBottom: 12,
  },
  heroSubtitle: {
    color: '#FFFFFF',
    marginTop: 8,
  },
  heroText: {
    textAlign: 'justify',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  contentCard: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  listContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  gridItem: {
    width: '48%',
  },
});
