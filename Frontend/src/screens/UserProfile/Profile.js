import {
  SafeAreaView,
  Text,
  View,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState, useContext, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ProgressBar } from "react-native-paper";
import api from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthContext } from "../../context/AuthContext";

import Constants from "expo-constants";

const { API_URL } = Constants.expoConfig?.extra || {};

import AuthButton from "../../components/buttons/AuthButton";

import GlobalStyle from "../../assets/styles/GlobalStyle";

const formatEmailForDisplay = (value = "") =>
  value.replace(/([@._-])/g, "$1\u200B");

function UserProfile({ navigation }) {
  const { logout } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [career, setCarrera] = useState("");
  const [phone, setPhone] = useState("");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Cargando tu progreso semanal...");

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const userResponse = await api.post(
          `${API_URL}/user-management/userdata`,
          { token },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const userData = userResponse.data.data;

        setName(userData.name);
        setRut(userData.rut);
        setEmail(userData.email);
        setBirthdate(userData.birthdate.split("T")[0]);
        setCarrera(userData.career);
        setPhone(userData.phoneNumber);

        const progressResponse = await api.get(
          `${API_URL}/moodState/calculateStreak`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const progressData = progressResponse.data;
        setProgress(progressData.progress);
        setMessage(progressData.message);
      } else {
        console.log("No se encontró el token. Por favor, inicia sesión.");
      }
    } catch (error) {
      console.error("Error fetching user data or progress:", error);

      if (error.message === "Network Error") {
        setMessage("No pudimos conectarnos. Revisa tu conexión a Internet. 🌐");
      } else {
        setMessage(
          "Hubo un problema al cargar tu progreso. Inténtalo más tarde. 😓"
        );
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const handleSignOut = async () => {
    try {
      await logout();
      navigation.replace("Login");
      Alert.alert(
        "Cierre de sesión exitoso",
        "¡Has cerrado sesión correctamente!",
        [
          {
            text: "OK",
            onPress: () =>
              console.log("Usuario presionó OK al cierre de sesión exitoso"),
          },
        ]
      );
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={[GlobalStyle.welcomeText, styles.headerTitle]}>
            Mi perfil
          </Text>
          <Icon
            name="user-circle"
            size={100}
            color="#000"
            style={styles.profileIcon}
          />

          <Text style={[GlobalStyle.text, styles.messageText]}>{message}</Text>

          <View style={styles.progressWrapper}>
            <ProgressBar
              progress={progress / 7}
              color="#4CAF50"
              style={{ height: 10, borderRadius: 5 }}
            />
            <Text style={styles.progressText}>{progress}/7 días esta semana</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.sectionPanel}>
            <Text style={styles.sectionHeading}>Datos del usuario</Text>
            <Text style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nombre: </Text>
              {name}
            </Text>
            <Text style={styles.infoRow}>
              <Text style={styles.infoLabel}>Rut: </Text>
              {rut}
            </Text>
            <Text style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email: </Text>
              {formatEmailForDisplay(email)}
            </Text>
            <Text style={styles.infoRow}>
              <Text style={styles.infoLabel}>Teléfono: </Text>
              {phone}
            </Text>
            <Text style={styles.infoRow}>
              <Text style={styles.infoLabel}>Carrera: </Text>
              {career}
            </Text>
            <Text style={styles.infoRow}>
              <Text style={styles.infoLabel}>Fecha de nacimiento: </Text>
              {birthdate}
            </Text>
          </View>

          <View style={[styles.sectionPanel, styles.settingsPanel]}>
            <Text style={styles.settingsHeading}>Configuración de la app</Text>
            <TouchableOpacity
              style={styles.preferencesShortcutCard}
              onPress={() => navigation.navigate("NotificationPreferences")}
              activeOpacity={0.85}
            >
              <View style={styles.preferencesShortcutIcon}>
                <MaterialCommunityIcons
                  name="cog-outline"
                  size={24}
                  color="#000C7B"
                />
              </View>

              <View style={styles.preferencesShortcutContent}>
                <Text style={styles.preferencesShortcutTitle}>
                  Configuración
                </Text>
                <Text style={styles.preferencesShortcutSubtitle}>
                  Notificaciones, recordatorios y avisos de la aplicación.
                </Text>
              </View>

              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#8a94a6"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.logoutWrapper}>
            <AuthButton
              onPress={handleSignOut}
              text="Cerrar sesión"
              iconName="log-out-outline"
              iconColor="#388E3C"
              buttonStyle={{ backgroundColor: "#A5D6A7", marginTop: 0 }}
              textStyle={{ color: "#388E3C" }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default UserProfile;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  headerSection: {
    alignItems: "center",
    paddingBottom: 20,
  },
  headerTitle: {
    marginRight: 30,
  },
  profileIcon: {
    marginTop: 20,
  },
  messageText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 0,
    lineHeight: 24,
  },
  progressWrapper: {
    width: "80%",
    marginTop: 15,
  },
  progressText: {
    textAlign: "center",
    marginTop: 5,
    color: "#FFFFFF",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 50,
    flexGrow: 1,
  },
  infoRow: {
    ...GlobalStyle.statsTitle,
    marginVertical: 0,
    paddingTop: 14,
    lineHeight: 22,
  },
  infoLabel: {
    fontWeight: "bold",
    fontSize: 17,
  },
  sectionPanel: {
    backgroundColor: "#f8fbff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#dfe8f5",
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginTop: 18,
  },
  settingsPanel: {
    backgroundColor: "#f6fbfb",
    borderColor: "#d7eceb",
  },
  sectionHeading: {
    color: "#243b53",
    fontFamily: "DoppioOne",
    fontSize: 18,
    marginBottom: 10,
  },
  settingsHeading: {
    color: "#0f5f5d",
    fontFamily: "DoppioOne",
    fontSize: 18,
    marginBottom: 10,
  },
  preferencesShortcutCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d5e2e0",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  preferencesShortcutIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#e8edff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  preferencesShortcutContent: {
    flex: 1,
    paddingRight: 12,
  },
  preferencesShortcutTitle: {
    color: "#243b53",
    fontFamily: "DoppioOne",
    fontSize: 15,
    marginBottom: 4,
  },
  preferencesShortcutSubtitle: {
    color: "#5c6169",
    fontSize: 13,
    lineHeight: 18,
  },
  logoutWrapper: {
    marginTop: 24,
  },
});
