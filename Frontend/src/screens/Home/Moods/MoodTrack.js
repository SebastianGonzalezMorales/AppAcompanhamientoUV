import {
  ActivityIndicator,
  Animated,
  Alert,
  Easing,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Activity from "../Activities";

import api from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as FaceDetector from "expo-face-detector";

import BackButton from "../../../components/buttons/BackButton";
import FormButton from "../../../components/buttons/FormButton";
import InputButton from "../../../components/buttons/InputButton";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FormStyle from "../../../assets/styles/FormStyle";
import GlobalStyle from "../../../assets/styles/GlobalStyle";

const { API_URL } = Constants.expoConfig?.extra || {};
let cameraModule = null;
let legacyCameraModule = null;

const getCameraModule = () => {
  if (cameraModule) {
    return cameraModule;
  }

  try {
    cameraModule = require("expo-camera");
    return cameraModule;
  } catch (error) {
    console.error("expo-camera no esta disponible en este build:", error);
    return null;
  }
};

const getLegacyCameraModule = () => {
  if (legacyCameraModule) {
    return legacyCameraModule;
  }

  try {
    legacyCameraModule = require("expo-camera/legacy");
    return legacyCameraModule;
  } catch (error) {
    console.error("expo-camera legacy no esta disponible en este build:", error);
    return null;
  }
};

const getLegacyCameraComponent = () => {
  const module = getLegacyCameraModule();

  return module?.Camera || module?.default?.Camera || null;
};

const getRequestCameraPermissionsAsync = () => {
  const modules = [getLegacyCameraModule(), getCameraModule()];

  for (const module of modules) {
    const permissionMethod =
      module?.requestCameraPermissionsAsync ||
      module?.requestPermissionsAsync ||
      module?.Camera?.requestCameraPermissionsAsync ||
      module?.Camera?.requestPermissionsAsync ||
      module?.default?.requestCameraPermissionsAsync ||
      module?.default?.requestPermissionsAsync ||
      module?.default?.Camera?.requestCameraPermissionsAsync ||
      module?.default?.Camera?.requestPermissionsAsync;

    if (permissionMethod) {
      return permissionMethod;
    }
  }

  return null;
};

const buildTipMessage = (tip) => `Consejo para ti:\n\n${tip}`;

const buildAnalysisMessage = (supportMessage) =>
  `Análisis complementario:\n\n${supportMessage}\n\nImportante:\n\nEste resultado es referencial y no representa un diagnóstico. Tu registro manual sigue siendo el dato principal.`;

const faceDetectionSettings = {
  mode: FaceDetector.FaceDetectorMode.fast,
  detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
  runClassifications: FaceDetector.FaceDetectorClassifications.none,
  minDetectionInterval: 120,
  tracking: false,
};

const MoodTrack = ({ route, navigation }) => {
  const { mood, value } = route.params;
  const activityColumns = 3;
  const cameraRef = useRef(null);
  const scanAnimation = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0.18)).current;
  const readyPulse = useRef(new Animated.Value(0)).current;

  const [title, setTitle] = useState("");
  const [quickNote, setQuickNote] = useState("");
  const [activities, setActivities] = useState(Activity);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [isOpeningCamera, setIsOpeningCamera] = useState(false);
  const [isCapturingSelfie, setIsCapturingSelfie] = useState(false);
  const [isSavingMood, setIsSavingMood] = useState(false);

  const LegacyCameraComponent = getLegacyCameraComponent();
  const cameraFacing = "front";
  const isSelfieReady = Boolean(selectedImage?.uri);
  const isAnalyzingSelfie = isSavingMood && isSelfieReady;
  const isSelfieCaptured = isSelfieReady && !isAnalyzingSelfie;
  const scanLineTranslate = scanAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-38, 38],
  });
  const readyPulseScale = readyPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.16],
  });
  const readyPulseOpacity = readyPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.34, 0.05],
  });
  const readyFaceScale = readyPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });
  const readyFaceGlowOpacity = readyPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.18, 0.32],
  });
  const isCaptureDisabled =
    !isCameraReady || !isFaceDetected || isCapturingSelfie;

  useEffect(() => {
    let scanLoop;
    let pulseLoop;

    if (isAnalyzingSelfie) {
      scanAnimation.setValue(0);
      overlayOpacity.setValue(0.18);

      scanLoop = Animated.loop(
        Animated.timing(scanAnimation, {
          toValue: 1,
          duration: 1700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      );

      pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(overlayOpacity, {
            toValue: 0.34,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(overlayOpacity, {
            toValue: 0.18,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      );

      scanLoop.start();
      pulseLoop.start();
    }

    return () => {
      scanLoop?.stop();
      pulseLoop?.stop();
      scanAnimation.stopAnimation();
      overlayOpacity.stopAnimation();
      scanAnimation.setValue(0);
      overlayOpacity.setValue(0.18);
    };
  }, [isAnalyzingSelfie, overlayOpacity, scanAnimation]);

  useEffect(() => {
    let readyLoop;

    if (isSelfieCaptured) {
      readyPulse.setValue(0);

      readyLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(readyPulse, {
            toValue: 1,
            duration: 1100,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(readyPulse, {
            toValue: 0,
            duration: 1100,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );

      readyLoop.start();
    }

    return () => {
      readyLoop?.stop();
      readyPulse.stopAnimation();
      readyPulse.setValue(0);
    };
  }, [isSelfieCaptured, readyPulse]);

  function deleteDocument() {
    if (isSavingMood || isCameraOpen) {
      return;
    }

    navigation.goBack();
  }

  const showAnalysisAlert = (supportMessage) => {
    Alert.alert(
      "Análisis complementario",
      buildAnalysisMessage(supportMessage),
      [{ text: "Aceptar", onPress: () => navigation.navigate("HomeMood") }]
    );
  };

  const showResultAlert = (tip, supportMessage, hasSelfie) => {
    Alert.alert("Registro completado", buildTipMessage(tip), [
      {
        text: "Aceptar",
        onPress: () => {
          if (hasSelfie && supportMessage) {
            showAnalysisAlert(supportMessage);
            return;
          }

          navigation.navigate("HomeMood");
        },
      },
    ]);
  };

  const openSelfieCamera = async () => {
    if (isOpeningCamera || isSavingMood) {
      return;
    }

    const requestCameraPermissions = getRequestCameraPermissionsAsync();

    if (!requestCameraPermissions || !LegacyCameraComponent) {
      Alert.alert(
        "Actualización requerida",
        "Esta versión de la aplicación aún no incluye la cámara nueva. Necesitas reinstalar el build más reciente para usar esta función."
      );
      return;
    }

    setIsOpeningCamera(true);

    try {
      const permissionResponse = await requestCameraPermissions();

      if (!permissionResponse.granted) {
        Alert.alert(
          "Permiso requerido",
          "Necesitas permitir el acceso a la cámara para tomar una selfie."
        );
        return;
      }

      setIsCameraReady(false);
      setIsFaceDetected(false);
      setIsCameraOpen(true);
    } catch (error) {
      console.error("Error al abrir la cámara:", error);
      Alert.alert(
        "No se pudo abrir la cámara",
        "No se pudo abrir la cámara. Inténtalo nuevamente."
      );
    } finally {
      setIsOpeningCamera(false);
    }
  };

  const closeSelfieCamera = () => {
    if (isCapturingSelfie) {
      return;
    }

    setIsCameraOpen(false);
    setIsCameraReady(false);
    setIsFaceDetected(false);
  };

  const handleCameraMountError = (error) => {
    console.error("Error al montar la cámara:", error);
    setIsCameraOpen(false);
    setIsCameraReady(false);
    setIsFaceDetected(false);

    Alert.alert(
      "No se pudo abrir la cámara",
      "No se pudo abrir la cámara. Inténtalo nuevamente."
    );
  };

  const handleFacesDetected = (event) => {
    const faces = Array.isArray(event?.faces)
      ? event.faces
      : Array.isArray(event?.nativeEvent?.faces)
      ? event.nativeEvent.faces
      : [];

    const hasDetectedFace = faces.length > 0;
    setIsFaceDetected((currentValue) =>
      currentValue === hasDetectedFace ? currentValue : hasDetectedFace
    );
  };

  const handleFaceDetectionError = (event) => {
    console.error("Error al detectar rostro:", event);
    setIsFaceDetected(false);
  };

  const captureSelfie = async () => {
    if (
      !cameraRef.current ||
      !isCameraReady ||
      !isFaceDetected ||
      isCapturingSelfie
    ) {
      return;
    }

    setIsCapturingSelfie(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        skipProcessing: false,
      });

      if (!photo?.uri) {
        throw new Error("No se obtuvo una URI válida para la selfie.");
      }

      setSelectedImage({ uri: photo.uri });
      setIsCameraOpen(false);
      setIsCameraReady(false);
      setIsFaceDetected(false);
    } catch (error) {
      console.error("Error al capturar la selfie:", error);
      Alert.alert(
        "No se pudo tomar la selfie",
        "No se pudo tomar la selfie. Inténtalo nuevamente."
      );
    } finally {
      setIsCapturingSelfie(false);
    }
  };

  const removeSelectedSelfie = () => {
    if (isSavingMood || isOpeningCamera) {
      return;
    }

    setSelectedImage(null);
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
    if (isSavingMood) {
      return;
    }

    setIsSavingMood(true);

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.log("No se encontró el token. Por favor, inicia sesión.");
        Alert.alert(
          "Sesión requerida",
          "Necesitas iniciar sesión nuevamente para guardar tu estado de ánimo."
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
      const hasSelfie = Boolean(selectedImage?.uri);

      formData.append("moodState", mood);
      formData.append("intensity", value.toString());
      formData.append("comments", quickNote);
      formData.append("title", title);

      selectedActivities.forEach((activity) => {
        formData.append("activities", activity);
      });

      if (hasSelfie) {
        formData.append("image", {
          uri: selectedImage.uri,
          name: "mood-selfie.jpg",
          type: "image/jpeg",
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
      let tip = "Tu estado de ánimo fue registrado correctamente.";

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

      showResultAlert(tip, supportMessage, hasSelfie);
    } catch (error) {
      console.error("Error al guardar el estado de ánimo:", {
        message: error.message,
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });

      Alert.alert(
        "No se pudo guardar",
        "No se pudo guardar tu estado de ánimo. Inténtalo nuevamente."
      );
    } finally {
      setIsSavingMood(false);
    }
  };

  const renderCameraScreen = () => (
    <SafeAreaView style={[styles.cameraScreen, GlobalStyle.androidSafeArea]}>
      <View style={styles.cameraHeader}>
        <TouchableOpacity
          style={styles.cameraHeaderAction}
          onPress={closeSelfieCamera}
        >
          <MaterialCommunityIcons name="close" size={22} color="#f2f2f2" />
          <Text style={styles.cameraHeaderActionText}>Cancelar</Text>
        </TouchableOpacity>

        <Text style={styles.cameraHeaderTitle}>Selfie opcional</Text>

        <View style={styles.cameraHeaderSpacer} />
      </View>

      <View style={styles.cameraPreviewShell}>
        {LegacyCameraComponent ? (
          <LegacyCameraComponent
            ref={cameraRef}
            style={styles.cameraPreview}
            type={cameraFacing}
            faceDetectorEnabled
            faceDetectorSettings={faceDetectionSettings}
            onCameraReady={() => setIsCameraReady(true)}
            onMountError={handleCameraMountError}
            onFacesDetected={handleFacesDetected}
            onFaceDetectionError={handleFaceDetectionError}
          />
        ) : null}

        {!isCameraReady ? (
          <View style={styles.cameraLoadingOverlay}>
            <ActivityIndicator size="large" color="#f2f2f2" />
            <Text style={styles.cameraLoadingText}>Preparando cámara...</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.cameraHelperText}>
        Tómate un momento y captura tu selfie cuando te sientas listo.
      </Text>

      <View
        style={[
          styles.cameraDetectionBadge,
          isFaceDetected ? styles.cameraDetectionBadgeActive : null,
        ]}
      >
        <MaterialCommunityIcons
          name={isFaceDetected ? "face-recognition" : "face-man-outline"}
          size={18}
          color={isFaceDetected ? "#7ce0b8" : "#f2f2f2"}
          style={styles.cameraDetectionIcon}
        />
        <Text style={styles.cameraDetectionText}>
          {isFaceDetected
            ? "Rostro detectado. Ya puedes capturar tu selfie."
            : "Alinea tu rostro dentro del encuadre para habilitar la captura."}
        </Text>
      </View>

      <View style={styles.cameraFooter}>
        <TouchableOpacity
          disabled={isCaptureDisabled}
          style={[
            styles.cameraCaptureButton,
            isCaptureDisabled ? styles.cameraCaptureButtonDisabled : null,
          ]}
          onPress={captureSelfie}
        >
          <MaterialCommunityIcons
            name="camera-iris"
            size={26}
            color="#5da5a9"
            style={styles.cameraCaptureIcon}
          />
          <Text style={styles.cameraCaptureText}>
            {isCapturingSelfie ? "Tomando selfie..." : "Capturar selfie"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const keyboardVerticalOffset = Platform.OS === "ios" ? 80 : 0;
  const isSelfieButtonDisabled = isOpeningCamera || isSavingMood;

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

  if (isCameraOpen) {
    return renderCameraScreen();
  }

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
                ¿Cómo te sientes ahora mismo?
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
                <Text style={FormStyle.text}>Mi día hasta ahora</Text>
                <InputButton
                  placeholder="Describe cómo ha sido tu día hasta este momento... (Opcional)."
                  onChangeText={(textValue) => {
                    setTitle(textValue);
                  }}
                  autoCorrect={false}
                />

                <Text style={FormStyle.text}>Detalles importantes</Text>
                <InputButton
                  placeholder="Agrega información adicional o reflexiones sobre tu día... (Opcional)."
                  onChangeText={(textValue) => {
                    setQuickNote(textValue);
                  }}
                  autoCorrect={false}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View style={styles.selfieCard}>
            <View style={styles.selfieHeader}>
              <MaterialCommunityIcons
                name="camera-party-mode"
                size={22}
                color="#f2f2f2"
              />
              <Text style={styles.selfieTitle}>Reflexión con selfie</Text>
            </View>

            <Text style={styles.selfieDescription}>
              Puedes tomar una selfie opcional para complementar tu registro
              emocional. Tu registro manual seguirá siendo el dato
              principal.
            </Text>

            <TouchableOpacity
              disabled={isSelfieButtonDisabled}
              style={[
                styles.photoButton,
                isSelfieButtonDisabled ? styles.photoButtonDisabled : null,
              ]}
              onPress={openSelfieCamera}
            >
              <MaterialCommunityIcons
                name={isSelfieReady ? "camera-retake" : "camera"}
                size={24}
                color="#5da5a9"
                style={styles.photoButtonIcon}
              />
                <Text style={styles.photoButtonText}>
                {isOpeningCamera
                  ? "Abriendo cámara..."
                  : isSelfieReady
                  ? "Cambiar selfie"
                  : "Tomar selfie"}
              </Text>
            </TouchableOpacity>

            {isSelfieReady ? (
              <View style={styles.selfieStatusContainer}>
                <View style={styles.selfiePreviewRow}>
                  <View style={styles.selfieFaceFrame}>
                    <Animated.View
                      style={[
                        styles.selfieFaceGlow,
                        {
                          opacity: isAnalyzingSelfie
                            ? overlayOpacity
                            : isSelfieCaptured
                            ? readyFaceGlowOpacity
                            : 0.18,
                        },
                      ]}
                    />

                    {isSelfieCaptured ? (
                      <Animated.View
                        style={[
                          styles.selfieFacePulseRing,
                          {
                            opacity: readyPulseOpacity,
                            transform: [{ scale: readyPulseScale }],
                          },
                        ]}
                      />
                    ) : null}

                    <Animated.View
                      style={[
                        styles.selfieFaceCore,
                        isSelfieCaptured
                          ? { transform: [{ scale: readyFaceScale }] }
                          : null,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="face-recognition"
                        size={52}
                        color={isAnalyzingSelfie ? "#f2f2f2" : "#9fd7ff"}
                      />
                    </Animated.View>

                    {isAnalyzingSelfie ? (
                      <Animated.View
                        style={[
                          styles.selfieScanLine,
                          { transform: [{ translateY: scanLineTranslate }] },
                        ]}
                      />
                    ) : null}
                  </View>

                  <View style={styles.selfiePreviewCopy}>
                    <View style={styles.selfieStatusBadge}>
                      <MaterialCommunityIcons
                        name={
                          isAnalyzingSelfie ? "progress-clock" : "check-circle"
                        }
                        size={18}
                        color={isAnalyzingSelfie ? "#ffd76a" : "#7ce0b8"}
                        style={styles.selfieStatusIcon}
                      />
                      <Text style={styles.selfieStatusText}>
                        {isAnalyzingSelfie
                          ? "Analizando selfie..."
                          : "Selfie agregada correctamente"}
                      </Text>
                    </View>

                    <Text style={styles.selfieStatusDescription}>
                      {isAnalyzingSelfie
                        ? "Estamos complementando tu registro emocional de forma referencial."
                        : "Tu selfie quedó lista para acompañar este registro."}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  disabled={isSavingMood}
                  style={styles.removeSelfieButton}
                  onPress={removeSelectedSelfie}
                >
                  <Text
                    style={[
                      styles.removeSelfieText,
                      isSavingMood ? styles.disabledText : null,
                    ]}
                  >
                    Eliminar selfie
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.selfieHint}>
                El análisis será solo referencial.
              </Text>
            )}
          </View>

          <View style={[FormStyle.buttonContainer, { marginTop: 20 }]}>
            <FormButton
              disabled={isSavingMood}
              onPress={saveMoodTrack}
              text={isSavingMood ? "Guardando..." : "Guardar"}
              buttonStyle={{
                backgroundColor: "#f2f2f2",
                opacity: isSavingMood ? 0.85 : 1,
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
  selfieCard: {
    marginTop: 18,
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(242,242,242,0.18)",
  },
  selfieHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  selfieTitle: {
    marginLeft: 10,
    color: "#f2f2f2",
    fontFamily: "DoppioOne",
    fontSize: 16,
  },
  selfieDescription: {
    marginTop: 12,
    color: "#dce5ff",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontSize: 14,
    lineHeight: 21,
  },
  photoButton: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  photoButtonDisabled: {
    opacity: 0.7,
  },
  photoButtonIcon: {
    marginRight: 8,
  },
  photoButtonText: {
    color: "#5da5a9",
    fontFamily: "DoppioOne",
    fontSize: 15,
    textAlign: "center",
  },
  selfieStatusContainer: {
    marginTop: 14,
    alignItems: "flex-start",
  },
  selfiePreviewRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  selfieFaceFrame: {
    width: 96,
    height: 96,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#071149",
    borderWidth: 1,
    borderColor: "rgba(242,242,242,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  selfieFaceGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#071149",
  },
  selfieFacePulseRing: {
    position: "absolute",
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 2,
    borderColor: "rgba(159,215,255,0.65)",
  },
  selfieFaceCore: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(159,215,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(159,215,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  selfieScanLine: {
    position: "absolute",
    left: 10,
    right: 10,
    height: 3,
    borderRadius: 999,
    backgroundColor: "#7ce0b8",
    shadowColor: "#7ce0b8",
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 4,
  },
  selfiePreviewCopy: {
    flex: 1,
    marginLeft: 14,
  },
  selfieStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(124,224,184,0.15)",
  },
  selfieStatusIcon: {
    marginRight: 8,
  },
  selfieStatusText: {
    color: "#f2f2f2",
    fontFamily: "DoppioOne",
    fontSize: 13,
  },
  selfieStatusDescription: {
    marginTop: 10,
    color: "#dce5ff",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontSize: 13,
    lineHeight: 19,
  },
  removeSelfieButton: {
    marginTop: 12,
    paddingVertical: 4,
  },
  removeSelfieText: {
    color: "#f2f2f2",
    fontFamily: "DoppioOne",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  disabledText: {
    opacity: 0.65,
  },
  selfieHint: {
    marginTop: 12,
    color: "#dce5ff",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontSize: 13,
    lineHeight: 19,
  },
  cameraScreen: {
    flex: 1,
    backgroundColor: "#000C7B",
  },
  cameraHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  cameraHeaderAction: {
    minWidth: 72,
    flexDirection: "row",
    alignItems: "center",
  },
  cameraHeaderActionText: {
    marginLeft: 6,
    color: "#f2f2f2",
    fontFamily: "DoppioOne",
    fontSize: 12,
  },
  cameraHeaderSpacer: {
    minWidth: 72,
  },
  cameraHeaderTitle: {
    color: "#f2f2f2",
    fontFamily: "DoppioOne",
    fontSize: 16,
  },
  cameraPreviewShell: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#071149",
    borderWidth: 1,
    borderColor: "rgba(242,242,242,0.18)",
  },
  cameraPreview: {
    flex: 1,
  },
  cameraLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(7,17,73,0.5)",
  },
  cameraLoadingText: {
    marginTop: 14,
    color: "#f2f2f2",
    fontFamily: "DoppioOne",
    fontSize: 13,
  },
  cameraHelperText: {
    marginTop: 18,
    marginHorizontal: 28,
    color: "#dce5ff",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  cameraDetectionBadge: {
    marginTop: 14,
    marginHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(242,242,242,0.12)",
  },
  cameraDetectionBadgeActive: {
    backgroundColor: "rgba(124,224,184,0.16)",
    borderColor: "rgba(124,224,184,0.28)",
  },
  cameraDetectionIcon: {
    marginRight: 10,
  },
  cameraDetectionText: {
    flex: 1,
    color: "#f2f2f2",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontSize: 13,
    lineHeight: 18,
  },
  cameraFooter: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  cameraCaptureButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 16,
    backgroundColor: "#f2f2f2",
  },
  cameraCaptureButtonDisabled: {
    opacity: 0.7,
  },
  cameraCaptureIcon: {
    marginRight: 10,
  },
  cameraCaptureText: {
    color: "#5da5a9",
    fontFamily: "DoppioOne",
    fontSize: 15,
  },
});
