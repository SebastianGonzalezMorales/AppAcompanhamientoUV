import {
  FlatList,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Modal,
} from "react-native";
import React, { useState } from "react";
import api from "../../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";

// Asigna API_URL desde la configuración
const { API_URL } = Constants.expoConfig?.extra || {};

import CustomButton from "../../../../components/buttons/CustomButton";
import HistoryButton from "../../../../components/buttons/HistoryButton";
import StatsButton from "../../../../components/buttons/StatsButton";
import CircularButton from "../../../../components/buttons/CircularButton";
import BackButton from "../../../../components/buttons/BackButton";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import GlobalStyle from "../../../../assets/styles/GlobalStyle";
import Icon from "react-native-vector-icons/MaterialIcons"; // Íconos de llamada y correo
import FontAwesome from "react-native-vector-icons/FontAwesome"; // Ícono de WhatsApp

function DepressionTestMain({ navigation }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [results, setResults] = useState([]);
  const [lastTest, setLastTest] = useState("Cargando...");
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [seeAllModalVisible, setSeeAllModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [graveCount, setGraveCount] = useState(0);
  const [userName, setUserName] = useState("");
  const [userCareer, setUserCareer] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleCloseAlert = async () => {
    try {
      await AsyncStorage.setItem("alertClosed", "true"); // Guarda el estado de cierre como cadena "true"
      setGraveCount(0); // Oculta la alerta en el estado local
    } catch (error) {
      console.error("Error al guardar el estado de la alerta:", error);
    }
  };

  const initializeTooltip = async () => {
    try {
      const shown = await AsyncStorage.getItem("shownTooltipDepresion");
      if (!shown) {
        setShowTooltip(true);
      } else {
        setShowTooltip(false);
      }
    } catch (error) {
      console.error("Error al inicializar el estado del tooltip:", error);
    }
  };

  const storeTooltipShown = async () => {
    try {
      await AsyncStorage.setItem("shownTooltipDepresion", "true");
      setShowTooltip(false);
    } catch (error) {
      console.error("Error al guardar el estado del tooltip:", error);
    }
  };

  const resetTooltip = async () => {
    try {
      await AsyncStorage.removeItem("shownTooltipDepresion");
      setShowTooltip(true);
    } catch (error) {
      console.error("Error al reiniciar el estado del tooltip:", error);
    }
  };

  const handleLinkPress = () => {
    Linking.openURL("https://pmc.ncbi.nlm.nih.gov/articles/PMC1495268/");
  };

  const sendEmail = () => {
    const email = "dae@uv.cl";
    const subject = "[Atención Salud Mental - AppAcompañamientoUV]";
    const body = `Hola,\n\nMi nombre es ${userName}, estudiante de la carrera ${userCareer}. Realicé el test PHQ-9 en la app de acompañamiento UV, y los resultados concuerdan con mi estado de ánimo actual. Por esta razón, quisiera solicitar apoyo emocional o guía para poder afrontar esta situación.\n\n Mi número de teléfono es el siguiente: ${userPhone}. \n\nQuedo atento a su respuesta.\n\nMuchas gracias.`;
    const mailtoURL = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailtoURL).catch(() =>
      alert("No se pudo abrir el cliente de correo.")
    );
  };

  const handleCallPress = () => {
    Linking.openURL("tel:+56968301655");
  };

  const whatsappNumber = "56968301655";

  const openWhatsApp = () => {
    const message = `Hola, mi nombre es ${userName}, estudiante de ${userCareer}. Acabo de completar el test PHQ-9 en la app de acompañamiento UV y los resultados reflejan lo que estoy sintiendo actualmente. Me gustaría recibir orientación emocional o apoyo. Muchas gracias.`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
    Linking.openURL(url).catch(() =>
      alert(
        "No se pudo abrir WhatsApp. Asegúrate de tener la aplicación instalada."
      )
    );
  };

  // Función para obtener datos del usuario desde la base de datos
  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // Obtener el token
      if (!token) {
        console.error("No se encontró el token");
        return;
      }

      // Consulta a la base de datos para obtener el usuario
      const response = await api.post(
        `${API_URL}/user-management/userdata`,
        { token }, // Envía el token en el cuerpo de la solicitud
        {
          headers: {
            Authorization: `Bearer ${token}`, // Autorización con Bearer Token
          },
        }
      );

      const userData = response.data.data; // Extraer los datos del usuario

      setUserName(userData.name); // Guardar el nombre del usuario
      setUserCareer(userData.career); // Guardar la carrera del usuario
      setUserPhone(userData.phoneNumber);
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const checkAlertStatus = async () => {
        try {
          const alertClosed = await AsyncStorage.getItem("alertClosed");
          console.log("Estado de alertClosed desde AsyncStorage:", alertClosed);
          return alertClosed === "true";
        } catch (error) {
          console.error("Error al verificar el estado de la alerta:", error);
          return false;
        }
      };

      const fetchData = async () => {
        try {
          setIsLoading(true);

          // Obtener los datos del usuario
          await fetchUserData();

          // Inicializar tooltip solo una vez al entrar a la vista
          await initializeTooltip();

          const token = await AsyncStorage.getItem("token");
          if (!token) {
            console.error("No se encontró el token");
            return;
          }

          // Obtener userId
          const { data: userResponse } = await api.post(
            `${API_URL}/tokens/userid`,
            { token },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const userId = userResponse.userId;
          if (!userId) {
            console.error("No se encontró userId");
            return;
          }

          // Obtener resultados del test
          const { data: resultsResponse } = await api.post(
            `${API_URL}/resultsTests/get-resultsTestUser/${userId}`,
            { token },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const results = resultsResponse.results || [];

          // Ordenar resultados por fecha
          const formattedResults = results
            .sort((a, b) => new Date(b.created) - new Date(a.created))
            .map(({ _id, severity, created, totalScore }) => ({
              id: _id,
              severity,
              dateData: formatDate(created),
              totalScore: `${totalScore}/27`,
            }));

          const graveResults = formattedResults.filter(
            (result) => result.severity === "Grave"
          );

          const previousGraveCount =
            parseInt(await AsyncStorage.getItem("graveCount"), 10) || 0;
          const currentGraveCount = graveResults.length;

          const isAlertClosed = await checkAlertStatus();

          if (currentGraveCount > 0) {
            if (currentGraveCount > previousGraveCount) {
              console.log(
                "Nuevos resultados graves detectados. Reiniciando alerta."
              );
              await AsyncStorage.removeItem("alertClosed");
              setGraveCount(currentGraveCount); // Mostrar alerta de inmediato
            } else if (!isAlertClosed) {
              setGraveCount(currentGraveCount); // Mostrar alerta si no está cerrada
            } else {
              setGraveCount(0); // Ocultar alerta si está cerrada
            }
          } else {
            setGraveCount(0); // No hay resultados graves
          }

          // Guardar el conteo actual de resultados graves
          await AsyncStorage.setItem(
            "graveCount",
            currentGraveCount.toString()
          );

          // Actualizar resultados y última prueba realizada
          setResults(formattedResults);
          setLastTest(
            formattedResults.length > 0
              ? formattedResults[0].dateData
              : "Sin resultados previos"
          );
        } catch (error) {
          console.error(
            "Error al obtener los resultados:",
            error.response ? error.response.data : error.message
          );
          setErrorMessage(
            "No se pudo establecer conexión con el servidor.\n Revisa tu conexión a Internet e inténtalo nuevamente. 🌐"
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchData(); // Siempre llama a fetchData al regresar a la vista
    }, [])
  );

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      <BackButton onPress={() => navigation.goBack()} />

      {graveCount >= 1 && (
        <View style={styles.alertContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={18} // Ícono más pequeño
              color="#e53935"
              style={{ marginRight: 5 }}
            />
            <Text style={styles.alertTitle}>Atención</Text>
            <TouchableOpacity
              onPress={() => setShowConfirmModal(true)}
              style={{
                backgroundColor: "white",
                borderRadius: 8, // Más circular
                width: 20,
                height: 20,
                justifyContent: "center",
                alignItems: "center",
                elevation: 2,
              }}
            >
              <MaterialCommunityIcons name="close" size={12} color="#e53935" />
            </TouchableOpacity>
          </View>

          <Text
            style={[styles.alertMessage, { marginBottom: 5, lineHeight: 18 }]}
          >
            Hemos detectado que podrías estar atravesando una situación difícil.
          </Text>

          <Text
            style={[
              styles.alertSubMessage,
              { marginBottom: 10, lineHeight: 16 },
            ]}
          >
            Por favor, contáctanos a través de una de las siguientes opciones:
          </Text>

          {/* Botones en una sola fila */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            <TouchableOpacity
              onPress={handleCallPress}
              style={styles.smallButton}
            >
              <Icon
                name="phone"
                size={14}
                color="white"
                style={{ marginRight: 3 }}
              />
              <Text style={styles.smallButtonText}>Llamar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={openWhatsApp} style={styles.smallButton}>
              <FontAwesome
                name="whatsapp"
                size={14}
                color="white"
                style={{ marginRight: 3 }}
              />
              <Text style={styles.smallButtonText}>Mensaje</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={sendEmail}
              style={[styles.smallButton, { backgroundColor: "#2196F3" }]}
            >
              <Icon
                name="email"
                size={14}
                color="white"
                style={{ marginRight: 3 }}
              />
              <Text style={styles.smallButtonText}>Correo</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={{ height: 320 }}>
        <Text style={GlobalStyle.welcomeText}>Test PHQ-9</Text>
        <Text style={[GlobalStyle.subtitle, { marginTop: -10 }]}>
          Test de depresión
        </Text>

        <Text style={[GlobalStyle.text, { textAlign: "justify" }]}>
          El cuestionario PHQ-9 es una herramienta que se utiliza para medir la
          gravedad de la depresión a través de nueve preguntas. Ayuda a
          identificar a las personas que pueden requerir una evaluación o
          tratamiento adicional para la depresión.
        </Text>

        {/* Contenedor del botón con margen izquierdo igual al del texto */}
        <View
          style={{
            marginTop: 5,
            paddingLeft: GlobalStyle.text.paddingLeft || 16, // Asegúrate de que coincida con el padding del texto
            // Si `GlobalStyle.text` no tiene `paddingLeft`, ajusta el valor según corresponda
          }}
        >
          <TouchableOpacity
            onPress={handleLinkPress}
            style={{
              backgroundColor: "#E6F0FF",
              paddingVertical: 4, // Aumenté el padding para mejor apariencia
              paddingHorizontal: 12,
              borderRadius: 4,
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#B0C4DE",
              alignSelf: "flex-start", // Alinea el botón al inicio del contenedor
            }}
          >
            <Ionicons name="link" size={14} color="#1E90FF" />
            <Text
              style={{
                color: "#1E90FF",
                fontSize: 12,
                marginLeft: 4,
                fontWeight: "500",
              }}
            >
              Fuente
            </Text>
          </TouchableOpacity>
        </View>

        <View style={GlobalStyle.line} />

        <Text style={[GlobalStyle.text, { textAlign: "left" }]}>
          Última prueba realizada:{" "}
          {isLoading
            ? "Cargando..."
            : errorMessage
            ? // Si hay error, no mostramos nada más aquí
              "—"
            : results.length === 0
            ? // Sin error pero sin datos
              "Sin resultados previos"
            : // Hay datos
              lastTest}
        </Text>
      </View>

      <View style={GlobalStyle.rowTwo}>
        <View style={GlobalStyle.statsContainer}>
          <Text style={GlobalStyle.statsTitle}>Estadísticas</Text>
          <StatsButton
            onPress={() => navigation.navigate("TestDepresionEstadisticas")}
          />
        </View>

        <HistoryButton
          onPress={() => navigation.navigate("TestDepresionHistorial")}
          textLeft="Resultados"
          textRight="Ver todos"
        />

        {isLoading ? (
          <Text style={{ textAlign: "center", color: "#888", marginTop: 20 }}>
            Cargando resultados...
          </Text>
        ) : errorMessage ? (
          // Solo mostramos el mensaje de error si lo hay
          <Text
            style={{
              textAlign: "center",
              color: "#666",
              fontSize: 16,
              marginTop: 7,
            }}
          >
            {errorMessage}
          </Text>
        ) : results.length === 0 ? (
          // Si no hay error y la lista está vacía
          <Text style={{ textAlign: "center", color: "#888", marginTop: 20 }}>
            Aún no has realizado ningún test. Completa un test para ver tus
            resultados.
          </Text>
        ) : (
          // Finalmente, si no hay error y sí hay datos, mostramos la lista
          <FlatList
            data={results.slice(0, 10)}
            numColumns={1}
            renderItem={({ item }) => (
              <CustomButton
                buttonStyle={{
                  backgroundColor:
                    item.severity === "Normal"
                      ? "#fdf3e4"
                      : item.severity === "Leve"
                      ? "#e4f7f1"
                      : item.severity === "Moderado"
                      ? "#e4eff7"
                      : item.severity === "Moderadamente grave"
                      ? "#f7e4eb"
                      : "#f7d8e3",
                  paddingVertical: 15,
                  paddingHorizontal: 20,
                  marginBottom: 10,
                  borderRadius: 10,
                }}
                onPress={() => {
                  navigation.navigate("ResultView", { documentId: item.id });
                }}
                title={item.severity}
                textOne={item.dateData}
                textTwo={item.totalScore}
                textStyle={{ color: "#af7b56" }}
              />
            )}
          />
        )}
      </View>

      {showTooltip && (
        <>
          <View style={styles.tooltipContainer}>
            <Text style={styles.tooltipTextStyle}>
              ¡Pulsa aquí para iniciar tu primer test!
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowTooltip(false);
                storeTooltipShown();
              }}
              style={styles.tooltipButton}
            >
              <Text style={styles.tooltipButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
          <Animatable.View
            animation="bounce"
            easing="ease-in-out"
            iterationCount="infinite"
            style={styles.arrowContainer}
          >
            <MaterialCommunityIcons
              name="arrow-down"
              size={30}
              color="#9F8758"
            />
          </Animatable.View>
        </>
      )}

      <Animatable.View
        animation="pulse"
        easing="ease-in-out"
        duration={800}
        iterationCount="infinite"
        style={styles.floatingButtonContainer}
      >
        <CircularButton
          onPress={async () => {
            setShowTooltip(false);
            await storeTooltipShown();
            navigation.navigate("DepressionTestForm");
          }}
          setVisble={false}
        />
      </Animatable.View>

      <View style={{ position: "absolute", top: 100, right: 20 }}>
        {/*         <TouchableOpacity
          onPress={resetTooltip}
          style={{ backgroundColor: '#ddd', padding: 10, borderRadius: 5 }}
        >
          <Text>Reset Tooltip</Text>
        </TouchableOpacity> */}
      </View>
      <Modal
        transparent={true}
        animationType="fade"
        visible={showConfirmModal}
        onRequestClose={() => setShowConfirmModal(false)} // Cerrar al presionar fuera
      >
        <View style={styles.modalOverlay}>
          <View style={styles.customModal}>
            {/* Título del modal */}
            <Text style={styles.modalTitle}>Cerrar alerta</Text>

            {/* Mensaje de confirmación */}
            <Text style={styles.modalMessage}>
              ¿Estás seguro de que quieres cerrar esta alerta?
            </Text>

            {/* Botones */}
            <View style={styles.modalButtonContainer}>
              {/* Confirmar cerrar */}
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#E53935" }]}
                onPress={() => {
                  setShowConfirmModal(false); // Cerrar el modal
                  handleCloseAlert(); // Cierra la alerta y guarda el estado
                }}
              >
                <Text style={styles.modalButtonText}>Cerrar alerta</Text>
              </TouchableOpacity>

              {/* Cancelar */}
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#E0E0E0" }]}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: "#333" }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  floatingButtonContainer: {
    position: "absolute",
    bottom: 22,
    right: 30,
    backgroundColor: "#FFF",
    padding: 5,
    borderRadius: 50,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  tooltipContainer: {
    position: "absolute",
    bottom: "12%",
    right: "10%",
    width: "40%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  tooltipTextStyle: {
    color: "#888",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 10,
  },

  tooltipButton: {
    backgroundColor: "#9F8758",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },

  tooltipButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  arrowContainer: {
    position: "absolute",
    bottom: 109,
    right: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  alertTitle: {
    color: "#e53935",
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },

  alertMessage: {
    color: "#e53935",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "justify",
    marginTop: 8,
    fontWeight: "bold",
  },

  alertSubMessage: {
    color: "#333",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "justify",
    marginTop: 5,
  },

  button: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14, // Texto más compacto
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro transparente
    justifyContent: "center",
    alignItems: "center",
  },
  customModal: {
    width: "85%",
    backgroundColor: "#fffdf7", // Fondo similar al de las alertas
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    elevation: 10, // Sombra suave
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e53935", // Rojo de alerta
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
  smallButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 6, // Menor padding
    paddingHorizontal: 10,
    borderRadius: 8,
    marginHorizontal: 2, // Espacio entre botones
    elevation: 3,
  },

  smallButtonText: {
    color: "white",
    fontSize: 12, // Texto más pequeño
    fontWeight: "500",
  },

  alertContainer: {
    padding: 10,
    backgroundColor: "#fff3e0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ffd699",
    paddingVertical: 10, // Ajusta la altura interna
    paddingHorizontal: 25, // Reduce el margen lateral
  },
});

export default DepressionTestMain;
