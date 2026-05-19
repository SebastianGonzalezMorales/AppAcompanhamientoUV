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
  Image,
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
let imagePickerModule = null;

const MoodTrack = ({ route, navigation }) => {
  const { mood, value } = route.params;
  const activityColumns = 3;

  const [title, setTitle] = useState("");
  const [quickNote, setQuickNote] = useState("");
  const [activities, setActivities] = useState(Activity);
  const [selectedImage, setSelectedImage] = useState(null);

  function deleteDocument() {
    navigation.goBack();
  }

  const getImagePickerModule = () => {
    if (imagePickerModule) {
      return imagePickerModule;
    }

    try {
      imagePickerModule = require("expo-image-picker");
      return imagePickerModule;
    } catch (error) {
      console.error("expo-image-picker no esta disponible en este build:", error);
      return null;
    }
  };

  const takeMoodPhoto = async () => {
    const ImagePicker = getImagePickerModule();

    if (!ImagePicker) {
      Alert.alert(
        "Actualizacion requerida",
        "Esta version de la aplicacion aun no incluye el modulo de camara. Necesitas reinstalar el build mas reciente para usar esta funcion."
      );
      return;
    }

    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permiso requerido",
          "Necesitas permitir el acceso a la camara para tomar una foto."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      console.error("Error al abrir la camara:", error);
      Alert.alert(
        "Error",
        "No se pudo abrir la camara. Intentalo nuevamente."
      );
    }
  };

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

      if (!token) {
        console.log("No se encontro el token. Por favor, inicia sesion.");
        Alert.alert(
          "Sesion requerida",
          "Necesitas iniciar sesion nuevamente para guardar tu estado de animo."
        );
        return;
      }

      const selectedActivities = activities
        .filter((activity) => activity.selected)
        .map((activity) => activity.activity);

      const params = {
        moodState: mood,
        activities:
          selectedActivities.length > 0 ? selectedActivities.join(",") : null,
      };
      const formData = new FormData();

      formData.append("moodState", mood);
      formData.append("intensity", value.toString());
      formData.append("comments", quickNote);
      formData.append("title", title);

      selectedActivities.forEach((activity) => {
        formData.append("activities", activity);
      });

      if (selectedImage) {
        const imageUri = selectedImage.uri;
        const fileName = imageUri.split("/").pop() || "mood-image.jpg";
        const fileExtension = fileName.split(".").pop()?.toLowerCase();
        const mimeType =
          fileExtension === "jpg"
            ? "image/jpeg"
            : fileExtension
            ? `image/${fileExtension}`
            : "image/jpeg";

        formData.append("image", {
          uri: imageUri,
          name: fileName,
          type: mimeType,
        });
      }

      const moodResponse = await api.post(
        `${API_URL}/moodState/post-moodState-with-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const supportMessage = moodResponse.data?.imageAnalysis?.supportMessage;
      let tip =
        "Tu estado de ánimo fue registrado correctamente.";

      try {
        const response = await api.get(`${API_URL}/tips/get-tips`, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });

        if (response.data?.tip) {
          tip = response.data.tip;
        }
      } catch (tipError) {
        console.warn("No se pudo obtener el consejo:", {
          url: tipError.config?.url,
          status: tipError.response?.status,
          data: tipError.response?.data,
        });
      }

      const finalMessage = supportMessage
        ? `${tip}\n\nAnalisis complementario:\n${supportMessage}`
        : tip;

      Alert.alert("Consejo para ti", finalMessage, [
        { text: "OK", onPress: () => navigation.navigate("HomeMood") },
      ]);
    } catch (error) {
      console.error("Error al guardar el estado de animo:", {
        message: error.message,
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });

      let errorMessage =
        "No pudimos guardar tu estado de animo en este momento. Intentalo nuevamente en unos minutos.";

      if (error.response?.status === 401) {
        errorMessage =
          "Tu sesion vencio. Vuelve a iniciar sesion para guardar tu estado de animo.";
      } else if (error.response?.status === 400) {
        errorMessage =
          "No pudimos procesar la informacion enviada. Revisa la foto o los datos del registro e intentalo nuevamente.";
      } else if (error.response?.status === 413) {
        errorMessage =
          "La imagen seleccionada es demasiado grande. Prueba con una foto mas liviana.";
      }

      Alert.alert("No se pudo guardar", errorMessage);
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
                Como te sientes ahora mismo?
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
                  <View
                    style={[
                      styles.activityItemWrapper,
                      activityColumns === 4
                        ? styles.activityItemWrapperFourColumns
                        : styles.activityItemWrapperThreeColumns,
                    ]}
                  >
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

          <View style={styles.photoContainer}>
            <TouchableOpacity style={styles.photoButton} onPress={takeMoodPhoto}>
              <MaterialCommunityIcons
                name="camera"
                size={24}
                color="#5da5a9"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.photoButtonText}>
                {selectedImage ? "Cambiar foto opcional" : "Tomar foto opcional"}
              </Text>
            </TouchableOpacity>

            {selectedImage && (
              <View style={styles.previewContainer}>
                <Image
                  source={{ uri: selectedImage.uri }}
                  style={styles.previewImage}
                />

                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={() => setSelectedImage(null)}
                >
                  <Text style={styles.removePhotoText}>Eliminar foto</Text>
                </TouchableOpacity>
              </View>
            )}
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
    marginBottom: 12,
  },
  activityItemWrapperFourColumns: {
    width: "23%",
  },
  activityItemWrapperThreeColumns: {
    width: "31%",
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
  photoContainer: {
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 16,
  },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  photoButtonText: {
    color: "#5da5a9",
    fontFamily: "DoppioOne",
    fontSize: 15,
    textAlign: "center",
  },
  previewContainer: {
    alignItems: "center",
    marginTop: 12,
  },
  previewImage: {
    width: 130,
    height: 130,
    borderRadius: 12,
  },
  removePhotoButton: {
    marginTop: 8,
  },
  removePhotoText: {
    color: "#f2f2f2",
    fontFamily: "DoppioOne",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
