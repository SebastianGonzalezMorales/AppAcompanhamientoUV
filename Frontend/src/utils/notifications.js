import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

export const registerForPushNotificationsAsync = async () => {
  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#000C7B",
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    console.log("Permiso de notificaciones:", finalStatus);

    if (finalStatus !== "granted") {
      console.log("El usuario no otorgó permisos de notificación.");
      return null;
    }

    const devicePushToken = await Notifications.getDevicePushTokenAsync();

    console.log(" ");
    console.log("======================= ");
    console.log("Tipo de token push:", devicePushToken.type);
    console.log("Token FCM nativo:", devicePushToken.data);
    console.log("======================= ");
    console.log(" ");

    return devicePushToken;
  } catch (error) {
    console.error("Error al obtener token FCM:", error);
    return null;
  }
};
