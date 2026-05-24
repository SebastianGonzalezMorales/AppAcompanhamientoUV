import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

// Asigna API_URL desde la configuración
const { API_URL } = Constants.expoConfig?.extra || {};

export const fetchWithToken = async (
  endpoint,
  method = "GET",
  data = null,
  params = null
) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("No se encontró el token. Por favor, inicia sesión.");
    }

    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      timeout: 6000,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      ...(params && { params }),
      ...(data && { data }),
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
    throw error;
  }
};
