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
  StyleSheet,
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

  function deleteDocument() {
    navigation.goBack();
  }

  const selectHandler = (item) => {
    const selectedItem = activities.map((activityItem) => {
      if (activityItem.id === item.id) {
        return { ...activityItem, selected: !activityItem.selected };
      }
      return activityItem;
    });

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
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        Alert.alert("Consejo para ti", tip, [
          { text: "OK", onPress: () => navigation.navigate("HomeMood") },
        ]);
      } else {
        console.log("No se encontro el token. Por favor, inicia sesion.");
      }
    } catch (error) {
      console.error("Error al guardar el estado de animo:", error);
    }
  };

  const keyboardVerticalOffset = Platform.OS === "ios" ? 80 : 0;

  const getIconName = (id) => {
    switch (id) {
      case 1:
        return "thought-bubble";
      case 2:
        return "emoticon-confused";
      case 3:
        return "account-group";
      case 4:
        return "emoticon-sad";
      case 5:
        return "book-check";
      case 6:
        return "tea";
      case 7:
        return "school";
      case 8:
        return "run";
      case 9:
        return "briefcase-check";
      case 10:
        return "calendar-clock";
      case 11:
        return "lightbulb-on";
      case 12:
        return "home-heart";
      case 13:
        return "emoticon-happy";
      case 14:
        return "arm-flex";
      case 15:
        return "heart";
      case 16:
        return "dots-horizontal";
      default:
        return "circle";
    }
  };

  return (
    <SafeAreaView style={[FormStyle.container, GlobalStyle.androidSafeArea]}>
      <View style={FormStyle.flexContainer}>
        <BackButton onPress={deleteDocument} />
        <Text style={FormStyle.title}>{mood}</Text>
      </View>

      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}>
          <View style={FormStyle.formContainer}>
            <View style={styles.questionWrapper}>
              <Text style={[GlobalStyle.subtitle, styles.questionText]}>
                ¿Como te sientes ahora mismo?
              </Text>
            </View>

            <View style={styles.activitiesListContainer}>
              <FlatList
                data={activities}
                scrollEnabled={false}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                columnWrapperStyle={styles.activitiesRow}
                renderItem={({ item }) => (
                  <View style={styles.activityItemWrapper}>
                    <TouchableOpacity onPress={() => selectHandler(item)}>
                      <View
                        style={[
                          styles.activityCard,
                          {
                            backgroundColor: item.selected
                              ? "white"
                              : "transparent",
                          },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={getIconName(item.id)}
                          size={24}
                          color={item.selected ? "#5da5a9" : "#f2f2f2"}
                          style={styles.activityIcon}
                        />
                        <Text
                          numberOfLines={3}
                          style={[
                            styles.activityText,
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
                )}
              />
            </View>

            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={FormStyle.inputContainer}>
                <Text style={FormStyle.text}>Mi dia hasta ahora</Text>
                <InputButton
                  placeholder="Describe como ha sido tu dia hasta este momento... (Opcional)."
                  onChangeText={(textValue) => {
                    setTitle(textValue);
                  }}
                  autoCorrect={false}
                />

                <Text style={FormStyle.text}>Detalles importantes</Text>
                <InputButton
                  placeholder="Agrega informacion adicional o reflexiones sobre tu dia... (Opcional)."
                  onChangeText={(textValue) => {
                    setQuickNote(textValue);
                  }}
                  autoCorrect={false}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>

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

const styles = StyleSheet.create({
  questionWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  questionText: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  activitiesListContainer: {
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 8,
  },
  activitiesRow: {
    justifyContent: "space-between",
  },
  activityItemWrapper: {
    width: "48%",
    marginBottom: 12,
  },
  activityCard: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    minHeight: 112,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  activityIcon: {
    marginBottom: 10,
  },
  activityText: {
    color: "#f2f2f2",
    fontFamily: "DoppioOne",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 18,
  },
});
