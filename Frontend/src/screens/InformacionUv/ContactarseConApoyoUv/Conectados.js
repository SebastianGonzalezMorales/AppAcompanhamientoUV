import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
  ScrollView,
  StyleSheet,
} from "react-native";
import api from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import GlobalStyle from "../../../assets/styles/GlobalStyle";
import BackButton from "../../../components/buttons/BackButton";

import Constants from "expo-constants";
const { API_URL } = Constants.expoConfig?.extra || {};
const { width, height } = Dimensions.get("window");

function Conectados({ navigation }) {
  const [userName, setUserName] = useState("");
  const [userCareer, setUserCareer] = useState("");

  const callNumbers = ["+56998074918", "+56998488316", "+56998530265", "+56998530214"];
  const whatsappNumbers = ["56959446403", "56959446919"];
  const email = "conectadosuv@uv.cl";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const response = await api.post(
            `${API_URL}/user-management/userdata`,
            { token },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const userData = response.data.data;
          setUserName(userData.name);
          setUserCareer(userData.career);
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };
    fetchUserData();
  }, []);

  const makeCall = () => {
    const randomNumber = callNumbers[Math.floor(Math.random() * callNumbers.length)];
    Linking.openURL(`tel:${randomNumber}`).catch(() =>
      alert("No se pudo realizar la llamada. Verifica tu dispositivo.")
    );
  };

  const openWhatsApp = () => {
    const randomNumber = whatsappNumbers[Math.floor(Math.random() * whatsappNumbers.length)];
    const whatsappMessage = `Hola, mi nombre es ${userName}, estudiante de ${userCareer}. Me siento en una situación difícil y necesito orientación emocional. Muchas gracias.`;
    const url = `https://wa.me/${randomNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    Linking.openURL(url).catch(() => alert("Asegúrate de tener WhatsApp instalado."));
  };

  const sendEmail = () => {
    const subject = "[Apoyo emocional - AppAcompañamientoUv]";
    const body = `Hola,
    
Mi nombre es ${userName}, estudiante de la carrera ${userCareer}, y escribo este correo ya que quiero solicitar apoyo emocional. Me siento en una situación difícil que me gustaría compartir con ustedes para recibir orientación.

Muchas gracias.

Quedo atento.`;

    const mailtoURL = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    Linking.openURL(mailtoURL).catch(() => alert("No se pudo abrir el cliente de correo."));
  };

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {/* Header azul */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Conectados UV</Text>
        </View>
        <Text style={[GlobalStyle.text, styles.headerDescription]}>
          Conectados UV: Estamos aquí para apoyarte emocionalmente. Si te sientes mal, no estás solo. ¡Pide ayuda, estamos para escucharte!
        </Text>
      </View>

      {/* Contenedor blanco */}
      <View style={styles.whiteSection}>
        <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 20 }}>
          <Image
            source={require("../../../assets/images/RedesDeApoyo/Conectados/conectados_logo.png")}
            style={styles.logo}
            resizeMode="cover"
          />

          {/* Botones */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, { backgroundColor: "#4CAF50" }]} onPress={makeCall}>
              <Icon name="phone" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Llamar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor: "#25D366" }]} onPress={openWhatsApp}>
              <FontAwesome name="whatsapp" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.button, { backgroundColor: "#2196F3", marginTop: 20, width: "80%" }]} onPress={sendEmail}>
            <Icon name="email" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Enviar correo</Text>
          </TouchableOpacity>
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
  whiteSection: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 10,
    width: "100%",
  },
  logo: {
    width: width * 0.7,
    height: width * 0.4,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default Conectados;
