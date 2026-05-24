// React imports
import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Modal,
  Dimensions,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { fetchWithToken } from "../../utils/apiHelpers";

// Componentes personalizados y estilos
import CustomButton from "../../components/buttons/CustomButton";
import HistoryButton from "../../components/buttons/HistoryButton";
import PickMoodButton from "../../components/buttons/PickMoodButton";
import ChartStyle from "../../assets/styles/ChartStyle";
import GlobalStyle from "../../assets/styles/GlobalStyle";
import FormStyle from "../../assets/styles/FormStyle";
import ModalStyle from "../../assets/styles/ModalStyle";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Librerías adicionales
import { PieChart } from "react-native-chart-kit";
import api from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Importar la URL de la API desde variables de entorno
import Constants from "expo-constants";

// Asigna API_URL desde la configuración
const { API_URL } = Constants.expoConfig?.extra || {};
const supportPhoneNumber = "+56968301655";
const supportWhatsAppNumber = "56968301655";
const supportEmail = "dae@uv.cl";

const HomeMood = ({ route, navigation }) => {
  // Estados
  const [name, setName] = useState("");
  const [moods, setMoods] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [showMoodSupportAlert, setShowMoodSupportAlert] = useState(false);
  const [isMoodSupportAlertMinimized, setIsMoodSupportAlertMinimized] =
    useState(false);
  const [showMoodSupportConfirmModal, setShowMoodSupportConfirmModal] =
    useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [motivationalQuote, setMotivationalQuote] = useState("");
  const [pieChartData, setPieChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Obtener mes y año actuales
  const currentMonth = new Date().getMonth(); // Mes actual (0 = enero, 11 = diciembre)
  const currentYear = new Date().getFullYear(); // Año actual

  /*
   * *******************
   * **** Functions ****
   * *******************
   */

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Formato: DD/MM/YYYY
  };

  // Navegar a la pantalla de seguimiento de estado de ánimo
  const startTracking = (mood, value) => {
    navigation.navigate("MoodTrack", {
      mood: mood, // Estado de ánimo seleccionado
      value: value, // Valor de la intensidad del estado de ánimo
    });
  };

  const minimizeMoodSupportAlert = () => {
    setShowMoodSupportConfirmModal(false);
    setIsMoodSupportAlertMinimized(true);
  };

  const expandMoodSupportAlert = () => {
    setIsMoodSupportAlertMinimized(false);
    setShowMoodSupportAlert(true);
  };

  const closeMoodSupportAlert = () => {
    setShowMoodSupportConfirmModal(false);
    setShowMoodSupportAlert(false);
    setIsMoodSupportAlertMinimized(false);
  };

  const callMoodSupport = () => {
    Linking.openURL(`tel:${supportPhoneNumber}`).catch(() => {
      Alert.alert(
        "No se pudo llamar",
        "No se pudo abrir la aplicación de teléfono."
      );
    });
  };

  const sendMoodSupportWhatsApp = () => {
    const message =
      "Hola, estoy usando la app de acompañamiento UV y me gustaría solicitar orientación o apoyo emocional. Muchas gracias.";
    const url = `https://wa.me/${supportWhatsAppNumber}?text=${encodeURIComponent(
      message
    )}`;

    Linking.openURL(url).catch(() => {
      Alert.alert(
        "No se pudo abrir WhatsApp",
        "Asegúrate de tener WhatsApp instalado en tu dispositivo."
      );
    });
  };

  const sendMoodSupportEmail = () => {
    const subject = "[Apoyo emocional - AppAcompañamientoUV]";
    const body =
      "Hola,\n\nEstoy usando la app de acompañamiento UV y me gustaría solicitar orientación o apoyo emocional.\n\nMuchas gracias.";
    const url = `mailto:${supportEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url).catch(() => {
      Alert.alert(
        "No se pudo abrir el correo",
        "No se pudo abrir el cliente de correo."
      );
    });
  };

  // Función para obtener el historial de estados de ánimo
  const fetchMoodHistory = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const response = await api.get(
          `${API_URL}/moodState/get-MoodStatesByUserId`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.data.length === 0) {
          console.log("No se encontraron estados de ánimo para este usuario.");
          setMoods([]);
          setMessage(
            "Aún no has registrado cómo te sientes. ¡Anímate a hacerlo hoy! 😊"
          );
        } else {
          const moodsData = response.data.data
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((item) => {
              const date = formatDate(item.date);
              const time = new Date(item.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return {
                id: item._id,
                mood: item.moodState,
                date,
                time,
              };
            });

          setMoods(moodsData);
          setMessage(""); // limpiamos cualquier mensaje anterior
        }
      } else {
        console.log("No se encontró el token. Por favor, inicia sesión.");
        setMessage("Sesión expirada. Por favor, vuelve a iniciar sesión.");
      }
    } catch (error) {
      console.error("Error al obtener los estados de ánimo:", error);
      setMoods([]);
      setMessage(
        "No se pudo establecer conexión con el servidor.\n Revisa tu conexión a Internet e inténtalo nuevamente. 🌐"
      );
    } finally {
      setLoading(false); // esto asegura que siempre se actualice
    }
  };

  // Función para obtener los datos del gráfico
  const fetchChartData = async () => {
    try {
      const moodDataResponse = await fetchWithToken(
        "/moodState/get-MoodStatesByUserId"
      );

      const moodData = moodDataResponse.data;

      console.log("Datos recibidos de la API:", moodData);

      let mal = 0;
      let regular = 0;
      let bien = 0;
      let excelente = 0;

      moodData.forEach((moodEntry) => {
        const { moodState, date } = moodEntry;

        const entryDate = new Date(date);
        const entryMonth = entryDate.getMonth(); // Extraer mes de la fecha
        const entryYear = entryDate.getFullYear(); // Extraer año de la fecha

        if (entryMonth === currentMonth && entryYear === currentYear) {
          console.log(`Estado de ánimo detectado (${entryDate}):`, moodState);

          switch (moodState) {
            case "Mal":
              mal++;
              break;
            case "Regular":
              regular++;
              break;
            case "Bien":
              bien++;
              break;
            case "Excelente":
              excelente++;
              break;
            default:
              console.log("Estado de ánimo desconocido:", moodState);
              break;
          }
        }
      });

      // Configurar los datos del gráfico de torta
      const data = [
        {
          name: "Mal",
          count: mal,
          color: "#F20C0C", // Color ajustado
          legendFontColor: "#7F7F7F",
          legendFontSize: 14,
        },
        {
          name: "Regular",
          count: regular,
          color: "#F4D63D", // Color ajustado
          legendFontColor: "#7F7F7F",
          legendFontSize: 14,
        },
        {
          name: "Bien",
          count: bien,
          color: "#2626D8", // Color ajustado
          legendFontColor: "#7F7F7F",
          legendFontSize: 14,
        },
        {
          name: "Excelente",
          count: excelente,
          color: "#32CD32", // Color ajustado
          legendFontColor: "#7F7F7F",
          legendFontSize: 14,
        },
      ];

      console.log("Datos procesados para el gráfico:", data);
      setPieChartData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los estados de ánimo:", error);
      setLoading(false);
    }
  };

  // Función para eliminar un elemento (a completar según tus necesidades)
  const deleteItem = () => {
    if (selectedId) {
      console.log("Document", selectedId, "has been deleted");
      setModalVisible(false);
    } else {
      console.log("Document not found");
    }
  };

  // Función para obtener una frase motivacional
  const fetchMotivationalQuote = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        const response = await api.get(
          `${API_URL}/phraseOfTheDay/get-random-phraseOfTheDay`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Usa el token recuperado
            },
          }
        );
        console.log(`token: ${token}`);
        const { message, author } = response.data;
        console.log(`Mensaje: ${message}`);
        console.log(`Autor: ${author}`);

        const normalizedAuthor = author?.trim();
        setMotivationalQuote(
          normalizedAuthor ? `${message} - ${normalizedAuthor}` : message
        );
      } else {
        console.log("No se encontró el token. Por favor, inicia sesión.");
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
  };

  // Función para obtener datos del usuario
  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const response = await api.post(
          `${API_URL}/user-management/userdata`,
          {
            /*       // Token en el cuerpo de la solicitud
            token: `${token}`, */
          },
          {
            // Token de autorización en el header
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const fullName = response.data.data.name;

        // Verificar que fullName existe y es una cadena
        if (fullName && typeof fullName === "string") {
          // Eliminar espacios en blanco al inicio y al final
          const trimmedName = fullName.trim();

          // Dividir el nombre completo por espacios y tomar el primer nombre
          const firstName = trimmedName.split(" ")[0];

          // Actualizar el estado con el primer nombre
          setName(firstName);

          // Para verificar en la consola
          // console.log('First name:', firstName);
        } else {
          console.log("Nombre no válido recibido del servidor.");
          setName("Usuario"); // Nombre por defecto en caso de fallo
        }
      } else {
        console.log("No se encontró el token. Por favor, inicia sesión.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setName("Usuario"); // Nombre por defecto en caso de error
    }
  };

  /*
   * *********************
   * **** useEffects *****
   * *********************
   */

  // useFocusEffect para actualizar datos cuando la pantalla obtiene el enfoque
  useFocusEffect(
    useCallback(() => {
      fetchMoodHistory();
      fetchChartData();
      fetchMotivationalQuote();
      fetchUserData();
    }, [])
  );

  // useEffect para cargar datos inicialmente
  useEffect(() => {
    fetchMoodHistory();
    fetchChartData();
    fetchMotivationalQuote();
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!route?.params?.showMoodSupportAlert) {
      return;
    }

    setShowMoodSupportAlert(true);
    setIsMoodSupportAlertMinimized(false);
    navigation.setParams({ showMoodSupportAlert: false });
  }, [navigation, route?.params?.showMoodSupportAlert]);

  /*
   * ****************
   * **** Screen ****
   * ****************
   */

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {showMoodSupportAlert && !isMoodSupportAlertMinimized ? (
        <View style={styles.moodSupportAlertContainer}>
          <View style={styles.moodSupportAlertHeader}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={18}
              color="#e53935"
              style={styles.moodSupportAlertHeaderIcon}
            />
            <Text style={styles.moodSupportAlertTitle}>Atención</Text>
            <TouchableOpacity
              onPress={() => setShowMoodSupportConfirmModal(true)}
              style={styles.moodSupportAlertIconButton}
            >
              <MaterialCommunityIcons name="close" size={12} color="#e53935" />
            </TouchableOpacity>
          </View>

          <Text style={styles.moodSupportAlertMessage}>
            Hemos detectado que podrías estar atravesando una situación difícil.
          </Text>

          <Text style={styles.moodSupportAlertSubMessage}>
            Por favor, contáctanos a través de una de las siguientes opciones:
          </Text>

          <View style={styles.moodSupportAlertActions}>
            <TouchableOpacity
              onPress={callMoodSupport}
              style={styles.moodSupportSmallButton}
            >
              <MaterialCommunityIcons
                name="phone"
                size={14}
                color="#fff"
                style={styles.moodSupportSmallButtonIcon}
              />
              <Text style={styles.moodSupportSmallButtonText}>Llamar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={sendMoodSupportWhatsApp}
              style={styles.moodSupportSmallButton}
            >
              <MaterialCommunityIcons
                name="whatsapp"
                size={14}
                color="#fff"
                style={styles.moodSupportSmallButtonIcon}
              />
              <Text style={styles.moodSupportSmallButtonText}>Mensaje</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={sendMoodSupportEmail}
              style={[
                styles.moodSupportSmallButton,
                styles.moodSupportEmailButton,
              ]}
            >
              <MaterialCommunityIcons
                name="email"
                size={14}
                color="#fff"
                style={styles.moodSupportSmallButtonIcon}
              />
              <Text style={styles.moodSupportSmallButtonText}>Correo</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      {showMoodSupportAlert && isMoodSupportAlertMinimized ? (
        <TouchableOpacity
          onPress={expandMoodSupportAlert}
          style={styles.moodSupportMinimizedContainer}
        >
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={15}
            color="#e53935"
            style={styles.moodSupportAlertHeaderIcon}
          />
          <Text style={styles.moodSupportMinimizedText}>Ver alerta</Text>
          <MaterialCommunityIcons name="chevron-down" size={16} color="#e53935" />
        </TouchableOpacity>
      ) : null}

      {/*
       * *****************
       * ***** Modal *****
       * *****************
       */}

      {/* info modal */}
      <Modal
        visible={infoModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setInfoModalVisible(!infoModalVisible);
        }}
      >
        <View style={ModalStyle.smallModalContainer}>
          <View style={ModalStyle.smallModalContent}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={ModalStyle.smallModalTitle}>Tips</Text>
              <MaterialCommunityIcons
                name="close"
                color="#f2f2f2"
                size={30}
                style={ModalStyle.modalToggleExit}
                onPress={() => setInfoModalVisible(!infoModalVisible)}
              />
            </View>
            <Text style={ModalStyle.smallModalText}>1.</Text>
            <Text style={ModalStyle.smallModalTextTwo}>2.</Text>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        animationType="fade"
        visible={showMoodSupportConfirmModal}
        onRequestClose={() => setShowMoodSupportConfirmModal(false)}
      >
        <View style={styles.moodSupportModalOverlay}>
          <View style={styles.moodSupportConfirmModal}>
            <Text style={styles.moodSupportConfirmTitle}>
              Opciones de alerta
            </Text>

            <Text style={styles.moodSupportConfirmMessage}>
              ¿Estás seguro de que quieres cerrar esta alerta?
            </Text>

            <View style={styles.moodSupportConfirmActions}>
              <TouchableOpacity
                style={[
                  styles.moodSupportConfirmButton,
                  styles.moodSupportMinimizeButton,
                ]}
                onPress={minimizeMoodSupportAlert}
              >
                <Text
                  style={[
                    styles.moodSupportConfirmButtonText,
                    styles.moodSupportMinimizeButtonText,
                  ]}
                >
                  Minimizar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.moodSupportConfirmButton,
                  styles.moodSupportCloseButton,
                ]}
                onPress={closeMoodSupportAlert}
              >
                <Text style={styles.moodSupportConfirmButtonText}>
                  Cerrar alerta
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.moodSupportConfirmButton,
                  styles.moodSupportCancelButton,
                ]}
                onPress={() => setShowMoodSupportConfirmModal(false)}
              >
                <Text
                  style={[
                    styles.moodSupportConfirmButtonText,
                    styles.moodSupportCancelButtonText,
                  ]}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
      {/* Espacio hasta la frase del día */}
      <View style={{ marginBottom: 10 }}>
        {/* Saludo */}
        <Text style={[GlobalStyle.welcomeText, { marginBottom: -10 }]}>
          Hola, {name || " "}!
        </Text>

        {/* Pregunta */}
        <Text style={[GlobalStyle.subtitle, styles.questionText]}>
          ¿Cómo te sientes ahora mismo?
        </Text>

        {/* Botones de estados de ánimo */}
        <View style={styles.moodsContainer}>
          <PickMoodButton
            onPress={() => startTracking("Mal", 1)}
            emoji="😞"
            text="Mal"
          />
          <PickMoodButton
            onPress={() => startTracking("Regular", 2)}
            emoji="🙂"
            text="Regular"
          />
          <PickMoodButton
            onPress={() => startTracking("Bien", 3)}
            emoji="😊"
            text="Bien"
          />
          <PickMoodButton
            onPress={() => startTracking("Excelente", 4)}
            emoji="😃"
            text="Excelente"
          />
        </View>

        {/* Frase del día */}
        {/* Frase del día */}
        <View style={styles.quoteSection}>
          <Text style={[GlobalStyle.subtitle, styles.quoteTitle]}>
            Frase del día:
          </Text>

          {motivationalQuote !== "" && (
            <Text
              style={[GlobalStyle.quoteText, styles.quoteText]}
            >
              {motivationalQuote}
            </Text>
          )}
        </View>
      </View>

      {/*
       * *********************
       * ***** Section 2 *****
       * *********************
       */}

      <View style={styles.contentCard}>
        {/* Botón “Estadísticas del último mes” */}
        <View style={GlobalStyle.statsContainer}>
          <HistoryButton
            onPress={() => navigation.navigate("MoodStats")}
            textLeft="Estadísticas del último mes"
            textRight="Ver todo"
          />
        </View>

        <View style={FormStyle.flexContainer}></View>

        {/* ───── PieChart o mensajes de carga / error ───── */}
        {loading ? (
          <Text style={{ textAlign: "center", color: "#666" }}>
            Cargando datos…
          </Text>
        ) : message !== "" ? (
          <Text
            style={{
              textAlign: "center",
              color: "#666",
              fontSize: 16,
              fontWeight: "500",
              paddingHorizontal: 20,
              marginVertical: 12,
              lineHeight: 24,
            }}
          >
            {message}
          </Text>
        ) : (
          <View style={ChartStyle.pieChartContainer}>
            <PieChart
              data={pieChartData}
              width={Dimensions.get("window").width * 0.8}
              height={130}
              chartConfig={{
                backgroundGradientFrom: "#f2f2f2",
                backgroundGradientTo: "#f2f2f2",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(93, 165, 169, ${opacity})`,
              }}
              accessor="count"
              backgroundColor="transparent"
              style={ChartStyle.pieChartStyle}
            />
          </View>
        )}

        {/* ───── “Recientes” y lista: SOLO si no hay error ni carga ───── */}
        {message === "" && !loading && (
          <>
            <HistoryButton
              onPress={() => navigation.navigate("MoodHistory")}
              textLeft="Recientes"
              textRight="Ver todo"
            />

            <ScrollView
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
              style={styles.recentList}
            >
              {moods.slice(0, 5).map((item) => (
                <CustomButton
                  key={item.id}
                  buttonStyle={{
                    backgroundColor:
                      item.mood === "Mal"
                        ? "#f7d8e3"
                        : item.mood === "Regular"
                        ? "#FBEEB0"
                        : item.mood === "Bien"
                        ? "#d8eef7"
                        : "#d8f7ea",
                  }}
                  textStyle={{
                    color:
                      item.mood === "Mal"
                        ? "#F20C0C"
                        : item.mood === "Regular"
                        ? "#F4D63D"
                        : item.mood === "Bien"
                        ? "#2626D8"
                        : "#32CD32",
                  }}
                  title={
                    item.mood === "Mal"
                      ? "😞"
                      : item.mood === "Regular"
                      ? "🙂"
                      : item.mood === "Bien"
                      ? "😊"
                      : "😃"
                  }
                  textOne={item.date}
                  textTwo={item.time}
                  onLongPress={() => {
                    setModalVisible(true);
                    setSelectedId(item.id);
                  }}
                  onPress={() => {
                    navigation.navigate("MoodDetails", { moodId: item.id });
                  }}
                />
              ))}
            </ScrollView>
          </>
        )}
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  moodSupportAlertContainer: {
    position: "absolute",
    top: 72,
    left: 64,
    right: 16,
    zIndex: 20,
    elevation: 8,
    backgroundColor: "#fff3e0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ffd699",
    padding: 10,
  },
  moodSupportAlertHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  moodSupportAlertHeaderIcon: {
    marginRight: 5,
  },
  moodSupportAlertTitle: {
    color: "#e53935",
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  moodSupportAlertIconButton: {
    marginLeft: 6,
    backgroundColor: "white",
    borderRadius: 8,
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  moodSupportAlertMessage: {
    color: "#e53935",
    fontSize: 14,
    lineHeight: 18,
    textAlign: "justify",
    marginTop: 8,
    marginBottom: 5,
    fontWeight: "bold",
  },
  moodSupportAlertSubMessage: {
    color: "#333",
    fontSize: 14,
    lineHeight: 16,
    textAlign: "justify",
    marginTop: 5,
    marginBottom: 10,
  },
  moodSupportAlertActions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
  },
  moodSupportSmallButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginHorizontal: 2,
    marginTop: 4,
    elevation: 3,
  },
  moodSupportEmailButton: {
    backgroundColor: "#2196F3",
  },
  moodSupportSmallButtonIcon: {
    marginRight: 3,
  },
  moodSupportSmallButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  moodSupportMinimizedContainer: {
    position: "absolute",
    top: 48,
    right: 18,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 248, 238, 0.96)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ffd699",
    paddingVertical: 8,
    paddingHorizontal: 10,
    maxWidth: 170,
    zIndex: 20,
    elevation: 5,
  },
  moodSupportMinimizedText: {
    color: "#e53935",
    fontSize: 13,
    fontWeight: "600",
    marginRight: 4,
    flexShrink: 1,
  },
  moodSupportModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  moodSupportConfirmModal: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    elevation: 10,
  },
  moodSupportConfirmTitle: {
    color: "#e53935",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  moodSupportConfirmMessage: {
    color: "#333",
    fontSize: 15,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 18,
  },
  moodSupportConfirmActions: {
    width: "100%",
    alignItems: "stretch",
  },
  moodSupportConfirmButton: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  moodSupportMinimizeButton: {
    backgroundColor: "#F3E5AB",
  },
  moodSupportCloseButton: {
    backgroundColor: "#E53935",
  },
  moodSupportCancelButton: {
    backgroundColor: "#E0E0E0",
  },
  moodSupportConfirmButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  moodSupportMinimizeButtonText: {
    color: "#7A5C00",
  },
  moodSupportCancelButtonText: {
    color: "#333",
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 24,
    flexGrow: 1,
  },
  questionText: {
    textAlign: "justify",
    marginBottom: 8,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  moodsContainer: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    paddingHorizontal: 0,
  },
  storiesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  recentList: {
    maxHeight: 170,
  },
  quoteSection: {
    marginTop: 4,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  quoteTitle: {
    marginBottom: 6,
    paddingTop: 24,
  },
  quoteText: {
    width: "100%",
    textAlign: "justify",
    lineHeight: 24,
    flexShrink: 1,
  },
  storyImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default HomeMood;
