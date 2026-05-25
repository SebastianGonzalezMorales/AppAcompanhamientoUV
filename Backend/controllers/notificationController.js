const {
  CreatePlatformEndpointCommand,
  PublishCommand,
} = require("@aws-sdk/client-sns");

const snsClient = require("../helpers/snsClient");
const User = require("../models/user");
const {
  getOrAssignPhraseOfTheDayForUser,
} = require("./phraseOfTheDay");

const getAuthenticatedUserId = (req) => {
  return (
    req.auth?.userId ||
    req.user?.userId ||
    req.user?.id ||
    req.user?._id ||
    null
  );
};

const buildAndroidPushMessage = (title, body, data = null) => {
  const message = {
    notification: {
      title,
      body,
    },
  };

  if (data && Object.keys(data).length > 0) {
    message.data = Object.entries(data).reduce((accumulator, [key, value]) => {
      if (value !== undefined && value !== null) {
        accumulator[key] = String(value);
      }

      return accumulator;
    }, {});
  }

  return JSON.stringify({
    default: body,
    GCM: JSON.stringify({
      fcmV1Message: {
        message,
      },
    }),
  });
};

const registerDeviceToken = async (req, res) => {
  const { deviceToken, platform } = req.body;
  const userId = getAuthenticatedUserId(req);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "No se pudo identificar al usuario autenticado.",
    });
  }

  if (!deviceToken) {
    return res.status(400).json({
      success: false,
      message: "Debes enviar el token del dispositivo.",
    });
  }

  if (!process.env.SNS_PLATFORM_APPLICATION_ARN) {
    return res.status(500).json({
      success: false,
      message:
        "Falta la variable de entorno SNS_PLATFORM_APPLICATION_ARN en el servidor.",
    });
  }

  if (platform && platform !== "android") {
    return res.status(400).json({
      success: false,
      message: "Por ahora solo se admite la plataforma android.",
    });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No se encontró el usuario autenticado.",
      });
    }

    const command = new CreatePlatformEndpointCommand({
      PlatformApplicationArn: process.env.SNS_PLATFORM_APPLICATION_ARN,
      Token: deviceToken,
      CustomUserData: String(userId),
    });

    const response = await snsClient.send(command);
    const endpointArn = response.EndpointArn;

    user.pushNotifications = {
      enabled: true,
      platform: "android",
      deviceToken,
      snsEndpointArn: endpointArn,
      updatedAt: new Date(),
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Token del dispositivo registrado correctamente en Amazon SNS.",
      endpointArn,
    });
  } catch (error) {
    console.error("Error al registrar el dispositivo en Amazon SNS:", {
      message: error.message,
      name: error.name,
    });

    return res.status(500).json({
      success: false,
      message:
        "No se pudo registrar el dispositivo en Amazon SNS. Inténtalo nuevamente.",
    });
  }
};

const sendTestPushNotification = async (req, res) => {
  const userId = getAuthenticatedUserId(req);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "No se pudo identificar al usuario autenticado.",
    });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No se encontró el usuario autenticado.",
      });
    }

    const endpointArn = user.pushNotifications?.snsEndpointArn;

    if (!endpointArn) {
      return res.status(400).json({
        success: false,
        message:
          "El usuario no tiene un endpoint SNS registrado. Primero registra el dispositivo.",
      });
    }

    const title = "App Acompañamiento UV";
    const body = "Notificación de prueba recibida correctamente.";

    const command = new PublishCommand({
      TargetArn: endpointArn,
      MessageStructure: "json",
      Message: buildAndroidPushMessage(title, body),
    });

    const response = await snsClient.send(command);

    return res.status(200).json({
      success: true,
      message: "Notificación push de prueba enviada correctamente.",
      messageId: response.MessageId,
    });
  } catch (error) {
    console.error("Error al enviar la notificación push de prueba:", {
      message: error.message,
      name: error.name,
    });

    return res.status(500).json({
      success: false,
      message:
        "No se pudo enviar la notificación push de prueba. Inténtalo nuevamente.",
    });
  }
};

const sendDailyPhraseNotification = async (req, res) => {
  const userId = getAuthenticatedUserId(req);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "No se pudo identificar al usuario autenticado.",
    });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No se encontro el usuario autenticado.",
      });
    }

    const endpointArn = user.pushNotifications?.snsEndpointArn;

    if (!endpointArn) {
      return res.status(400).json({
        success: false,
        message:
          "El usuario no tiene un endpoint SNS registrado. Primero registra el dispositivo.",
      });
    }

    const phraseResult = await getOrAssignPhraseOfTheDayForUser(userId);
    const phrase =
      phraseResult.phrase?.message ||
      "Tienes una nueva frase positiva disponible en la aplicación.";

    const title = "Frase del día disponible";
    const body =
      "Ya tienes una nueva frase positiva para acompañar tu día. Revísala en la app.";
    const data = {
      type: "daily_phrase",
      screen: "HomeMood",
      showPhraseModal: "true",
    };

    const command = new PublishCommand({
      TargetArn: endpointArn,
      MessageStructure: "json",
      Message: buildAndroidPushMessage(title, body, data),
    });

    const response = await snsClient.send(command);

    return res.status(200).json({
      success: true,
      message: "Notificación de frase del día enviada correctamente.",
      messageId: response.MessageId,
      phrase,
    });
  } catch (error) {
    console.error("Error al enviar la notificación de frase del día:", {
      message: error.message,
      name: error.name,
    });

    return res.status(500).json({
      success: false,
      message:
        "No se pudo enviar la notificación de frase del día. Inténtalo nuevamente.",
    });
  }
};

module.exports = {
  registerDeviceToken,
  sendDailyPhraseNotification,
  sendTestPushNotification,
};
