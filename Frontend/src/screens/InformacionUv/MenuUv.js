import React from "react";
import { SafeAreaView, Text, ScrollView, View, Image, Dimensions, StyleSheet } from "react-native";
import GlobalStyle from "../../assets/styles/GlobalStyle";
import SettingsButton from "../../components/buttons/SettingsButton";

const { height } = Dimensions.get("window");

function MenuUv({ navigation }) {
  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {/* Encabezado azul sin botón */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Espacio UV</Text>
        <Text style={[GlobalStyle.text, styles.headerDescription]}>
          Descubre novedades, eventos y toda la información sobre salud mental de la Universidad de Valparaíso.
        </Text>

        <Image
          source={require("../../assets/images/Uv_Logo_White.png")}
          style={styles.headerImage}
        />
      </View>

      {/* Sección blanca con scroll de botones */}
      <View style={styles.whiteSection}>
        <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={true}>
          <SettingsButton
            text="Accede a servicios y apoyo estudiantil"
            onPress={() => navigation.navigate("InformacionUv")}
          />
          <SettingsButton
            text="Explora lo más reciente de la UV"
            onPress={() => navigation.navigate("RedesSociales")}
          />
          <SettingsButton
            text="Contactarse con apoyo UV"
            onPress={() => navigation.navigate("ContactarseConApoyoUV")}
            backgroundColor="#fbcdd1"
            textColor="#F20C0C"
            iconColor="#c62828"
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
    alignItems: "center", // Centrar título
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
    height: height * 0.15,
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

export default MenuUv;
