// react imports
import {
  SafeAreaView,
  Text,
  ScrollView,
  Image,
  View,
  Dimensions
} from 'react-native';

// customisation
import GlobalStyle from '../../assets/styles/GlobalStyle';


//Components
import SettingsButton from '../../components/buttons/SettingsButton';

const { width, height } = Dimensions.get('window'); // Obtener las dimensiones de la pantalla


function SaludMentalMenu({ navigation }) {
  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>

      {/*
       * *********************
       * ***** Section 1 *****
       * *********************
       */}
      {/*
     
         */}
      {/* Section 1 */}
      <View style={{ height: height * 0.5, padding: 10 }}>
        <Text style={GlobalStyle.welcomeText}>Salud mental</Text>
        <Text style={[GlobalStyle.text, { textAlign: 'justify', color: '#FFFFFF' }, ]}>
          Descubre recursos y consejos para fortalecer tu bienestar mental, con información sobre diversos aspectos de la salud emocional. Evalúa tu bienestar a través de tests disponibles en esta sección.
      </Text>

        {/* Imagen con altura ajustada */}
        <Image
                source={require('./../../assets/images/SlidesOnboarding/Icon_Application.png')}

          style={{
            width: '100%',
            height: height * 0.2, // Ajustar la altura de la imagen al 20% de la pantalla
            resizeMode: 'contain', // Cambiar a 'contain' para evitar recortes
            marginTop: 22
          }}
        />
      </View>

   

      {/*
        {/*
       * *********************
       * ***** Section 2 *****
       * *********************
       */}
      <View style={GlobalStyle.rowTwo}>
        <View style={GlobalStyle.statsContainer}>

        </View>
        <ScrollView>
          <View style={{ marginTop: 10 }}>
            <SettingsButton
              text="Aprende sobre salud mental"
              onPress={() => navigation.navigate('AprendeSobreSaludMental')}
            />
            <SettingsButton
              text="Realiza un test y evalúa tu bienestar"
              onPress={() => navigation.navigate('Tests')}
            />
          </View>
        </ScrollView>
      </View>

    </SafeAreaView>
  );
}

export default SaludMentalMenu;
