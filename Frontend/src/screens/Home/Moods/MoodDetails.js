import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import BackButton from "../../../components/buttons/BackButton";
import InputButton from "../../../components/buttons/InputButton";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FormStyle from "../../../assets/styles/FormStyle";
import GlobalStyle from "../../../assets/styles/GlobalStyle";

import api from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

import Activity from "../Activities";

const { API_URL } = Constants.expoConfig?.extra || {};

const emotionLabels = {
  HAPPY: "alegria",
  CALM: "tranquilidad",
  SAD: "tristeza",
  ANGRY: "enojo o tension",
  FEAR: "preocupacion o temor",
  CONFUSED: "confusion",
  DISGUSTED: "incomodidad",
  SURPRISED: "sorpresa",
};

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
      default:
        return "circle";
    }
  };

const MoodDetails = ({ route, navigation }) => {
  const { moodId } = route.params;
  const activityColumns = 3;

  const [mood, setMood] = useState("");
  const [title, setTitle] = useState("");
  const [comments, setComments] = useState("");
  const [activities, setActivities] = useState(Activity);
  const [imageAnalysis, setImageAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchMoodDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          setErrorMessage("Token no encontrado. Por favor, inicia sesion.");
          return;
        }

        const response = await api.get(
          `${API_URL}/moodState/get-MoodStatesById/${moodId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = response.data.data;
        const storedActivities = Array.isArray(data.activities)
          ? data.activities
          : [];

        setMood(data.moodState || "Estado no definido");
        setTitle(data.title || "No registraste informacion sobre tu dia.");
        setComments(data.comments || "No se agregaron detalles importantes.");
        setImageAnalysis(data.imageAnalysis || null);

        const updatedActivities = Activity.map((activity) => ({
          ...activity,
          selected: storedActivities.includes(activity.activity),
        }));

        setActivities(updatedActivities);
      } catch (error) {
        console.error("Error al cargar los datos del mood:", error);
        setErrorMessage(
          "Error al cargar los datos del estado de animo. Por favor, intentalo de nuevo."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoodDetails();
  }, [moodId]);

  const keyboardVerticalOffset = Platform.OS === "ios" ? 80 : 0;

  const getImageAnalysisText = () => {
    if (!imageAnalysis?.hasImage) {
      return "No se registro una imagen complementaria en este estado de animo.";
    }

    if (imageAnalysis.faceDetected === false) {
      return "Este registro incluyo una imagen complementaria, pero no se detecto un rostro con suficiente claridad.";
    }

    if (imageAnalysis.dominantEmotion) {
      const emotion =
        emotionLabels[imageAnalysis.dominantEmotion] ||
        "una expresion no identificada con claridad";

      return `Este registro incluyo una imagen para complementar tu reflexion emocional. La imagen mostro una expresion asociada a ${emotion}.`;
    }

    return "Este registro incluyo una imagen complementaria, pero no fue posible obtener un analisis de expresion.";
  };

  const imageAnalysisIcon = imageAnalysis?.hasImage
    ? "face-recognition"
    : "image-off-outline";
  const imageAnalysisStatus = imageAnalysis?.hasImage
    ? "Imagen registrada"
    : "Sin imagen registrada";

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

  return (
    <SafeAreaView style={[FormStyle.container, GlobalStyle.androidSafeArea]}>
      <View style={FormStyle.flexContainer}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={FormStyle.title}>{mood}</Text>
      </View>

      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}>
          <View style={FormStyle.formContainer}>
            <View style={styles.questionWrapper}>
              <Text
                style={[
                  GlobalStyle.subtitle,
                  styles.questionText,
                  styles.moodQuestionText,
                ]}
              >
                Que has estado haciendo?
              </Text>
            </View>

            <View style={styles.activitiesListContainer}>
              <FlatList
                data={activities}
                scrollEnabled={false}
                numColumns={activityColumns}
                key={activityColumns}
                keyExtractor={(item) => item.id.toString()}
                columnWrapperStyle={styles.activitiesRow}
                renderItem={({ item }) => (
                  <View style={styles.activityItemWrapper}>
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
                  </View>
                )}
              />
            </View>

            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={[styles.sectionCard, styles.contextSectionCard]}>
                <Text style={[FormStyle.text, styles.contextLabel]}>
                  Mi dia hasta ahora
                </Text>
                <View pointerEvents="none">
                  <InputButton
                    value={title}
                    editable={true}
                    autoCorrect={false}
                  />
                </View>

                <Text style={[FormStyle.text, styles.contextLabel]}>
                  Detalles importantes
                </Text>
                <View pointerEvents="none">
                  <InputButton
                    value={comments}
                    editable={true}
                    autoCorrect={false}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>

            <View style={styles.imageAnalysisCard}>
              <View style={styles.imageAnalysisHeader}>
                <View style={styles.imageAnalysisIconFrame}>
                  <MaterialCommunityIcons
                    name={imageAnalysisIcon}
                    size={34}
                    color="#9fd7ff"
                  />
                </View>

                <View style={styles.imageAnalysisHeaderText}>
                  <Text style={styles.imageAnalysisTitle}>
                    Imagen complementaria
                  </Text>
                  <View
                    style={[
                      styles.imageAnalysisStatusPill,
                      imageAnalysis?.hasImage
                        ? styles.imageAnalysisStatusPillActive
                        : styles.imageAnalysisStatusPillEmpty,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={
                        imageAnalysis?.hasImage
                          ? "check-circle"
                          : "close-circle"
                      }
                      size={16}
                      color={imageAnalysis?.hasImage ? "#7ce0b8" : "#ff8f8f"}
                      style={styles.imageAnalysisStatusIcon}
                    />
                    <Text
                      style={[
                        styles.imageAnalysisStatusText,
                        imageAnalysis?.hasImage
                          ? styles.imageAnalysisStatusTextActive
                          : styles.imageAnalysisStatusTextEmpty,
                      ]}
                    >
                      {imageAnalysisStatus}
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.imageAnalysisText}>
                {getImageAnalysisText()}
              </Text>

              <Text style={styles.imageAnalysisNote}>
                Este analisis no representa un diagnostico. Tu registro manual
                sigue siendo el dato principal.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MoodDetails;

const styles = StyleSheet.create({
  questionWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  questionText: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  moodQuestionText: {
    color: "#dce5ff",
    fontSize: 17,
    lineHeight: 24,
  },
  activitiesListContainer: {
    width: "100%",
    paddingHorizontal: 0,
    marginTop: 14,
  },
  activitiesRow: {
    justifyContent: "space-between",
  },
  activityItemWrapper: {
    width: "31%",
    marginBottom: 12,
  },
  activityCard: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    minHeight: 104,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  activityIcon: {
    marginBottom: 10,
  },
  activityText: {
    color: "#f2f2f2",
    fontFamily: "DoppioOne",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 16,
  },
  sectionCard: {
    alignSelf: "stretch",
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(242,242,242,0.18)",
  },
  contextSectionCard: {
    marginTop: 18,
  },
  contextLabel: {
    marginTop: 8,
  },
  imageAnalysisCard: {
    marginTop: 18,
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(242,242,242,0.18)",
  },
  imageAnalysisHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageAnalysisIconFrame: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: "#071149",
    borderWidth: 1,
    borderColor: "rgba(159,215,255,0.24)",
    alignItems: "center",
    justifyContent: "center",
  },
  imageAnalysisHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  imageAnalysisTitle: {
    color: "#f2f2f2",
    fontFamily: "DoppioOne",
    fontSize: 16,
  },
  imageAnalysisStatusPill: {
    alignSelf: "flex-start",
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  imageAnalysisStatusPillActive: {
    backgroundColor: "rgba(124,224,184,0.14)",
    borderColor: "rgba(124,224,184,0.28)",
  },
  imageAnalysisStatusPillEmpty: {
    backgroundColor: "rgba(255,143,143,0.14)",
    borderColor: "rgba(255,143,143,0.32)",
  },
  imageAnalysisStatusIcon: {
    marginRight: 6,
  },
  imageAnalysisStatusText: {
    color: "#dce5ff",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontSize: 12,
    fontWeight: "700",
  },
  imageAnalysisStatusTextActive: {
    color: "#7ce0b8",
  },
  imageAnalysisStatusTextEmpty: {
    color: "#ff8f8f",
  },
  imageAnalysisText: {
    marginTop: 14,
    color: "#dce5ff",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "justify",
  },
  imageAnalysisNote: {
    marginTop: 10,
    color: "#f2f2f2",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "justify",
    opacity: 0.86,
  },
});
