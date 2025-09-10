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

// Customisation
import GlobalStyle from "../../../assets/styles/GlobalStyle";

// Components
import BackButton from "../../../components/buttons/BackButton";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Constants from "expo-constants";
const { API_URL, BASE_URL } = Constants.expoConfig?.extra || {};
const { width, height } = Dimensions.get("window");

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
          setErrorMessage("No se encontró el token. Inicia sesión para continuar.");
        }
      } catch (error) {
        setErrorMessage("No se pudo conectar al servidor. Verifica tu conexión. 🌐");
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchAssistantData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
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
        } else {
          setErrorMessage("No se encontró el token. Inicia sesión para continuar.");
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setAssistant(null);
        } else if (error.response && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("No se pudo conectar al servidor. Verifica tu conexión.");
        }
      }
    };

    if (userCareer) {
      fetchAssistantData();
    }
  }, [userCareer]);

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {/* Header azul */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Asistente social</Text>
        </View>
        <Text style={[GlobalStyle.text, styles.headerDescription]}>
          {firstName
            ? `${firstName}, te presentamos a la asistente social asignada a tu carrera. Ella es tu primer contacto para recibir orientación y apoyo. Posteriormente, en caso de ser necesario podrás recibir atención psicológica.`
            : errorMessage
            ? ""
            : "Cargando..."}
        </Text>
      </View>

      {/* Contenedor blanco */}
      <View style={styles.whiteSection}>
        {errorMessage ? (
          <View style={{ alignItems: "center", marginVertical: 12 }}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={width * 0.08}
              color="#666"
              style={{ marginBottom: 8 }}
            />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : assistant ? (
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <View style={styles.card}>
              {imageData ? (
                <Image
                  source={{ uri: imageData }}
                  style={styles.assistantImage}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.loadingText}>Cargando imagen...</Text>
              )}

              <Text style={styles.assistantLocation}>{assistant.location}</Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#4CAF50" }]}
                  onPress={() => Linking.openURL(`tel:${assistant.phone}`)}
                >
                  <Icon name="phone" size={width * 0.05} color="white" style={{ marginRight: 8 }} />
                  <Text style={styles.buttonText}>Llamar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#2196F3" }]}
                  onPress={() => {
                    const fullName = secondName ? `${firstName} ${secondName}` : firstName;
                    const assistantFirstName = assistant?.name
                      ? assistant.name.trim().split(" ")[0]
                      : "Asistente";
                    Linking.openURL(
                      `mailto:${assistant.email}?subject=[Atención Salud Mental - AppAcompañamientoUV]&body=Estimada ${assistantFirstName},%0D%0A%0D%0A` +
                      `Junto con saludar y esperando que se encuentre bien, le escribo este correo porque quiero contar con acompañamiento psicológico.%0D%0A%0D%0A` +
                        `Datos del estudiante:%0D%0A- Nombre: ${fullName}.%0D%0A- Carrera: ${userCareer}.%0D%0A- RUT: ${userRut}.%0D%0A- Teléfono: ${userPhone}.%0D%0A%0D%0AQuedo atento.%0D%0A%0D%0AMuchas gracias.`
                    );
                  }}
                >
                  <Icon name="email" size={width * 0.05} color="white" style={{ marginRight: 8 }} />
                  <Text style={styles.buttonText}>Enviar correo</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        ) : (
          !errorMessage && <Text style={styles.loadingText}>Cargando datos...</Text>
        )}
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
    overflow: "hidden",
    marginTop: 10,
  },
  card: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  assistantImage: {
    width: "100%",
    height: width * 0.6,
    borderRadius: 10,
    marginBottom: 10,
  },
  assistantLocation: {
    fontSize: width * 0.04,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: width * 0.04,
  },
  loadingText: {
    textAlign: "center",
    color: "#999",
    fontSize: width * 0.04,
    marginTop: 20,
  },
  errorText: {
    textAlign: "center",
    color: "#666",
    fontSize: width * 0.04,
    fontWeight: "500",
    lineHeight: 22,
    paddingHorizontal: width * 0.1,
  },
});

export default AsistenteSocial;
