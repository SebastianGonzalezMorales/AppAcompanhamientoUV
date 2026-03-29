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
const { height, width } = Dimensions.get("window");

function Conectados({ navigation }) {
  const [userName, setUserName] = useState("");
  const [userCareer, setUserCareer] = useState("");

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

  const callNumbers = [
    "+56998074918",
    "+56998488316",
    "+56998530265",
    "+56998530214",
  ];
  const whatsappNumbers = ["56959446403", "56959446919"];

  const makeCall = () => {
    const randomNumber =
      callNumbers[Math.floor(Math.random() * callNumbers.length)];
    Linking.openURL(`tel:${randomNumber}`);
  };

  const openWhatsApp = () => {
    const randomNumber =
      whatsappNumbers[Math.floor(Math.random() * whatsappNumbers.length)];
    const whatsappMessage = `Hola, mi nombre es ${userName}, estudiante de ${userCareer}. Me siento en una situación difícil y necesito orientación emocional. Muchas gracias.`;
    const url = `https://wa.me/${randomNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;
    Linking.openURL(url);
  };

  const sendEmail = () => {
    const email = "dae@uv.cl, conectadosuv@uv.cl";
    const subject = "[Apoyo emocional - AppAcompañamientoUv]";
    const body = `Hola,

Mi nombre es ${userName}, estudiante de la carrera ${userCareer}, y escribo este correo ya que quiero solicitar apoyo emocional. Me siento en una situación difícil que me gustaría compartir con ustedes para recibir orientación.

Muchas gracias.

Quedo atento.`;

    const mailtoURL = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailtoURL);
  };

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BackButton onPress={() => navigation.goBack()} />

        <View style={styles.heroSection}>
          <Text style={GlobalStyle.welcomeText}>Contactarse con apoyo UV</Text>
          <Text style={[GlobalStyle.text, styles.heroTitle]}>Conectados UV</Text>
          <Text style={[GlobalStyle.text, styles.heroText]}>
            Estamos aquí para apoyarte emocionalmente. Si te sientes mal, no
            estás solo.
          </Text>
          <Text style={[GlobalStyle.text, styles.highlightText]}>
            ¡Pide ayuda, estamos para escucharte!
          </Text>
        </View>

        <View style={styles.contentCard}>
          <Image
            source={require("../../../assets/images/RedesDeApoyo/Conectados/conectados_logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={[styles.actionButton, styles.callButton]} onPress={makeCall}>
              <Icon name="phone" size={20} color="white" style={styles.actionIcon} />
              <Text style={styles.actionText}>Llamar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, styles.whatsappButton]} onPress={openWhatsApp}>
              <FontAwesome
                name="whatsapp"
                size={20}
                color="white"
                style={styles.actionIcon}
              />
              <Text style={styles.actionText}>Enviar mensaje</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.actionButton, styles.emailButton]} onPress={sendEmail}>
            <Icon name="email" size={20} color="white" style={styles.actionIcon} />
            <Text style={styles.actionText}>Enviar correo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Conectados;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    minHeight: height * 0.28,
    padding: 10,
    paddingBottom: 12,
  },
  heroTitle: {
    textAlign: "left",
    color: "#FFFFFF",
    paddingTop: 10,
  },
  heroText: {
    textAlign: "left",
    color: "#FFFFFF",
    lineHeight: 24,
  },
  highlightText: {
    textAlign: "left",
    fontWeight: "bold",
    color: "#FFD700",
    lineHeight: 24,
  },
  contentCard: {
    flexGrow: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: width * 0.72,
    height: width * 0.34,
    marginBottom: 20,
  },
  buttonsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    width: "100%",
  },
  actionButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    minWidth: 150,
    paddingHorizontal: 14,
  },
  callButton: {
    backgroundColor: "#4CAF50",
  },
  whatsappButton: {
    backgroundColor: "#25D366",
  },
  emailButton: {
    backgroundColor: "#2196F3",
    width: "80%",
    marginTop: 20,
  },
  actionIcon: {
    marginRight: 8,
  },
  actionText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    flexShrink: 1,
  },
});
