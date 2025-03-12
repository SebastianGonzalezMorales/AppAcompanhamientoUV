import {
  SafeAreaView,
  Text,
  View,
  FlatList,
  Dimensions,
} from 'react-native';

// Customisation
import GlobalStyle from '../../../assets/styles/GlobalStyle';

// Components
import BackButton from '../../../components/buttons/BackButton';
import GridSettingsButton from '../../../components/buttons/GridSettingsButton';

const { width, height } = Dimensions.get('window'); // Obtener las dimensiones de la pantalla

function InformacionUv({ navigation }) {
  // Array de datos para los botones
  const servicios = [
     { text: 'DAE', screen: 'DaeUv', imageSource: require('../../../assets/images/RedesDeApoyo/Dae.png') },
    { text: 'APPA', screen: 'AppaUv', imageSource: require('../../../assets/images/RedesDeApoyo/Appa.png') },
    { text: 'Conectados', screen: 'ConectadosUv', imageSource: require('../../../assets/images/RedesDeApoyo/Conectados/conectados_logo.png') },
      { text: 'UV Inclusiva', screen: 'UvInclusiva' , imageSource: require('../../../assets/images/RedesDeApoyo/UvInclusiva.png') },
   { text: 'Unidad de salud', screen: 'UnidadDeSalud' , imageSource: require('../../../assets/images/RedesDeApoyo/AreaDeSaluddd.png') },
    { text: 'Unidad primera de infancia', screen: 'UnidadPrimeraInfancia', imageSource: require('../../../assets/images/RedesDeApoyo/AreaDePrimeraInfancia.png') },
    { text: 'Unidad deporte y recreación', screen: 'AreaDeporteyRecreacion', imageSource: require('../../../assets/images/RedesDeApoyo/druv.png')},
   { text: 'Unidad de atención arancelaria', screen: 'AreaDeAtencionArancelaria' , imageSource: require('../../../assets/images/RedesDeApoyo/ArancelesUv.png') },
   { text: 'Tne', screen: 'Tne', imageSource: require('../../../assets/images/RedesDeApoyo/tne.png')},
    { text: 'Baes', screen: 'Baes', imageSource: require('../../../assets/images/RedesDeApoyo/baes.png')},
  ];

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      <BackButton onPress={() => navigation.goBack()} />
      {/* Sección superior azul con título y subtítulo */}
      <View style={{ height: height * 0.25, padding: 10 }}>
        <Text style={GlobalStyle.welcomeText}>Espacio UV</Text>
        <Text style={[GlobalStyle.subtitleMenu, { color: '#FFFFFF', marginTop:-15  }]}>
          Servicios y apoyo estudiantil
        </Text>
        <Text style={[GlobalStyle.text, { textAlign: 'justify', color: '#FFFFFF' }]}>
        Conoce los servicios creados para ayudarte en tu experiencia universitaria, desde salud y bienestar hasta inclusión y recreación.
        </Text>
      </View>

      {/* Contenedor de la segunda sección con fondo blanco y bordes redondeados */}
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: 'hidden',
        }}
      >
        {/* FlatList para mostrar los botones en dos columnas */}
        <FlatList
          data={servicios}
          keyExtractor={(item) => item.text}
          numColumns={2} // Número de columnas que deseas mostrar
          contentContainerStyle={{ padding: 10 }} // Reduje el padding para minimizar el espacio en blanco
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10 }} // Espacio entre columnas reducido
          renderItem={({ item }) => (
            <GridSettingsButton
              text={item.text}
              imageSource={item.imageSource}
              onPress={() => navigation.navigate(item.screen)}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

export default InformacionUv;
