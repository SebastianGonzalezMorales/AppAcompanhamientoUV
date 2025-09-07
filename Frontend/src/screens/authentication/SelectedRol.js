import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AuthStyle from "../../assets/styles/AuthStyle";

const { width } = Dimensions.get("window");

const SeleccionRol = ({ navigation }) => {

    const clearOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('@viewedOnboarding');
    } catch (error) {
      console.log('Error @clearOnboarding', error);
    }
  };

  return (
    <View style={[{flex: 1}, { backgroundColor: "#000C7B" }]}>
      {/* ==== Sección azul con logo y círculos decorativos ==== */}
      <View style={[AuthStyle.rowOne, { backgroundColor: "#000C7B" }]}>
                <Svg style={{ position: 'absolute' }}>
                  <Circle opacity={0.2} fill="#abced5" cx="10%" cy="30%" r="25" />
                </Svg>
                <Svg style={{ position: 'absolute' }}>
                  <Circle opacity={0.2} fill="#abced5" cx="2%" cy="70%" r="25" />
                </Svg>
                <Svg style={{ position: 'absolute' }}>
                  <Circle opacity={0.2} fill="#abced5" cx="30%" cy="50%" r="30" />
                </Svg>
                <Svg style={{ position: 'absolute' }}>
                  <Circle opacity={0.2} fill="#abced5" cx="25%" cy="95%" r="30" />
                </Svg>
                <Svg style={{ position: 'absolute' }}>
                  <Circle opacity={0.2} fill="#abced5" cx="52%" cy="70%" r="25" />
                </Svg>
                <Svg style={{ position: 'absolute' }}>
                  <Circle opacity={0.2} fill="#abced5" cx="64%" cy="20%" r="25" />
                </Svg>
                <Svg style={{ position: 'absolute' }}>
                  <Circle opacity={0.2} fill="#abced5" cx="70%" cy="100%" r="25" />
                </Svg>
                <Svg style={{ position: 'absolute' }}>
                  <Circle opacity={0.2} fill="#abced5" cx="75%" cy="60%" r="30" />
                </Svg>
                <Svg style={{ position: 'absolute' }}>
                  <Circle opacity={0.2} fill="#abced5" cx="95%" cy="35%" r="25" />
                </Svg>
                <Svg style={{ position: 'absolute' }}>
                  <Circle opacity={0.2} fill="#abced5" cx="100%" cy="85%" r="30" />
                </Svg>
                <SafeAreaView style={AuthStyle.logo}>
                  <TouchableOpacity
                    onPress={clearOnboarding}
                    style={{ marginTop: 20 }}
                  >
                    <Image
                      style={{ width: 130, height: 130 }}
                      source={require('./../../assets/images/SlidesOnboarding/Icon_Application.png')}
                    />
                  </TouchableOpacity>
                </SafeAreaView>
              </View>

      {/* ==== Sección blanca con opciones ==== */}
      <View style={styles.bottomSection}>
        <Text style={styles.title}>¿Quién eres?</Text>

        <View style={styles.row}>
          {/* Funcionarios UV */}
          <TouchableOpacity
            style={[styles.card, { borderColor: "#000C7B" }]}
            activeOpacity={0.8}
            onPress={() =>
            Alert.alert(
            "Vista no disponible", // 🔹 Título
            "Pantalla Funcionarios UV en desarrollo", // 🔹 Mensaje
            [{ text: "OK", onPress: () => console.log("OK presionado") }] // Botón
            )
        }
        >
            <Icon name="briefcase-account" size={60} color="#000C7B" />
            <Text style={[styles.cardText, { color: "#000C7B" }]}>
              Funcionario UV
            </Text>
          </TouchableOpacity>

          {/* Estudiantes */}
          <TouchableOpacity
            style={[styles.card, { borderColor: "#388E3C" }]}
            activeOpacity={0.8}
            onPress={() => navigation.replace("Login")}
          >
            <Icon name="school" size={60} color="#388E3C" />
            <Text style={[styles.cardText, { color: "#388E3C" }]}>
              Estudiante
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSection: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,

    // 👇 Muy importante
    marginTop: 0, // para que se superponga al fondo azul
    overflow: "hidden", // asegura que los bordes redondeados se respeten
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 35,
    color: "#222",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  card: {
    width: width * 0.4,
    height: width * 0.45,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  cardText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});

export default SeleccionRol;
