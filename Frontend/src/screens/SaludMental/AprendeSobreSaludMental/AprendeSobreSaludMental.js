// React imports
import React from 'react';
import {
  SafeAreaView,
  Text,
  ScrollView,
  View,
  Image,
  Dimensions
} from 'react-native';

// Custom styles
import GlobalStyle from '../../../assets/styles/GlobalStyle';

// Components
import BackButton from '../../../components/buttons/BackButton';
import SettingsButton from '../../../components/buttons/SettingsButton';

const { width, height } = Dimensions.get('window'); // Obtener las dimensiones de la pantalla

function AprendeSobreSaludMental({ navigation }) {
  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>

      {/* Sección Azul del Encabezado */}
      <View style={{ height: height * 0.48, padding: 15 }}>
        {/* Altura ajustada al 50% del tamaño de la pantalla */}
        <BackButton onPress={() => navigation.goBack()} />

        {
          <Text
            style={[
              GlobalStyle.welcomeText,
              { color: '#FFFFFF', marginTop: -10 } // Ajusta el margen superior
            ]}
          >
            Salud mental
          </Text>
        }
        
        <Text style={[GlobalStyle.subtitleMenu, { color: '#FFFFFF', marginTop: -15 }]}>
          Aprende sobre salud mental
        </Text>

        <Text style={[GlobalStyle.text, { textAlign: 'justify', color: '#FFFFFF', marginTop: -10 }]}>
          Encuentra herramientas y recursos destinados a fortalecer tu salud mental y emocional como estudiante.
        </Text>

        {/* Imagen con altura ajustada */}
        <Image
          source={require('./../../../assets/images/Menu/salud_Mental.png')}
          style={{
            width: '100%',
            height: height * 0.10, // Ajustar la altura de la imagen al 20% de la pantalla
            resizeMode: 'contain', // Cambiar a 'contain' para evitar recortes
            marginTop: 3
          }}
        />

        {/* Texto adicional */}
        {/*          <Text style={[GlobalStyle.welcomeText, { color: '#FFFFFF', fontSize: 16, textAlign: 'center', marginTop: 10 }]}>
          ¡ NO HAY SALUD SIN SALUD MENTAL !
        </Text>  */}
      </View>

      {/* Sección de Botones de Navegación */}
      <View style={[GlobalStyle.rowTwo, { marginTop: -10 }]}>
        <ScrollView contentContainerStyle>
          <View style={{ marginTop: 2 }}>
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
              backgroundColor="#FFE0B2" // Naranja claro y cálido
              textColor="#FF762C"       // Naranja oscuro para texto
              iconColor="#E65100"       // Naranja oscuro para icono
            />
            <SettingsButton
              text="Contactarse con apoyo UV"
              onPress={() => navigation.navigate('ContactarseConApoyoUV')}
              backgroundColor="#fbcdd1" // Un rojo más presente y vibrante en el fondo
              textColor="#F20C0C"       // Un rojo más oscuro para el texto
              iconColor="#c62828"       // El mismo rojo oscuro para el icono
            />



          </View>
        </ScrollView>
      </View>

    </SafeAreaView>
  );
}

export default AprendeSobreSaludMental;
