// React imports
import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  Text,
  View,
  FlatList,
  Modal,
  Dimensions,
  StyleSheet,
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

const HomeMood = ({ navigation }) => {
  // Estados
  const [name, setName] = useState("");
  const [moods, setMoods] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
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

        setMotivationalQuote(`${message} - ${author}`);
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

  /*
   * ****************
   * **** Screen ****
   * ****************
   */

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
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

      {/*
       * *********************
       * ***** Section 1 *****
       * *********************
       */}
      {/* Espacio hasta la frase del día */}
      <View style={{ marginBottom: 10 }}>
        {/* Saludo */}
        <Text style={[GlobalStyle.welcomeText, { marginBottom: -10 }]}>
          Hola, {name || " "}!
        </Text>

        {/* Pregunta */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            marginBottom: 8,
          }}
        >
          <Text
            style={[
              GlobalStyle.subtitle,
              {
                textAlign: "left",
                fontFamily: "CustomFontForQuestion", // Estilo específico para el signo de pregunta
              },
            ]}
          >
            ¿
          </Text>
          <Text
            style={[
              GlobalStyle.subtitle, // Manteniendo el estilo original
              {
                textAlign: "left",
                marginLeft: -60, // Ajuste fino para eliminar el espacio grande
              },
            ]}
          >
            Cómo te sientes ahora mismo?
          </Text>
        </View>

        {/* Botones de estados de ánimo */}
        <View style={GlobalStyle.moodsContainer}>
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
        <View style={{ marginTop: -10, paddingHorizontal: 20 }}>
          <Text style={[GlobalStyle.subtitle, { marginBottom: 6 }]}>
            Frase del día:
          </Text>

          {motivationalQuote !== "" && (
            <Text
              style={[
                GlobalStyle.quoteText || {
                  fontSize: 14,
                  color: "#FFFFFF",
                  lineHeight: 20,
                  textAlign: "justify",
                },
              ]}
              numberOfLines={3}
              ellipsizeMode="tail"
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

      <View style={GlobalStyle.rowTwo}>
        <View style={GlobalStyle.statsContainer}>
          <HistoryButton
            onPress={() => navigation.navigate("MoodStats")}
            textLeft="Estadísticas del último mes"
            textRight="Ver todo"
          />
        </View>

        <View style={FormStyle.flexContainer}></View>

        {loading ? (
          <Text style={{ textAlign: "center", color: "#666" }}>
            Cargando datos...
          </Text>
        ) : message !== "" ? (
          <Text
            style={{
              textAlign: "center",
              color: "#666", // Color del mensaje
              fontSize: 16, //Tamaño más legible
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

        <HistoryButton
          onPress={() => navigation.navigate("MoodHistory")}
          textLeft="Recientes"
          textRight="Ver todo"
        />
        <FlatList
          data={moods.slice(0, 5)}
          numColumns={1}
          renderItem={({ item }) => (
            <CustomButton
              buttonStyle={{
                backgroundColor:
                  item.mood === "Mal"
                    ? "#f7d8e3"
                    : item.mood === "Regular"
                    ? "#FBEEB0" // Color ajustado
                    : item.mood === "Bien"
                    ? "#d8eef7"
                    : item.mood === "Excelente"
                    ? "#d8f7ea" // Color ajustado
                    : "#fff",
              }}
              textStyle={{
                color:
                  item.mood === "Mal"
                    ? "#F20C0C"
                    : item.mood === "Regular"
                    ? "#F4D63D" // Color ajustado
                    : item.mood === "Bien"
                    ? "#2626D8"
                    : item.mood === "Excelente"
                    ? "#32CD32" // Color ajustado
                    : "#000",
              }}
              // Mostrar emojis en lugar de texto
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
              onLongPress={() => (
                setModalVisible(true), setSelectedId(item.id)
              )}
              onPress={() => {
                navigation.navigate("MoodDetails", { moodId: item.id });
              }}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  storiesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  storyImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default HomeMood;
