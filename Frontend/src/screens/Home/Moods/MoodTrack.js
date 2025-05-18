// react imports
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Activity from "../Activities";

import api from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import the API URL from environment variables
import Constants from "expo-constants";

// Asigna API_URL desde la configuración
const { API_URL } = Constants.expoConfig?.extra || {};

// components
import BackButton from "../../../components/buttons/BackButton";
import FormButton from "../../../components/buttons/FormButton";
import InputButton from "../../../components/buttons/InputButton";

// customisation
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FormStyle from "../../../assets/styles/FormStyle";
import GlobalStyle from "../../../assets/styles/GlobalStyle";

// route to manage navigation history
const MoodTrack = ({ route, navigation }) => {
  // Obtener mood y value desde la pantalla anterior
  const { mood, value, consejo } = route.params;
  // references

  // states
  const [title, setTitle] = useState("");
  const [quickNote, setQuickNote] = useState("");
  const [activities, setActivities] = useState(Activity); // select activity handler

  /*
   * *******************
   * **** Functions ****
   * *******************
   */

  // delete document when back button has been pressed
  function deleteDocument() {
    /*     obtainId.delete();
        
            console.log('Document', docId, 'has been deleted.');*/
    navigation.goBack();
  }

  // select activity handler
  const selectHandler = (item) => {
    // Crea un array que altere el estado de seleccionado
    const selectedItem = activities.map((value) => {
      if (value.id === item.id) {
        return { ...value, selected: !value.selected }; // toggle the selected state
      } else {
        return value;
      }
    });
    setActivities(selectedItem);
    console.log(selectedItem);
  };

  // Guardar el estado de ánimo en MongoDB a través del backend
  const saveMoodTrack = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        // Crear array con actividades seleccionadas
        const selectedActivities = activities
          .filter((activity) => activity.selected)
          .map((activity) => activity.activity); // Solo los nombres de actividades

        // Construir parámetros para la solicitud del consejo
        const params = {
          estado: mood, // Estado de ánimo
          actividades:
            selectedActivities.length > 0 ? selectedActivities.join(",") : null, // Solo si hay actividades seleccionadas
        };

        // Obtener el consejo del backend
        const response = await api.get(`${API_URL}/tips/get-tips`, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });

        const consejo = response.data.consejo;

        // Guardar el estado de ánimo en la base de datos
        await api.post(
          `${API_URL}/moodState/post-moodState`,
          {
            moodState: mood,
            intensity: value,
            comments: quickNote,
            activities: selectedActivities,
            title: title,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Mostrar el consejo al usuario con una alerta
        Alert.alert("Consejo para ti", consejo, [
          { text: "OK", onPress: () => navigation.navigate("HomeMood") },
        ]);
      } else {
        console.log("No se encontró el token. Por favor, inicia sesión.");
      }
    } catch (error) {
      console.error("Error al guardar el estado de ánimo:", error);
    }
  };

  // keyboard offset
  const keyboardVerticalOffset = Platform.OS === "ios" ? 80 : 0;

  /*
   * ****************
   * **** Screen ****
   * ****************
   */

  return (
    <SafeAreaView style={[FormStyle.container, GlobalStyle.androidSafeArea]}>
      {/* header */}
      <View style={FormStyle.flexContainer}>
        <BackButton onPress={deleteDocument} />

        <Text style={FormStyle.title}>{mood}</Text>
      </View>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={FormStyle.formContainer}>
            {/* activities */}
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Text
                style={[
                  GlobalStyle.subtitle,
                  { textAlign: "center", fontSize: 18 },
                ]}
              >
                <Text style={{ fontFamily: "Arial", fontSize: 18 }}>¿</Text>
                Cómo te sientes ahora mismo?
              </Text>
            </View>

            <View style={FormStyle.flatListContainer}>
              <FlatList
                data={activities}
                scrollEnabled={false}
                numColumns={4}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  let iconName = "";

                  // set icons based on activity id
                  switch (item.id) {
                    case 1:
                      iconName = "thought-bubble";
                      break;
                    case 2:
                      iconName = "emoticon-confused";
                      break;
                    case 3:
                      iconName = "account-group";
                      break;
                    case 4:
                      iconName = "emoticon-sad";
                      break;
                    case 5:
                      iconName = "book-check";
                      break;
                    case 6:
                      iconName = "tea";
                      break;
                    case 7:
                      iconName = "school";
                      break;
                    case 8:
                      iconName = "run";
                      break;
                    case 9:
                      iconName = "briefcase-check";
                      break;
                    case 10:
                      iconName = "calendar-clock";
                      break;
                    case 11:
                      iconName = "lightbulb-on";
                      break;
                    case 12:
                      iconName = "home-heart";
                      break;
                    case 13:
                      iconName = "emoticon-happy";
                      break;
                    case 14:
                      iconName = "arm-flex";
                      break;
                    case 15:
                      iconName = "heart";
                      break;
                    case 16:
                      iconName = "dots-horizontal";
                      break;
                  }

                  return (
                    <View style={FormStyle.activitiesContainer}>
                      <TouchableOpacity onPress={() => selectHandler(item)}>
                        <View
                          style={[
                            FormStyle.activityContainer,
                            {
                              backgroundColor: item.selected
                                ? "white"
                                : "transparent",
                            },
                          ]}
                        >
                          <MaterialCommunityIcons
                            name={iconName}
                            size={24}
                            color="#f2f2f2"
                            style={[
                              FormStyle.activityIcon,
                              {
                                color: item.selected ? "#5da5a9" : "#f2f2f2",
                              },
                            ]}
                          />
                          <Text
                            style={[
                              FormStyle.activityText,
                              {
                                color: item.selected ? "#5da5a9" : "#f2f2f2",
                              },
                            ]}
                          >
                            {item.activity}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </View>
            {/*    <Text style={FormStyle.seeMoreText}>Desliza para ver más</Text> */}
            {/* inputs */}
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={FormStyle.inputContainer}>
                <Text style={FormStyle.text}>Mi día hasta ahora</Text>
                <InputButton
                  placeholder="Describe cómo ha sido tu día hasta este momento... (Opcional)."
                  onChangeText={(title) => {
                    setTitle(title);
                  }}
                  autoCorrect={false}
                />

                <Text style={FormStyle.text}>Detalles importantes</Text>
                <InputButton
                  placeholder="Agrega información adicional o reflexiones sobre tu día... (Opcional)."
                  onChangeText={(text) => {
                    setQuickNote(text);
                  }}
                  autoCorrect={false}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>

          {/* button */}
          <View style={[FormStyle.buttonContainer, { marginTop: 20 }]}>
            <FormButton
              onPress={saveMoodTrack}
              text="Guardar"
              buttonStyle={{
                backgroundColor: "#f2f2f2",
              }}
              textStyle={{ color: "#5da5a9" }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MoodTrack;
