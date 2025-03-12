// React imports
import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  Text,
  Animated,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

// Custom styles
import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Obtener dimensiones de la pantalla
const { width, height } = Dimensions.get('window');

// Datos de los videos de los estudiantes
const studentVideos = [
  { id: 1, videoId: 'RER9MW267Js', title: '', type: 'video' }, // Eliminado título
];

function AppaUv({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {/* Sección Azul del Encabezado */}
      <View style={{ height: 215, padding: 15 }}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={GlobalStyle.welcomeText}>Espacio UV</Text>
        <Text style={[GlobalStyle.subtitleMenu, { color: '#FFFFFF' }]}>
          Servicios y apoyo estudiantil
        </Text>
        <Text style={[GlobalStyle.text, { textAlign: 'justify', color: '#FFFFFF' }]}>
          Appa UV - Programa de Atención Preferencial a los Primeros Años
        </Text>
      </View>

      {/* Contenedor para el Video */}
      <View style={[GlobalStyle.rowTwo, styles.centeredContainer]}>
        <YoutubePlayer
          height={height * 0.33}
          width={width * 0.8} // Ajuste del ancho
          videoId={studentVideos[0].videoId}
        /> 
             {/* Botones de llamada y correo */}
   <View>
    <Text>

    </Text>
   </View>
        <View>
        <Text style={[styles.infoText,{ marginTop: -35}, {textAlign: 'center'}]}>
          Si tienes dudas o necesitas ayuda, contáctanos mediante los siguientes medios:
        </Text>
        </View>
        <View>
    <Text>

    </Text>
   </View>
        {/* Botón de llamar */}
        <TouchableOpacity
        
        

          style={styles.callButton}
          onPress={() => Linking.openURL('tel:322500000')}
        >
          <MaterialCommunityIcons name="phone" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Llamar al 32250 0000</Text>
        </TouchableOpacity>

        {/* Botón de correo */}
        <TouchableOpacity
          style={styles.emailButton}
          onPress={() => Linking.openURL('mailto:appauv@uv.cl')}
        >
          <MaterialCommunityIcons name="email" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Enviar correo</Text>
        </TouchableOpacity>

      </View>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: 20,
  },
  contactContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50', // Verde para botón de llamada
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: '80%',
    justifyContent: 'center',
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3', // Azul para botón de correo
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: '80%',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default AppaUv;
