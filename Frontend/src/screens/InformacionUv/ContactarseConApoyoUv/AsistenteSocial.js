import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  ScrollView,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import api from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from "buffer";

import GlobalStyle from "../../../assets/styles/GlobalStyle";

import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import BackButton from "../../../components/buttons/BackButton";

import Constants from "expo-constants";

const { API_URL, BASE_URL } = Constants.expoConfig?.extra || {};
const { height } = Dimensions.get("window");

function AsistenteSocial({ navigation }) {
  const [assistant, setAssistant] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [imageData, setImageData] = useState(null);
  const [userRut, setUserRut] = useState("");
  const [userCareer, setUserCareer] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
          const nameParts = userData.name.trim().split(/\s+/);
          setFirstName(nameParts[0] || "");
          setSecondName(nameParts[1] || "");
          setUserRut(userData.rut);
          setUserCareer(userData.career);
          setUserPhone(userData.phoneNumber);
        } else {
          setErrorMessage(
            "No se encontró el token. Inicia sesión para continuar."
          );
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        setErrorMessage(
          "No se pudo conectar al servidor. Verifica tu conexión. 🌐"
        );
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchAssistantData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setErrorMessage(
            "No se encontró el token. Inicia sesión para continuar."
          );
          return;
        }

        const response = await api.get(`${API_URL}/assistants/${userCareer}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const assistantData = response.data.assistant;

        if (assistantData.imageUrl) {
          assistantData.imageUrl = assistantData.imageUrl.replace(
            "http://localhost:3001",
            BASE_URL
          );
        }

        setAssistant(assistantData);

        if (assistantData.imageUrl) {
          const imageResponse = await api.get(assistantData.imageUrl, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "arraybuffer",
          });
          const base64Image = `data:image/jpeg;base64,${Buffer.from(
            imageResponse.data,
            "binary"
          ).toString("base64")}`;
          setImageData(base64Image);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setAssistant(null);
        } else if (error.response && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage(
            "No se pudo conectar al servidor. Verifica tu conexión."
          );
        }
      }
    };

    if (userCareer) {
      fetchAssistantData();
    }
  }, [userCareer]);

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={GlobalStyle.welcomeText}>Contactarse con apoyo UV</Text>
          <Text style={[GlobalStyle.text, styles.heroSmallTitle]}>
            Asistente social
          </Text>
          <Text style={[GlobalStyle.text, styles.heroText]}>
            {firstName
              ? `${firstName}, te presentamos a la asistente social asignada a tu carrera. Ella es tu primer contacto para recibir orientación y apoyo. Posteriormente, en caso de ser necesario podrás recibir atención psicológica.`
              : errorMessage
              ? ""
              : "Cargando..."}
          </Text>
        </View>

        <View style={styles.contentCard}>
          {errorMessage ? (
            <Text style={styles.feedbackText}>{errorMessage}</Text>
          ) : assistant ? (
            <View style={styles.card}>
              {imageData ? (
                <Image
                  source={{ uri: imageData }}
                  style={styles.assistantImage}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.feedbackText}>Cargando imagen...</Text>
              )}

              <Text style={styles.locationText}>{assistant.location}</Text>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.callButton]}
                  onPress={() => Linking.openURL(`tel:${assistant.phone}`)}
                >
                  <Icon name="phone" size={20} color="white" style={styles.actionIcon} />
                  <Text style={styles.actionText}>Llamar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.emailButton]}
                  onPress={() => {
                    const fullName = secondName
                      ? `${firstName} ${secondName}`
                      : firstName;
                    const assistantFirstName = assistant?.name
                      ? assistant.name.trim().split(" ")[0]
                      : "Asistente";

                    Linking.openURL(
                      `mailto:${assistant.email}?subject=[Atención Salud Mental - AppAcompañamientoUV]&body=Estimada ${assistantFirstName},%0D%0A%0D%0A` +
                        `Junto con saludar y esperando que se encuentre bien, le escribo este correo porque quiero contar con acompañamiento psicológico.%0D%0A%0D%0A` +
                        `Datos del estudiante:%0D%0A` +
                        `- Nombre: ${fullName}.%0D%0A` +
                        `- Carrera: ${userCareer}.%0D%0A` +
                        `- RUT: ${userRut}.%0D%0A` +
                        `- Teléfono: ${userPhone}.%0D%0A%0D%0A` +
                        `Quedo atento.%0D%0A%0D%0A` +
                        `Muchas gracias.`
                    );
                  }}
                >
                  <Icon name="email" size={20} color="white" style={styles.actionIcon} />
                  <Text style={styles.actionText}>Enviar correo</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text style={styles.feedbackText}>Cargando datos...</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AsistenteSocial;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    minHeight: height * 0.28,
    padding: 10,
    paddingBottom: 12,
    backgroundColor: "#000C7B",
  },
  heroSmallTitle: {
    textAlign: "left",
    color: "#FFFFFF",
    paddingTop: 10,
  },
  heroText: {
    textAlign: "left",
    color: "#FFFFFF",
    lineHeight: 24,
  },
  contentCard: {
    flexGrow: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  card: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  assistantImage: {
    width: "90%",
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: "center",
  },
  locationText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
  },
  actionButton: {
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    minWidth: 140,
  },
  callButton: {
    backgroundColor: "#4CAF50",
  },
  emailButton: {
    backgroundColor: "#2196F3",
  },
  actionIcon: {
    marginRight: 8,
  },
  actionText: {
    color: "white",
    textAlign: "center",
    flexShrink: 1,
  },
  feedbackText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
});
