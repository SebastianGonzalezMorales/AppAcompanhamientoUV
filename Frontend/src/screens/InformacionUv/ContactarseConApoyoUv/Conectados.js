import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
} from "react-native";
import api from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Icon from "react-native-vector-icons/MaterialIcons"; // Importar íconos
import FontAwesome from "react-native-vector-icons/FontAwesome"; // WhatsApp icono

// customisation
import GlobalStyle from "../../../assets/styles/GlobalStyle";

// Components
import BackButton from "../../../components/buttons/BackButton";

// Variables de entorno
import Constants from "expo-constants";

// Asigna API_URL desde la configuración
const { API_URL } = Constants.expoConfig?.extra || {};

const { height, width } = Dimensions.get("window");

function Conectados({ navigation }) {
  const [userName, setUserName] = useState("");
  const [userCareer, setUserCareer] = useState("");

  // Obtener datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const response = await api.post(
            `${API_URL}/user-management/userdata`,
            { token },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const userData = response.data.data;
          setUserName(userData.name);
          setUserCareer(userData.career);
        } else {
          console.log("No se encontró el token. Por favor, inicia sesión.");
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };

    fetchUserData();
  }, []);
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      paddingHorizontal: 20,
      marginVertical: 10,
    }}
  >
    {/* Botón Llamar */}
    <TouchableOpacity
      style={{
        backgroundColor: "#4CAF50",
        paddingVertical: 15,
        borderRadius: 10,
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        marginRight: 5,
      }}
      onPress={makeCall}
    >
      <Icon name="phone" size={20} color="white" style={{ marginRight: 8 }} />
      <Text style={{ color: "white", fontSize: 16 }}>Llamar</Text>
    </TouchableOpacity>

    {/* Botón WhatsApp */}
    <TouchableOpacity
      style={{
        backgroundColor: "#25D366",
        paddingVertical: 15,
        borderRadius: 10,
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        marginLeft: 5,
      }}
      onPress={openWhatsApp}
    >
      <FontAwesome
        name="whatsapp"
        size={20}
        color="white"
        style={{ marginRight: 8 }}
      />
      <Text style={{ color: "white", fontSize: 16 }}>Enviar mensaje</Text>
    </TouchableOpacity>
  </View>;

  {
    /* Botón Correo */
  }
  <TouchableOpacity
    style={{
      backgroundColor: "#2196F3",
      paddingVertical: 15,
      borderRadius: 10,
      width: "80%",
      marginTop: 20,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
    }}
    onPress={sendEmail}
  >
    <Icon name="email" size={20} color="white" style={{ marginRight: 8 }} />
    <Text style={{ color: "white", fontSize: 16 }}>Enviar correo</Text>
  </TouchableOpacity>;

  const callNumbers = [
    "+56998074918",
    "+56998488316",
    "+56998530265",
    "+56998530214",
  ];

  const whatsappNumbers = ["56959446403", "56959446919"];
  const email = "conectadosuv@uv.cl";

  const makeCall = () => {
    const randomNumber =
      callNumbers[Math.floor(Math.random() * callNumbers.length)];
    Linking.openURL(`tel:${randomNumber}`).catch(() =>
      alert("No se pudo realizar la llamada. Verifica tu dispositivo.")
    );
  };

  const openWhatsApp = () => {
    const randomNumber =
      whatsappNumbers[Math.floor(Math.random() * whatsappNumbers.length)];
    const whatsappMessage = `Hola, mi nombre es ${userName}, estudiante de ${userCareer}. Me siento en una situación difícil y necesito orientación emocional. Muchas gracias.`;
    const url = `https://wa.me/${randomNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;
    Linking.openURL(url).catch(() =>
      alert("Asegúrate de tener WhatsApp instalado.")
    );
  };

  const sendEmail = () => {
    const email = "dae@uv.cl, conectadosuv@uv.cl";
    const subject = "[Apoyo emocional - AppAcompañamientoUv]";
    const body = `Hola,
    
  Mi nombre es ${userName}, estudiante de la carrera ${userCareer}, y escribo este correo ya que quiero solicitar apoyo emocional. Me siento en una situación difícil que me gustaría compartir con ustedes para recibir orientación.

Muchas gracias.

Quedo atento.`;

    const mailtoURL = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailtoURL).catch(() =>
      alert("No se pudo abrir el cliente de correo.")
    );
  };

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      <BackButton onPress={() => navigation.goBack()} />

      <View style={{ height: height * 0.33, padding: 10 }}>
        <Text style={GlobalStyle.welcomeText}>Contactarse con apoyo UV</Text>
        <Text
          style={[GlobalStyle.text, { textAlign: "justify", color: "#FFFFFF" }]}
        >
          Conectados UV
        </Text>
        <Text
          style={[GlobalStyle.text, { textAlign: "justify", color: "#FFFFFF" }]}
        >
          Estamos aquí para apoyarte emocionalmente. Si te sientes mal, no estás
          solo.
        </Text>
        <Text
          style={[
            GlobalStyle.text,
            {
              textAlign: "justify",
              fontWeight: "bold",
              color: "#FFD700", // Amarillo dorado para resaltar el mensaje
            },
          ]}
        >
          ¡Pide ayuda, estamos para escucharte!
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          alignItems: "center",
          padding: 20,
        }}
      >
        <Image
          source={require("../../../assets/images/RedesDeApoyo/Conectados/conectados_logo.png")}
          style={{
            width: width * 0.7,
            height: width * 0.4,
            marginBottom: 20,
          }}
          resizeMode="cover"
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            paddingHorizontal: 20,
            marginVertical: 10,
          }}
        >
          {/* Botón Llamar */}
          <TouchableOpacity
            style={{
              backgroundColor: "#4CAF50",
              paddingVertical: 15,
              borderRadius: 10,
              flex: 1,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              marginRight: 5,
            }}
            onPress={makeCall}
          >
            <Icon
              name="phone"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: "white", fontSize: 16 }}>Llamar</Text>
          </TouchableOpacity>

          {/* Botón WhatsApp */}
          <TouchableOpacity
            style={{
              backgroundColor: "#25D366",
              paddingVertical: 15,
              borderRadius: 10,
              flex: 1,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              marginLeft: 5,
            }}
            onPress={openWhatsApp}
          >
            <FontAwesome
              name="whatsapp"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: "white", fontSize: 16 }}>Enviar mensaje</Text>
          </TouchableOpacity>
        </View>

        {/* Botón Correo */}
        <TouchableOpacity
          style={{
            backgroundColor: "#2196F3",
            paddingVertical: 15,
            borderRadius: 10,
            width: "80%",
            marginTop: 20,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
          onPress={sendEmail}
        >
          <Icon
            name="email"
            size={20}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text style={{ color: "white", fontSize: 16 }}>Enviar correo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default Conectados;
