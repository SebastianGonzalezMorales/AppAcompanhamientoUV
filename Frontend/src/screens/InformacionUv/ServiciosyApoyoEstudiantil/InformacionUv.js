import React from "react";
import {
  SafeAreaView,
  Text,
  View,
  FlatList,
  Dimensions,
  StyleSheet,
} from "react-native";
import GlobalStyle from "../../../assets/styles/GlobalStyle";

// Components
import BackButton from "../../../components/buttons/BackButton";
import GridSettingsButton from "../../../components/buttons/GridSettingsButton";

const { width, height } = Dimensions.get("window");

const servicios = [
  { text: "DAE", screen: "DaeUv", imageSource: require("../../../assets/images/RedesDeApoyo/Dae.png") },
  { text: "APPA", screen: "AppaUv", imageSource: require("../../../assets/images/RedesDeApoyo/Appa.png") },
  { text: "Conectados", screen: "ConectadosUv", imageSource: require("../../../assets/images/RedesDeApoyo/Conectados/conectados_logo.png") },
  { text: "UV Inclusiva", screen: "UvInclusiva", imageSource: require("../../../assets/images/RedesDeApoyo/UvInclusiva.png") },
  { text: "Unidad de salud", screen: "UnidadDeSalud", imageSource: require("../../../assets/images/RedesDeApoyo/AreaDeSaluddd.png") },
  { text: "Unidad primera de infancia", screen: "UnidadPrimeraInfancia", imageSource: require("../../../assets/images/RedesDeApoyo/AreaDePrimeraInfancia.png") },
  { text: "Unidad deporte y recreación", screen: "AreaDeporteyRecreacion", imageSource: require("../../../assets/images/RedesDeApoyo/druv.png") },
  { text: "Unidad de atención arancelaria", screen: "AreaDeAtencionArancelaria", imageSource: require("../../../assets/images/RedesDeApoyo/ArancelesUv.png") },
  { text: "Tne", screen: "Tne", imageSource: require("../../../assets/images/RedesDeApoyo/tne.png") },
  { text: "Baes", screen: "Baes", imageSource: require("../../../assets/images/RedesDeApoyo/baes.png") },
];

const InformacionUv = ({ navigation }) => {
  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {/* Header azul */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Servicios y apoyo estudiantil</Text>
        </View>
        <Text style={[GlobalStyle.text, styles.headerDescription]}>
          Conoce los servicios creados para ayudarte en tu experiencia universitaria, desde salud y bienestar, hasta inclusión y recreación.
        </Text>
      </View>

      {/* Contenedor blanco */}
      <View style={styles.whiteSection}>
        <FlatList
          data={servicios}
          keyExtractor={(item) => item.text}
          numColumns={2}
          contentContainerStyle={{ padding: 16 }}
          columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 12 }}
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
    fontSize: 22,
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

export default InformacionUv;
