// React imports
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";

// Components
import BackButton from "../../../components/buttons/BackButton";
import InputButton from "../../../components/buttons/InputButton";

// Customization
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FormStyle from "../../../assets/styles/FormStyle";
import GlobalStyle from "../../../assets/styles/GlobalStyle";

// Import Axios for backend requests
import api from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

// Asigna API_URL desde la configuración
const { API_URL } = Constants.expoConfig?.extra || {};

// Import activities from Activities.js
import Activity from "../Activities";

const MoodDetails = ({ route, navigation }) => {
  const { moodId } = route.params;

  // Estados
  const [mood, setMood] = useState("");
  const [title, setTitle] = useState("");
  const [comments, setComments] = useState("");
  const [activities, setActivities] = useState(Activity);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Cargar datos del backend
  useEffect(() => {
    const fetchMoodDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setErrorMessage("Token no encontrado. Por favor, inicia sesión.");
          return;
        }

        const response = await api.get(
          `${API_URL}/moodState/get-MoodStatesById/${moodId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = response.data.data;

        setMood(data.moodState || "Estado no definido");
        setTitle(data.title || "No registraste información sobre tu día.");
        setComments(
          data.comments || "No se agregaron detalles importantes."
        );

        // marcar actividades seleccionadas
        const updatedActivities = Activity.map((activity) => {
          if (data.activities.includes(activity.activity)) {
            return { ...activity, selected: true };
          }
          return { ...activity, selected: false };
        });
        setActivities(updatedActivities);
      } catch (error) {
        console.error("Error al cargar los datos del mood:", error);
        setErrorMessage(
          "Error al cargar los datos del estado de ánimo. Por favor, inténtalo de nuevo."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoodDetails();
  }, [moodId]);

  const keyboardVerticalOffset = Platform.OS === "ios" ? 80 : 0;

  if (isLoading) {
    return (
      <View style={[FormStyle.container, GlobalStyle.androidSafeArea]}>
        <ActivityIndicator size="large" color="#5da5a9" />
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={[FormStyle.container, GlobalStyle.androidSafeArea]}>
        <Text style={FormStyle.text}>{errorMessage}</Text>
      </View>
    );
  }

  // Filtrar actividades seleccionadas
  const selectedActivities = activities.filter((item) => item.selected);

  return (
    <SafeAreaView
      style={[
        FormStyle.container,
        GlobalStyle.androidSafeArea,
        { backgroundColor: "#000C7B" },
      ]}
    >
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 16 }}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text
          style={{
            fontSize: 26,
            fontWeight: "700",
            color: "#fff",
            marginLeft: 12,
          }}
        >
          {mood}
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Activities */}
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#eeebebff",
              }}
            >
              ¿Qué has estado haciendo?
            </Text>
          </View>

          {selectedActivities.length === 0 ? (
            <Text
              style={{
                fontSize: 14,
                color: "#fff",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              No seleccionaste ningún estado en específico
            </Text>
          ) : (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {selectedActivities.map((item) => {
                let iconName = "";
                switch (item.id) {
                  case 1: iconName = "thought-bubble"; break;
                  case 2: iconName = "emoticon-confused"; break;
                  case 3: iconName = "account-group"; break;
                  case 4: iconName = "emoticon-sad"; break;
                  case 5: iconName = "book-check"; break;
                  case 6: iconName = "tea"; break;
                  case 7: iconName = "school"; break;
                  case 8: iconName = "run"; break;
                  case 9: iconName = "briefcase-check"; break;
                  case 10: iconName = "calendar-clock"; break;
                  case 11: iconName = "lightbulb-on"; break;
                  case 12: iconName = "home-heart"; break;
                  case 13: iconName = "emoticon-happy"; break;
                  case 14: iconName = "arm-flex"; break;
                  case 15: iconName = "heart"; break;
                  case 16: iconName = "dots-horizontal"; break;
                }

                return (
                  <View
                    key={item.id}
                    style={{
                      width: "23%",
                      marginBottom: 16,
                      borderRadius: 12,
                      backgroundColor: "#5da5a9",
                      alignItems: "stretch",
                      justifyContent: "center",
                      padding: 12,
                      shadowColor: "#000",
                      shadowOpacity: 0.1,
                      shadowOffset: { width: 0, height: 2 },
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <MaterialCommunityIcons
                      name={iconName}
                      size={28}
                      color="#fff"
                      style={{ alignSelf: "center" }}
                    />
                    <Text
                      style={{
                        marginTop: 6,
                        fontSize: 9,
                        color: "#fff",
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      {item.activity}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          {/* Inputs (solo lectura) */}
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={{ marginTop: 16 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  marginBottom: 8,
                  color: "#eeebebff",
                }}
              >
                Mi día hasta ahora
              </Text>
              <View pointerEvents="none">
                <InputButton
                  value={title}
                  editable={false}
                  autoCorrect={false}
                  inputStyle={{
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    padding: 12,
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: "#ddd",
                  }}
                />
              </View>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  marginBottom: 8,
                  marginTop: 16,
                  color: "#eeebebff",
                }}
              >
                Detalles importantes
              </Text>
              <View pointerEvents="none">
                <InputButton
                  value={comments}
                  editable={false}
                  autoCorrect={false}
                  inputStyle={{
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    padding: 12,
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: "#ddd",
                  }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MoodDetails;
