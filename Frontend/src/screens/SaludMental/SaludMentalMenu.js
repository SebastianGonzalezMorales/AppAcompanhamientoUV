import React from "react";
import { SafeAreaView, Text, ScrollView, View, Image, Dimensions, StyleSheet } from "react-native";
import GlobalStyle from "../../assets/styles/GlobalStyle";
import SettingsButton from "../../components/buttons/SettingsButton";

const { height } = Dimensions.get("window");

function SaludMentalMenu({ navigation }) {
  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {/* Header azul */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Salud mental</Text>
        <Text style={[GlobalStyle.text, styles.headerDescription]}>
          Descubre recursos y consejos para fortalecer tu bienestar mental, con información sobre diversos aspectos de la salud emocional. Evalúa tu bienestar a través de tests disponibles en esta sección.
        </Text>

        <Image
          source={require("./../../assets/images/SlidesOnboarding/Icon_Application.png")}
          style={styles.headerImage}
        />
      </View>

      {/* Sección blanca con scroll de botones */}
      <View style={styles.whiteSection}>
        <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={true}>
          <SettingsButton
            text="Aprende sobre salud mental"
            onPress={() => navigation.navigate("AprendeSobreSaludMental")}
          />
          <SettingsButton
            text="Realiza un test y evalúa tu bienestar"
            onPress={() => navigation.navigate("Tests")}
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
    alignItems: "center", // Título centrado
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
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

export default SaludMentalMenu;
