import React from "react";
import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
  Linking,
} from "react-native";
import GlobalStyle from "../../../assets/styles/GlobalStyle";
import BackButton from "../../../components/buttons/BackButton";

const { width, height } = Dimensions.get("window");

const openInstagram = (url) => {
  Linking.openURL(url);
};

const RedesSociales = ({ navigation }) => {
  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {/* Header azul */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Redes Sociales</Text>
        </View>
        <Text style={[GlobalStyle.text, styles.headerDescription]}>
          Entérate de lo que pasa en la UV con un solo clic. Accede a las redes sociales oficiales y mantente al tanto de actividades y novedades.
        </Text>
      </View>

      {/* Contenedor blanco */}
      <View style={styles.whiteSection}>
        <ScrollView contentContainerStyle={{ padding: width * 0.05 }}>
          {/* Secciones de redes */}
          <Text style={GlobalStyle.titleWhite}>Vida estudiantil y apoyo</Text>
          <View style={GlobalStyle.storiesContainer}>
            <TouchableOpacity onPress={() => openInstagram("https://www.instagram.com/daeuvalpo/")}>
              <View style={GlobalStyle.outerContainer}>
                <Image
                  source={require("./../../../assets/images/Instagram/DaeUV.jpeg")}
                  style={GlobalStyle.storyImage}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => openInstagram("https://www.instagram.com/buentratoyconvivenciauv/")}>
              <View style={GlobalStyle.outerContainer}>
                <Image
                  source={require("./../../../assets/images/Instagram/BuenTratoYConvivenciaUV.jpeg")}
                  style={GlobalStyle.storyImage}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => openInstagram("https://www.instagram.com/conectadosuv_dae/")}>
              <View style={GlobalStyle.outerContainer}>
                <Image
                  source={require("./../../../assets/images/Instagram/ConectadosUV1.png")}
                  style={GlobalStyle.storyImage}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => openInstagram("https://www.instagram.com/viveuv.saludable/")}>
              <View style={GlobalStyle.outerContainer}>
                <Image
                  source={require("./../../../assets/images/Instagram/ViveUVSaludable.png")}
                  style={GlobalStyle.storyImage}
                />
              </View>
            </TouchableOpacity>
          </View>

          <Text style={GlobalStyle.titleWhite}>Institucional y universitario</Text>
          <View style={GlobalStyle.storiesContainer}>
            <TouchableOpacity onPress={() => openInstagram("https://www.instagram.com/uvalpochile/")}>
              <View style={GlobalStyle.outerContainer}>
                <Image
                  source={require("./../../../assets/images/Instagram/UValpoChile.jpeg")}
                  style={GlobalStyle.storyImage}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => openInstagram("https://www.instagram.com/federacionuv/")}>
              <View style={GlobalStyle.outerContainer}>
                <Image
                  source={require("./../../../assets/images/Instagram/FeUV.png")}
                  style={GlobalStyle.storyImage}
                />
              </View>
            </TouchableOpacity>
          </View>

          <Text style={GlobalStyle.titleWhite}>Deporte y recreación</Text>
          <View style={GlobalStyle.storiesContainer}>
            <TouchableOpacity onPress={() => openInstagram("https://www.instagram.com/deportesyrecreacionuv/?hl=es")}>
              <View style={GlobalStyle.outerContainer}>
                <Image
                  source={require("./../../../assets/images/Instagram/Druv.jpeg")}
                  style={GlobalStyle.storyImage}
                />
              </View>
            </TouchableOpacity>
          </View>

          <Text style={GlobalStyle.titleWhite}>Ciencia y conocimiento</Text>
          <View style={GlobalStyle.storiesContainer}>
            <TouchableOpacity onPress={() => openInstagram("https://www.instagram.com/cienciaabiertauv/")}>
              <View style={GlobalStyle.outerContainer}>
                <Image
                  source={require("./../../../assets/images/Instagram/CienciaAbiertaUV.jpeg")}
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

const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
    backgroundColor: "#000C7B",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    flex: 1,
    marginLeft: 12,
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    flexWrap: "wrap",
    flexShrink: 1,
  },
  headerSubtitle: {
    marginTop: 5,
    color: "#FFFFFF",
    fontSize: 16,
  },
  headerDescription: {
    marginTop: 8,
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "justify",
  },
  whiteSection: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 10,
  },
});

export default RedesSociales;
