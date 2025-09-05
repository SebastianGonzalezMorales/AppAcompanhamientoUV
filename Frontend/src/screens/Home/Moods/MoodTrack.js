import {
  FlatList,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import Activity from "../Activities";

import api from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

import BackButton from "../../../components/buttons/BackButton";
import FormButton from "../../../components/buttons/FormButton";
import InputButton from "../../../components/buttons/InputButton";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FormStyle from "../../../assets/styles/FormStyle";
import GlobalStyle from "../../../assets/styles/GlobalStyle";

const { API_URL } = Constants.expoConfig?.extra || {};

const MoodTrack = ({ route, navigation }) => {
  const { mood, value } = route.params;

  const [title, setTitle] = useState("");
  const [quickNote, setQuickNote] = useState("");
  const [activities, setActivities] = useState(Activity);

  const deleteDocument = () => navigation.goBack();

  const selectHandler = (item) => {
    const selectedItem = activities.map((value) =>
      value.id === item.id ? { ...value, selected: !value.selected } : value
    );
    setActivities(selectedItem);
  };

  const saveMoodTrack = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const selectedActivities = activities
          .filter((activity) => activity.selected)
          .map((activity) => activity.activity);

        const params = {
          moodState: mood,
          activities:
            selectedActivities.length > 0 ? selectedActivities.join(",") : null,
        };

        const response = await api.get(`${API_URL}/tips/get-tips`, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });

        const tip = response.data.tip;

        await api.post(
          `${API_URL}/moodState/post-moodState`,
          {
            moodState: mood,
            intensity: value,
            comments: quickNote,
            activities: selectedActivities,
            title: title,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Alert.alert("Consejo para ti", tip, [
          { text: "OK", onPress: () => navigation.navigate("HomeMood") },
        ]);
      }
    } catch (error) {
      console.error("Error al guardar el estado de ánimo:", error);
    }
  };

  const keyboardVerticalOffset = Platform.OS === "ios" ? 80 : 0;

  return (
    <SafeAreaView style={[FormStyle.container, GlobalStyle.androidSafeArea, { backgroundColor: "#000C7B" }]}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 16 }}>
        <BackButton onPress={deleteDocument} />
        <Text style={{ fontSize: 26, fontWeight: "700", color: "#ffffffff", marginLeft: 12 }}>
          {mood}
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }} keyboardShouldPersistTaps="handled">
          {/* Activities Section */}
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#eeebebff" }}>
              ¿Cómo te sientes ahora mismo?
            </Text>
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
            {activities.map((item) => {
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
                <TouchableOpacity
                  key={item.id}
                  onPress={() => selectHandler(item)}
                  style={{
                    width: "23%",
                    marginBottom: 16,
                    borderRadius: 12,
                    backgroundColor: item.selected ? "#5da5a9" : "#e0e0e0",
                    alignItems: "stretch",   // 👈 estira los hijos al ancho del recuadro
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
                    color={item.selected ? "#fff" : "#555"}
                    style={{ alignSelf: "center" }} // 👈 mantenemos el ícono centrado
                  />
                  <Text
                    style={{
                      marginTop: 6,
                      fontSize: 8,
                      color: item.selected ? "#fff" : "#555",
                      textAlign: "center",   // 👈 centra el texto dentro de todo el ancho
                      width: "100%",         // ocupa todo el ancho
                    }}

                  >
                    {item.activity}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Inputs */}
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#eeebebff" }}>
              ¿Cómo a sido su día hasta ahora? (Opcional)
            </Text>
            <InputButton
              placeholder="Describe cómo ha sido tu día hasta este momento..."
              onChangeText={(text) => setTitle(text)}
              autoCorrect={false}
              inputStyle={{ backgroundColor: "#fff", borderRadius: 12, padding: 12, fontSize: 14, borderWidth: 1, borderColor: "#ddd" }}
            />

            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8, marginTop: 16, color: "#eeebebff" }}>
              ¿Tiene alguna reflexión adicional sobre su día? (opcional)
            </Text>
            <InputButton
              placeholder="Agrega información adicional o reflexiones sobre tu día..."
              onChangeText={(text) => setQuickNote(text)}
              autoCorrect={false}
              inputStyle={{ backgroundColor: "#fff", borderRadius: 12, padding: 12, fontSize: 14, borderWidth: 1, borderColor: "#ddd" }}
            />
          </View>

          {/* Botón Guardar */}
          <View style={{ marginTop: 24, alignItems: "center" }}>
            <FormButton
              onPress={saveMoodTrack}
              text="Guardar"
              buttonStyle={{ backgroundColor: "#5da5a9", paddingVertical: 14, borderRadius: 12 }}
              textStyle={{ color: "#fff", fontWeight: "700", fontSize: 16 }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MoodTrack;
