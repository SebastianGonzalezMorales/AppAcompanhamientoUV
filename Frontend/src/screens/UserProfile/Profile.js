import { SafeAreaView, Text, View, Alert, ActivityIndicator } from "react-native";
import React, { useState, useContext, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ProgressBar } from "react-native-paper";
import api from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthContext } from "../../context/AuthContext";
import Constants from "expo-constants";

// Asigna API_URL desde la configuración
const { API_URL } = Constants.expoConfig?.extra || {};

import AuthButton from "../../components/buttons/AuthButton";
import GlobalStyle from "../../assets/styles/GlobalStyle";

function UserProfile({ navigation }) {
  const { logout } = useContext(AuthContext);

  // states
  const [name, setName] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [career, setCarrera] = useState("");
  const [phone, setPhone] = useState("");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Cargando tu progreso semanal...");
  const [isLoading, setIsLoading] = useState(false); // 👈 pantalla de carga

  const fetchUserData = async () => {
    try {
      setIsLoading(true); // 👈 activa loading
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
    } finally {
      setIsLoading(false); // 👈 desactiva loading
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
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const initials =
    name && name.length > 0 && name.split(" ").length > 1
      ? `${name[0]}${name.split(" ")[1][0]}`.toUpperCase()
      : name[0]?.toUpperCase() || "?";

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {/* Pantalla de carga estilo Login */}
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: "#fff", marginTop: 10, fontSize: 16 }}>
            Cargando perfil...
          </Text>
        </View>
      )}

      {/* Header Section */}
      <View style={{ height: 310, alignItems: "center" }}>
        <Text style={{ fontSize: 28, fontWeight: "700", color: "#fff" }}>
          Mi Perfil
        </Text>

        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            borderWidth: 5,
            borderStyle: "dashed",
            borderColor: "#5da5a9",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
            backgroundColor: "#f5f5f5",
          }}
        >
          <Text
            style={{
              color: "#5da5a9",
              fontSize: 50,
              fontWeight: "800",
              fontFamily: "Helvetica",
            }}
          >
            {initials}
          </Text>
        </View>

        <Text
          style={[
            GlobalStyle.text,
            {
              textAlign: "center",
              color: "#FFFFFF",
              fontSize: 16,
              marginTop: 0,
            },
          ]}
        >
          {message}
        </Text>

        <View style={{ width: "80%", marginTop: 15 }}>
          <ProgressBar
            progress={progress / 7}
            color="#4CAF50"
            style={{ height: 10, borderRadius: 5 }}
          />
          <Text style={{ textAlign: "center", marginTop: 5, color: "#FFFFFF" }}>
            {progress}/7 días esta semana
          </Text>
        </View>
      </View>

      {/* User Info Section */}
      <View style={GlobalStyle.rowTwo}>
        <View style={GlobalStyle.statsContainer}>
          <Text style={[GlobalStyle.statsTitle, { marginVertical: -5 }]}>
            <Text style={{ fontWeight: "bold", fontSize: 17 }}>Nombre: </Text>{" "}
            {name}
          </Text>
          <Text style={[GlobalStyle.statsTitle, { marginVertical: -5 }]}>
            <Text style={{ fontWeight: "bold", fontSize: 17 }}>Rut: </Text> {rut}
          </Text>
          <Text style={[GlobalStyle.statsTitle, { marginVertical: -5 }]}>
            <Text style={{ fontWeight: "bold", fontSize: 17 }}>Email: </Text>{" "}
            {email}
          </Text>
          <Text style={[GlobalStyle.statsTitle, { marginVertical: -5 }]}>
            <Text style={{ fontWeight: "bold", fontSize: 17 }}>Teléfono: </Text>{" "}
            {phone}
          </Text>
          <Text style={[GlobalStyle.statsTitle, { marginVertical: -5 }]}>
            <Text style={{ fontWeight: "bold", fontSize: 17 }}>Carrera: </Text>{" "}
            {career}
          </Text>
          <Text style={[GlobalStyle.statsTitle, { marginVertical: -5 }]}>
            <Text style={{ fontWeight: "bold", fontSize: 17 }}>
              Fecha de nacimiento:{" "}
            </Text>{" "}
            {birthdate}
          </Text>
        </View>

        <View style={{ marginTop: -7, paddingBottom: 50 }}>
          <AuthButton
            onPress={handleSignOut}
            text="Cerrar sesión"
            iconName="log-out-outline"
            iconColor="#388E3C"
            buttonStyle={{ backgroundColor: "#A5D6A7" }}
            textStyle={{ color: "#388E3C" }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default UserProfile;