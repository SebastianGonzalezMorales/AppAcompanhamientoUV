// react imports
import {
  SafeAreaView,
  Text,
  ScrollView,
  View,
  Image,
  Dimensions
} from 'react-native';

// customisation
import GlobalStyle from '../../../assets/styles/GlobalStyle';

// Components
import CustomButton from '../../../components/buttons/CustomButton';
import SettingsButton from '../../../components/buttons/SettingsButton';
import AuthButton from '../../../components/buttons/AuthButton';
import BackButton from '../../../components/buttons/BackButton';
const { width, height } = Dimensions.get('window'); // Obtener las dimensiones de la pantalla


function MenuUv({ navigation }) {
  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      <BackButton onPress={() => navigation.goBack()} />

      {/* Sección superior azul con título y subtítulo */}
      <View style={{ height: height * 0.55, padding: 10 }}>
        <Text style={GlobalStyle.welcomeText}>Espacio UV</Text>

        <Text style={GlobalStyle.welcomeText}>Contactarse con apoyo UV</Text>
        <Text style={[GlobalStyle.text, { textAlign: 'justify', color: '#FFFFFF' }]}>
        Accede a los servicios de apoyo para estudiantes y conecta con quienes están para ayudarte.
        </Text>

        {/* Imagen con altura ajustada */}
        <Image
          source={require('../../../assets/images/SlidesOnboarding/Logo_SaludMental_UV.png')}
          style={{
            width: '100%',
            height: height * 0.25, // Ajustar la altura de la imagen al 20% de la pantalla
            resizeMode: 'contain', // Cambiar a 'contain' para evitar recortes
            marginTop: 40
          }}
        />
      </View>


      {/* Contenedor de la segunda sección con fondo blanco y bordes redondeados */}
      <View style={{ flex: 1, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' }}>
        {/* Imagen de encabezado opcional */}


        {/* ScrollView para botones y contenido adicional */}
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View style={{ marginTop: 10 }}>
            <SettingsButton
              text="Asistente social"
              onPress={() => navigation.navigate('AsistenteSocial')}
            />
            <SettingsButton
              text="Conectados UV"
              onPress={() => navigation.navigate('Conectados')}
              textStyle={{
                color: '#d85a77', // Personaliza el color del texto
                fontSize: 16, // Disminuir tamaño de la letra
                textAlign: 'left', // Alinear texto a la izquierda
              }}
            />
            
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default MenuUv;
