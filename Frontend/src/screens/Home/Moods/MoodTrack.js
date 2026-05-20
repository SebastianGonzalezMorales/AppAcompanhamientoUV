import {
  ActivityIndicator,
  Animated,
  Alert,
  Easing,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Modal,
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

const analysisPreviewTip =
  "Tómate un momento para respirar y reconocer cómo te sientes. Registrar tu estado de ánimo ya es un paso importante.";

const showAnalysisPreviewInsteadOfCamera = false;
const supportPhoneNumber = "+56968301655";
const supportWhatsAppNumber = "56968301655";
const supportEmail = "dae@uv.cl";

const analysisPreviewScenarios = [
  {
    key: "happy-match",
    label: "Alegría",
    comparisonResult: "coincidencia_positiva",
    supportMessage:
      "La imagen mostró una expresión asociada a alegría. Esto coincide con tu registro. Sigue así; reconocer estos momentos también ayuda a cuidar tu bienestar.",
  },
  {
    key: "calm-match",
    label: "Calma",
    comparisonResult: "coincidencia_positiva",
    supportMessage:
      "La imagen mostró una expresión tranquila. Esto puede acompañar tu registro como una señal complementaria de calma.",
  },
  {
    key: "sad-support",
    label: "Tristeza",
    comparisonResult: "coincidencia_de_apoyo",
    supportMessage:
      "La imagen mostró una expresión asociada a tristeza. Esto coincide con tu registro. Si sientes que necesitas apoyo, puedes revisar las opciones de contacto disponibles en la aplicación.",
  },
  {
    key: "support-needed",
    label: "Apoyo",
    comparisonResult: "coincidencia_de_apoyo",
    supportMessage:
      "La imagen mostró una expresión de malestar. Si esto coincide con cómo te sientes, podrías darte un momento de pausa o revisar los recursos de apoyo disponibles en la aplicación.",
  },
  {
    key: "positive-difference",
    label: "Diferencia positiva",
    comparisonResult: "posible_diferencia",
    supportMessage:
      "Registraste un estado positivo, aunque la imagen mostró una expresión distinta. Puede ser útil tomarlo como una señal para reflexionar, no como una conclusión.",
  },
  {
    key: "support-difference",
    label: "Diferencia baja",
    comparisonResult: "diferencia_referencial",
    supportMessage:
      "Registraste un estado de ánimo bajo, aunque la imagen mostró una expresión más tranquila o positiva. Tu registro manual sigue siendo el dato principal.",
  },
  {
    key: "no-face",
    label: "Sin rostro",
    comparisonResult: "sin_analisis",
    supportMessage:
      "No se detectó un rostro con suficiente claridad. Tu estado de ánimo fue registrado correctamente sin análisis complementario de imagen.",
  },
  {
    key: "no-analysis",
    label: "Sin análisis",
    comparisonResult: "sin_analisis",
    supportMessage:
      "No fue posible obtener un análisis complementario de la imagen. Tu registro manual fue guardado correctamente.",
  },
];

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
  const scrollViewRef = useRef(null);
  const scanAnimation = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0.18)).current;
  const readyPulse = useRef(new Animated.Value(0)).current;
  const lastScrollOffsetRef = useRef(0);
  const shouldScrollToSelfieRef = useRef(false);
  const wasCameraOpenRef = useRef(false);

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
  const [showMoodSupportAlert, setShowMoodSupportAlert] = useState(false);
  const [isMoodSupportAlertMinimized, setIsMoodSupportAlertMinimized] =
    useState(false);
  const [showMoodSupportConfirmModal, setShowMoodSupportConfirmModal] =
    useState(false);
  const [analysisDialog, setAnalysisDialog] = useState({
    visible: false,
    supportMessage: "",
    comparisonResult: null,
    onAccept: null,
  });

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

  useEffect(() => {
    if (wasCameraOpenRef.current && !isCameraOpen) {
      requestAnimationFrame(() => {
        const scrollTarget = scrollViewRef.current;

        if (!scrollTarget) {
          return;
        }

        if (shouldScrollToSelfieRef.current && isSelfieReady) {
          scrollTarget.scrollToEnd({ animated: true });
          shouldScrollToSelfieRef.current = false;
          return;
        }

        scrollTarget.scrollTo({
          y: lastScrollOffsetRef.current,
          animated: false,
        });
      });
    }

    wasCameraOpenRef.current = isCameraOpen;
  }, [isCameraOpen, isSelfieReady]);

  function deleteDocument() {
    if (isSavingMood || isCameraOpen) {
      return;
    }

    navigation.goBack();
  }

  const showAnalysisAlert = (
    supportMessage,
    onAccept = () => navigation.navigate("HomeMood"),
    comparisonResult = null
  ) => {
    setAnalysisDialog({
      visible: true,
      supportMessage,
      comparisonResult,
      onAccept,
    });
  };

  const closeAnalysisDialog = () => {
    const nextAction = analysisDialog.onAccept;
    const shouldShowSupportAlert =
      analysisDialog.comparisonResult === "coincidencia_de_apoyo";

    setAnalysisDialog({
      visible: false,
      supportMessage: "",
      comparisonResult: null,
      onAccept: null,
    });

    if (shouldShowSupportAlert) {
      setIsMoodSupportAlertMinimized(false);
      setShowMoodSupportAlert(true);
      return;
    }

    if (nextAction) {
      nextAction();
    }
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
    navigation.navigate("HomeMood");
  };

  const callMoodSupport = () => {
    Linking.openURL(`tel:${supportPhoneNumber}`).catch(() => {
      Alert.alert("No se pudo llamar", "No se pudo abrir la aplicación de teléfono.");
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
      Alert.alert("No se pudo abrir el correo", "No se pudo abrir el cliente de correo.");
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

  const showAnalysisPreviewScenario = (scenario) => {
    Alert.alert("Registro completado", buildTipMessage(analysisPreviewTip), [
      {
        text: "Aceptar",
        onPress: () =>
          showAnalysisAlert(
            scenario.supportMessage,
            null,
            scenario.comparisonResult
          ),
      },
    ]);
  };

  const showResultAlert = (tip, imageAnalysis, hasSelfie) => {
    Alert.alert("Registro completado", buildTipMessage(tip), [
      {
        text: "Aceptar",
        onPress: () => {
          if (hasSelfie && imageAnalysis?.supportMessage) {
            showAnalysisAlert(
              imageAnalysis.supportMessage,
              () => navigation.navigate("HomeMood"),
              imageAnalysis.comparisonResult
            );
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

    if (showAnalysisPreviewInsteadOfCamera) {
      showAnalysisPreviewScenario(analysisPreviewScenarios[0]);
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

    shouldScrollToSelfieRef.current = false;
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

      shouldScrollToSelfieRef.current = true;
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

      const imageAnalysis = moodResponse.data?.imageAnalysis;
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

      showResultAlert(tip, imageAnalysis, hasSelfie);
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
        return "shape-plus";
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

      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
          scrollEventThrottle={16}
          onScroll={(event) => {
            lastScrollOffsetRef.current = event.nativeEvent.contentOffset.y;
          }}
        >
          <View style={FormStyle.formContainer}>
            <View>
              <View style={styles.questionWrapper}>
                <Text
                  style={[
                    GlobalStyle.subtitle,
                    styles.questionText,
                    styles.moodQuestionText,
                  ]}
                >
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
            </View>

            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={[styles.sectionCard, styles.contextSectionCard]}>
                <Text
                  style={[
                    GlobalStyle.subtitle,
                    styles.questionText,
                    styles.inputIntroText,
                  ]}
                >
                  Si quieres, a continuación puedes dejar más contexto sobre tu día
                </Text>

                <Text style={[FormStyle.text, styles.contextLabel]}>
                  Mi día hasta ahora
                </Text>
                <InputButton
                  placeholder="Describe cómo ha sido tu día hasta este momento."
                  onChangeText={(textValue) => {
                    setTitle(textValue);
                  }}
                  autoCorrect={false}
                  value={title}
                />

                <Text style={[FormStyle.text, styles.contextLabel]}>
                  Detalles importantes
                </Text>
                <InputButton
                  placeholder="Agrega información adicional o reflexiones sobre tu día."
                  onChangeText={(textValue) => {
                    setQuickNote(textValue);
                  }}
                  autoCorrect={false}
                  value={quickNote}
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

            {showAnalysisPreviewInsteadOfCamera ? (
              <View style={styles.analysisPreviewPanel}>
                <Text style={styles.analysisPreviewTitle}>
                  Simular análisis complementario
                </Text>
                <View style={styles.analysisPreviewGrid}>
                  {analysisPreviewScenarios.map((scenario) => (
                    <TouchableOpacity
                      key={scenario.key}
                      style={styles.analysisPreviewChip}
                      onPress={() => showAnalysisPreviewScenario(scenario)}
                    >
                      <Text style={styles.analysisPreviewChipText}>
                        {scenario.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : null}
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

      <Modal
        animationType="fade"
        transparent
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

      <Modal
        animationType="fade"
        transparent
        visible={analysisDialog.visible}
        onRequestClose={closeAnalysisDialog}
      >
        <View style={styles.analysisDialogOverlay}>
          <View style={styles.analysisDialogCard}>
            <Text style={styles.analysisDialogTitle}>
              Análisis complementario
            </Text>

            <Text style={styles.analysisDialogMessage}>
              {analysisDialog.supportMessage}
            </Text>

            <Text style={styles.analysisDialogImportant}>
              <Text style={styles.analysisDialogImportantLabel}>
                Importante:{" "}
              </Text>
              Este resultado no representa un diagnóstico.
            </Text>

            <View style={styles.analysisDialogActions}>
              <TouchableOpacity
                style={styles.analysisDialogButton}
                onPress={closeAnalysisDialog}
              >
                <Text style={styles.analysisDialogButtonText}>ACEPTAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

export default MoodTrack;

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
    top: 76,
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
  inputIntroText: {
    textAlign: "left",
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    marginBottom: 14,
    fontSize: 16,
  },
  contextLabel: {
    marginTop: 8,
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
    textAlign: "justify",
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
    textAlign: "justify",
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
  analysisPreviewPanel: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(242,242,242,0.14)",
  },
  analysisPreviewTitle: {
    color: "#dce5ff",
    fontFamily: "DoppioOne",
    fontSize: 13,
    marginBottom: 10,
  },
  analysisPreviewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  analysisPreviewChip: {
    margin: 4,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(242,242,242,0.12)",
    borderWidth: 1,
    borderColor: "rgba(242,242,242,0.18)",
  },
  analysisPreviewChipText: {
    color: "#f2f2f2",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontSize: 12,
  },
  analysisDialogOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    backgroundColor: "rgba(0,0,0,0.52)",
  },
  analysisDialogCard: {
    width: "100%",
    maxWidth: 420,
    paddingTop: 26,
    paddingHorizontal: 26,
    paddingBottom: 12,
    borderRadius: 4,
    backgroundColor: "#f8f8f8",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  analysisDialogTitle: {
    color: "#1f1f1f",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontSize: 21,
    fontWeight: "700",
    marginBottom: 18,
  },
  analysisDialogMessage: {
    color: "#1f1f1f",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontSize: 17,
    lineHeight: 25,
    textAlign: "justify",
  },
  analysisDialogImportant: {
    marginTop: 16,
    color: "#1f1f1f",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontSize: 17,
    lineHeight: 25,
    textAlign: "justify",
  },
  analysisDialogImportantLabel: {
    fontWeight: "700",
  },
  analysisDialogActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    alignItems: "flex-end",
    marginTop: 24,
  },
  analysisDialogButton: {
    paddingVertical: 9,
    paddingHorizontal: 8,
  },
  analysisDialogButtonText: {
    color: "#1f1f1f",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontSize: 16,
    fontWeight: "700",
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
    textAlign: "justify",
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
