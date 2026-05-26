const {
  CreatePlatformEndpointCommand,
  GetEndpointAttributesCommand,
  PublishCommand,
  SetEndpointAttributesCommand,
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

const getPushNotificationsState = (user) => {
  return user?.pushNotifications?.toObject?.() || user?.pushNotifications || {};
};

const getSnsErrorCode = (error) => {
  return error?.Code || error?.code || error?.name || "SnsError";
};

const isEndpointDisabledError = (error) => {
  const message = (error?.message || "").toLowerCase();
  const code = `${error?.Code || error?.code || error?.name || ""}`.toLowerCase();

  return (
    code === "endpointdisabled" ||
    code === "endpointdisabledexception" ||
    message === "endpoint is disabled" ||
    message.includes("endpoint is disabled")
  );
};

const isEndpointNotFoundError = (error) => {
  const message = (error?.message || "").toLowerCase();
  const code = `${error?.Code || error?.code || error?.name || ""}`.toLowerCase();

  return (
    code === "notfound" ||
    code === "notfoundexception" ||
    message.includes("endpoint does not exist") ||
    message.includes("not found")
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

const persistPushNotificationsState = async (user, nextState) => {
  const currentState = getPushNotificationsState(user);

  user.pushNotifications = {
    ...currentState,
    ...nextState,
  };

  await user.save();
};

const markPushEndpointAsDisabled = async (user, error) => {
  console.warn("SNS endpoint deshabilitado. Marcando token como inactivo.", {
    userId: String(user._id),
    endpointArn: getPushNotificationsState(user).snsEndpointArn || null,
    error: getSnsErrorCode(error),
  });

  await persistPushNotificationsState(user, {
    enabled: false,
    active: false,
    disabledAt: new Date(),
    updatedAt: new Date(),
    lastError: getSnsErrorCode(error),
  });
};

const markPushEndpointAsActive = async (
  user,
  { platform, deviceToken, endpointArn, lastError = null }
) => {
  await persistPushNotificationsState(user, {
    enabled: true,
    active: true,
    platform: platform || "android",
    deviceToken,
    snsEndpointArn: endpointArn,
    updatedAt: new Date(),
    disabledAt: null,
    lastError,
  });
};

const createSnsEndpointForDevice = async ({ userId, deviceToken }) => {
  const command = new CreatePlatformEndpointCommand({
    PlatformApplicationArn: process.env.SNS_PLATFORM_APPLICATION_ARN,
    Token: deviceToken,
    CustomUserData: String(userId),
  });

  const response = await snsClient.send(command);
  const endpointArn = response.EndpointArn;

  if (!endpointArn) {
    throw new Error("Amazon SNS no devolvio un endpointArn valido.");
  }

  return endpointArn;
};

const getEndpointAttributes = async (endpointArn) => {
  const command = new GetEndpointAttributesCommand({
    EndpointArn: endpointArn,
  });

  const response = await snsClient.send(command);
  return response.Attributes || {};
};

const setEndpointAttributes = async ({
  endpointArn,
  deviceToken,
  userId,
}) => {
  const command = new SetEndpointAttributesCommand({
    EndpointArn: endpointArn,
    Attributes: {
      Token: deviceToken,
      Enabled: "true",
      CustomUserData: String(userId),
    },
  });

  await snsClient.send(command);
};

const ensureSnsEndpoint = async ({ user, deviceToken, platform = "android" }) => {
  const userId = String(user._id);
  const currentPushNotifications = getPushNotificationsState(user);
  const currentEndpointArn = currentPushNotifications.snsEndpointArn || null;
  const currentDeviceToken = currentPushNotifications.deviceToken || null;

  let endpointArn = currentEndpointArn;
  let updated = false;
  let message =
    "El dispositivo ya estaba registrado. Se actualizo la fecha de sincronizacion.";

  if (!currentEndpointArn) {
    endpointArn = await createSnsEndpointForDevice({ userId, deviceToken });
    await setEndpointAttributes({ endpointArn, deviceToken, userId });
    await markPushEndpointAsActive(user, {
      platform,
      deviceToken,
      endpointArn,
      lastError: null,
    });

    console.log("Token push registrado para el usuario.", {
      userId,
      endpointArn,
    });

    return {
      endpointArn,
      updated: true,
      message: "Token del dispositivo registrado correctamente en Amazon SNS.",
    };
  }

  try {
    const attributes = await getEndpointAttributes(currentEndpointArn);
    const snsToken = attributes.Token || null;
    const snsEnabled = attributes.Enabled !== "false";
    const hasTokenChanged =
      currentDeviceToken !== deviceToken || (snsToken && snsToken !== deviceToken);
    const requiresReactivation =
      currentPushNotifications.enabled === false ||
      currentPushNotifications.active === false ||
      !snsEnabled;

    if (hasTokenChanged || requiresReactivation) {
      await setEndpointAttributes({
        endpointArn: currentEndpointArn,
        deviceToken,
        userId,
      });

      updated = true;
      message = hasTokenChanged
        ? "El dispositivo activo para notificaciones se actualizo correctamente."
        : "El endpoint SNS del dispositivo fue reactivado correctamente.";

      console.log("Token push actualizado para el usuario.", {
        userId,
        endpointArn: currentEndpointArn,
        hasTokenChanged,
        requiresReactivation,
      });
    }
  } catch (error) {
    if (isEndpointNotFoundError(error)) {
      endpointArn = await createSnsEndpointForDevice({ userId, deviceToken });
      await setEndpointAttributes({ endpointArn, deviceToken, userId });
      updated = true;
      message =
        "El endpoint anterior no existia. Se creo un nuevo endpoint SNS para el dispositivo.";

      console.warn("Endpoint SNS no encontrado. Se creo uno nuevo.", {
        userId,
        previousEndpointArn: currentEndpointArn,
        endpointArn,
      });
    } else {
      throw error;
    }
  }

  await markPushEndpointAsActive(user, {
    platform,
    deviceToken,
    endpointArn,
    lastError: null,
  });

  return {
    endpointArn,
    updated,
    message,
  };
};

const getInactiveEndpointResponse = () => {
  return {
    success: false,
    message:
      "El endpoint de notificaciones del dispositivo esta deshabilitado. Se debe registrar nuevamente el token push.",
    sent: 0,
    disabled: 1,
    failed: 0,
  };
};

const sendPushNotificationToUser = async ({ user, title, body, data = null }) => {
  const pushNotifications = getPushNotificationsState(user);
  const endpointArn = pushNotifications.snsEndpointArn || null;

  if (!endpointArn) {
    return {
      success: false,
      status: 400,
      message:
        "El usuario no tiene un endpoint SNS registrado. Primero registra el dispositivo.",
      sent: 0,
      disabled: 0,
      failed: 0,
    };
  }

  if (
    pushNotifications.enabled === false ||
    pushNotifications.active === false
  ) {
    return {
      ...getInactiveEndpointResponse(),
      status: 410,
    };
  }

  try {
    const attributes = await getEndpointAttributes(endpointArn);

    if (attributes.Enabled === "false") {
      await markPushEndpointAsDisabled(user, {
        name: "EndpointDisabledException",
        message: "Endpoint is disabled",
      });

      return {
        ...getInactiveEndpointResponse(),
        status: 410,
      };
    }

    const command = new PublishCommand({
      TargetArn: endpointArn,
      MessageStructure: "json",
      Message: buildAndroidPushMessage(title, body, data),
    });

    const response = await snsClient.send(command);

    console.log("Notificacion enviada correctamente.", {
      userId: String(user._id),
      endpointArn,
      messageId: response.MessageId,
    });

    return {
      success: true,
      status: 200,
      message: "Proceso de notificacion finalizado.",
      sent: 1,
      disabled: 0,
      failed: 0,
      messageId: response.MessageId,
    };
  } catch (error) {
    if (isEndpointDisabledError(error)) {
      await markPushEndpointAsDisabled(user, error);

      return {
        ...getInactiveEndpointResponse(),
        status: 410,
      };
    }

    if (isEndpointNotFoundError(error)) {
      console.warn(
        "SNS endpoint no encontrado. Marcando token como inactivo para evitar reintentos.",
        {
          userId: String(user._id),
          endpointArn,
        }
      );

      await persistPushNotificationsState(user, {
        enabled: false,
        active: false,
        disabledAt: new Date(),
        updatedAt: new Date(),
        lastError: "NotFoundException",
      });

      return {
        ...getInactiveEndpointResponse(),
        status: 410,
      };
    }

    console.error("Error SNS no controlado.", {
      userId: String(user._id),
      endpointArn,
      message: error.message,
      name: error.name,
    });

    throw error;
  }
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
        message: "No se encontro el usuario autenticado.",
      });
    }

    const result = await ensureSnsEndpoint({
      user,
      deviceToken,
      platform: platform || "android",
    });

    return res.status(200).json({
      success: true,
      message: result.message,
      endpointArn: result.endpointArn,
      updated: result.updated,
    });
  } catch (error) {
    console.error("Error al registrar el dispositivo en Amazon SNS:", {
      message: error.message,
      name: error.name,
    });

    return res.status(500).json({
      success: false,
      message:
        "No se pudo registrar el dispositivo en Amazon SNS. Intentalo nuevamente.",
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
        message: "No se encontro el usuario autenticado.",
      });
    }

    const result = await sendPushNotificationToUser({
      user,
      title: "App Acompanamiento UV",
      body: "Notificacion de prueba recibida correctamente.",
    });

    return res.status(result.status).json({
      success: result.success,
      message: result.message,
      sent: result.sent,
      disabled: result.disabled,
      failed: result.failed,
      messageId: result.messageId || null,
    });
  } catch (error) {
    console.error("Error al enviar la notificacion push de prueba:", {
      message: error.message,
      name: error.name,
    });

    return res.status(500).json({
      success: false,
      message:
        "No se pudo enviar la notificacion push de prueba. Intentalo nuevamente.",
      sent: 0,
      disabled: 0,
      failed: 1,
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

    const phraseResult = await getOrAssignPhraseOfTheDayForUser(userId);
    const phrase =
      phraseResult.phrase?.message ||
      "Tienes una nueva frase positiva disponible en la aplicacion.";

    const result = await sendPushNotificationToUser({
      user,
      title: "Frase del dia disponible",
      body:
        "Ya tienes una nueva frase positiva para acompanar tu dia. Revisala en la app.",
      data: {
        type: "daily_phrase",
        screen: "HomeMood",
        showPhraseModal: "true",
      },
    });

    return res.status(result.status).json({
      success: result.success,
      message: result.message,
      sent: result.sent,
      disabled: result.disabled,
      failed: result.failed,
      messageId: result.messageId || null,
      phrase,
    });
  } catch (error) {
    console.error("Error al enviar la notificacion de frase del dia:", {
      message: error.message,
      name: error.name,
    });

    return res.status(500).json({
      success: false,
      message:
        "No se pudo enviar la notificacion de frase del dia. Intentalo nuevamente.",
      sent: 0,
      disabled: 0,
      failed: 1,
    });
  }
};

module.exports = {
  ensureSnsEndpoint,
  registerDeviceToken,
  sendDailyPhraseNotification,
  sendTestPushNotification,
};
