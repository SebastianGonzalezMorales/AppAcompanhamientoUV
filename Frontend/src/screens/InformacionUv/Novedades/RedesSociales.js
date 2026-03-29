import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  StyleSheet,
} from 'react-native';
import React from 'react';
import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';

const openInstagram = (url) => {
  Linking.openURL(url);
};

const RedesSociales = ({ navigation }) => {
  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={GlobalStyle.welcomeText}>Espacio UV </Text>
          <Text style={[GlobalStyle.subtitle, styles.heroSubtitle]}>
            Explora lo más reciente de la UV
          </Text>
          <Text style={[GlobalStyle.text, styles.heroText]}>
            Entérate de lo que pasa en la UV con un solo clic. Accede a las
            redes sociales oficiales y mantente al tanto de actividades y
            novedades.
          </Text>
        </View>

        <View style={styles.contentCard}>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RedesSociales;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    minHeight: 200,
    paddingBottom: 12,
  },
  heroSubtitle: {
    textAlign: 'left',
  },
  heroText: {
    textAlign: 'left',
    lineHeight: 24,
  },
  contentCard: {
    flexGrow: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
});
