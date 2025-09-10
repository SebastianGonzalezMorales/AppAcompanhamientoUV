import React from "react";
import { SafeAreaView, Text, ScrollView, View, Image, Dimensions, StyleSheet } from "react-native";
import GlobalStyle from "../../../assets/styles/GlobalStyle";
import SettingsButton from "../../../components/buttons/SettingsButton";
import BackButton from "../../../components/buttons/BackButton";

const { width, height } = Dimensions.get("window");

function MenuUv({ navigation }) {
  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {/* Encabezado azul */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Contactarse con Apoyo Uv</Text>
        </View>
        <Text style={[GlobalStyle.text, styles.headerDescription]}>
          Accede a los servicios de apoyo para estudiantes y conecta con quienes están disponibles para ayudarte.
        </Text>

        <Image
          source={require("../../../assets/images/SlidesOnboarding/Logo_SaludMental_UV.png")}
          style={styles.headerImage}
        />
      </View>

      {/* Sección blanca con scroll de botones */}
      <View style={styles.whiteSection}>
        <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={true}>
          <SettingsButton
            text="Asistente social"
            onPress={() => navigation.navigate("AsistenteSocial")}
          />
          <SettingsButton
            text="Conectados UV"
            onPress={() => navigation.navigate("Conectados")}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
    backgroundColor: "#000C7B",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
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
  headerDescription: {
    marginTop: 10,
    color: "#FFFFFF",
    textAlign: "justify",
  },
  headerImage: {
    width: "80%",
    height: height * 0.2,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 15,
  },
  whiteSection: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
});

export default MenuUv;
