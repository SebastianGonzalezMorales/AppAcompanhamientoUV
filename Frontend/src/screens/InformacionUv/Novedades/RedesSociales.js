import { SafeAreaView, Text, View, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import React from 'react';
import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';

const openInstagram = (url) => {
  Linking.openURL(url);
};

const RedesSociales = ({ navigation }) => {
  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {/* Sección superior azul con el botón, título y subtítulo */}
      <View style={{ height: 220 }}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={GlobalStyle.welcomeText}>Espacio UV </Text>
        <Text style={[GlobalStyle.subtitle, { textAlign: 'left' }]}>Explora lo más reciente de la UV</Text>
        <Text style={[GlobalStyle.text, { textAlign: 'justify' }]}>
          Entérate de lo que pasa en la UV con un solo clic. Accede a las redes sociales oficiales y mantente al tanto de actividades y novedades.
        </Text>
      </View>

      {/* Ajuste de ScrollView para fondo blanco */}
      <View style={{ flex: 1, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' }}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {/* Sección Vida Estudiantil y Apoyo */}
          <Text style={GlobalStyle.titleWhite}>Vida estudiantil y apoyo</Text>
          <View style={GlobalStyle.storiesContainer}>
            <TouchableOpacity onPress={() => openInstagram('https://www.instagram.com/daeuvalpo/')}>
              <View style={GlobalStyle.outerContainer}>
                <Image
                  source={require('./../../../assets/images/Instagram/DaeUV.jpeg')}
                  style={GlobalStyle.storyImage}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openInstagram('https://www.instagram.com/buentratoyconvivenciauv/')}>
              <View style={GlobalStyle.outerContainer}>
                <Image
                  source={require('./../../../assets/images/Instagram/BuenTratoYConvivenciaUV.jpeg')}
                  style={GlobalStyle.storyImage}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openInstagram('https://www.instagram.com/conectadosuv_dae/')}>
              <View style={GlobalStyle.outerContainer}>
                <Image
                  source={require('./../../../assets/images/Instagram/ConectadosUV1.png')}
                  style={GlobalStyle.storyImage}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openInstagram('https://www.instagram.com/viveuv.saludable/')}>
              <View style={GlobalStyle.outerContainer}>
                <Image
                  source={require('./../../../assets/images/Instagram/ViveUVSaludable.png')}
                  style={GlobalStyle.storyImage}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Secciones adicionales */}
          {/* Sección Institucional y Universitario */}
          <Text style={GlobalStyle.titleWhite}>Institucional y universitario</Text>
          <View style={GlobalStyle.storiesContainer}>
            <TouchableOpacity onPress={() => openInstagram('https://www.instagram.com/uvalpochile/')}>
              <View style={GlobalStyle.outerContainer}>
                <Image
                  source={require('./../../../assets/images/Instagram/UValpoChile.jpeg')}
                  style={GlobalStyle.storyImage}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openInstagram('https://www.instagram.com/federacionuv/')}>
              <View style={GlobalStyle.outerContainer}>
                <Image
                  source={require('./../../../assets/images/Instagram/FeUV.png')}
                  style={GlobalStyle.storyImage}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Sección Deporte y Recreación */}
          <Text style={GlobalStyle.titleWhite}>Deporte y recreación</Text>
          <View style={GlobalStyle.storiesContainer}>
            <TouchableOpacity onPress={() => openInstagram('https://www.instagram.com/deportesyrecreacionuv/?hl=es')}>
              <View style={GlobalStyle.outerContainer}>
                <Image
                  source={require('./../../../assets/images/Instagram/Druv.jpeg')}
                  style={GlobalStyle.storyImage}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Sección Ciencia y Conocimiento */}
          <Text style={GlobalStyle.titleWhite}>Ciencia y conocimiento</Text>
          <View style={GlobalStyle.storiesContainer}>
            <TouchableOpacity onPress={() => openInstagram('https://www.instagram.com/cienciaabiertauv/')}>
              <View style={GlobalStyle.outerContainer}>
                <Image
                  source={require('./../../../assets/images/Instagram/CienciaAbiertaUV.jpeg')}
                  style={GlobalStyle.storyImage}
                />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default RedesSociales;
