import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BackButton from "../../components/buttons/BackButton";
import GlobalStyle from "../../assets/styles/GlobalStyle";

const NOTIFICATION_PREFERENCES_KEY = "notificationPreferences";
const NOTIFICATION_PREFERENCES_VERSION = 2;

const defaultNotificationPreferences = {
  dailyPhrase: true,
  moodReminder: true,
  mentalHealthQuestionnaires: true,
  appUpdates: true,
  frequency: "Diaria",
  preferredTime: "Predeterminado",
  version: NOTIFICATION_PREFERENCES_VERSION,
};

const frequencyOptions = [
  "Diaria",
  "Cada 3 días",
  "Semanal",
  "Solo cuando sea necesario",
];

const preferredTimeOptions = [
  "Predeterminado",
  "Mañana",
  "Tarde",
  "Noche",
];

const normalizeStoredPreferences = (storedPreferences = {}) => {
  const normalizedPreferences = {
    ...storedPreferences,
  };

  if (
    normalizedPreferences.mentalHealthQuestionnaires === undefined &&
    normalizedPreferences.phq9 !== undefined
  ) {
    normalizedPreferences.mentalHealthQuestionnaires =
      normalizedPreferences.phq9;
  }

  if (
    normalizedPreferences.appUpdates === undefined &&
    normalizedPreferences.supportMessages !== undefined
  ) {
    normalizedPreferences.appUpdates = normalizedPreferences.supportMessages;
  }

  const nextPreferences = {
    ...defaultNotificationPreferences,
    ...normalizedPreferences,
  };

  if (normalizedPreferences.version !== NOTIFICATION_PREFERENCES_VERSION) {
    nextPreferences.dailyPhrase = true;
    nextPreferences.moodReminder = normalizedPreferences.moodReminder ?? true;
    nextPreferences.mentalHealthQuestionnaires = true;
    nextPreferences.appUpdates = normalizedPreferences.appUpdates ?? true;
    nextPreferences.version = NOTIFICATION_PREFERENCES_VERSION;
  }

  return nextPreferences;
};

function NotificationPreferences({ navigation }) {
  const [notificationPreferences, setNotificationPreferences] = useState(
    defaultNotificationPreferences
  );

  useEffect(() => {
    const loadNotificationPreferences = async () => {
      try {
        const storedPreferences = await AsyncStorage.getItem(
          NOTIFICATION_PREFERENCES_KEY
        );

        if (!storedPreferences) {
          return;
        }

        const parsedPreferences = JSON.parse(storedPreferences);
        const nextPreferences = normalizeStoredPreferences(parsedPreferences);

        setNotificationPreferences(nextPreferences);

        if (parsedPreferences.version !== NOTIFICATION_PREFERENCES_VERSION) {
          await AsyncStorage.setItem(
            NOTIFICATION_PREFERENCES_KEY,
            JSON.stringify(nextPreferences)
          );
        }
      } catch (error) {
        console.error("Error al cargar preferencias de notificaciones:", error);
      }
    };

    loadNotificationPreferences();
  }, []);

  const persistNotificationPreferences = async (nextPreferences) => {
    setNotificationPreferences(nextPreferences);

    try {
      await AsyncStorage.setItem(
        NOTIFICATION_PREFERENCES_KEY,
        JSON.stringify(nextPreferences)
      );
    } catch (error) {
      console.error("Error al guardar preferencias de notificaciones:", error);
    }
  };

  const updateNotificationToggle = (key, value) => {
    persistNotificationPreferences({
      ...notificationPreferences,
      [key]: value,
    });
  };

  const updateNotificationOption = (key, value) => {
    persistNotificationPreferences({
      ...notificationPreferences,
      [key]: value,
    });
  };

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      <BackButton onPress={() => navigation.goBack()} />

      <View style={styles.heroSection}>
        <Text style={GlobalStyle.welcomeText}>Configuración</Text>
        <Text style={[GlobalStyle.subtitleMenu, styles.heroSubtitle]}>
          Notificaciones
        </Text>
        <Text style={[GlobalStyle.text, styles.heroText]}>
          Elige qué avisos quieres recibir y en qué momento prefieres verlos.
        </Text>
      </View>

      <View style={styles.contentCard}>
        <ScrollView
          contentContainerStyle={styles.contentScroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Tus preferencias</Text>

          <View style={styles.preferencesCard}>
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceTextBlock}>
                <Text style={styles.preferenceRowTitle}>Frase del día</Text>
                <Text style={styles.preferenceRowDescription}>
                  Recibe una frase positiva para acompañar tu día.
                </Text>
              </View>
              <Switch
                value={notificationPreferences.dailyPhrase}
                onValueChange={(value) =>
                  updateNotificationToggle("dailyPhrase", value)
                }
                trackColor={{ false: "#d6dbe8", true: "#a7b8ff" }}
                thumbColor={
                  notificationPreferences.dailyPhrase ? "#000C7B" : "#f4f6fb"
                }
              />
            </View>

            <View style={styles.preferenceDivider} />

            <View style={styles.preferenceRow}>
              <View style={styles.preferenceTextBlock}>
                <Text style={styles.preferenceRowTitle}>
                  Recordatorio de estado de ánimo
                </Text>
                <Text style={styles.preferenceRowDescription}>
                  Recuerda registrar cómo te sientes.
                </Text>
              </View>
              <Switch
                value={notificationPreferences.moodReminder}
                onValueChange={(value) =>
                  updateNotificationToggle("moodReminder", value)
                }
                trackColor={{ false: "#d6dbe8", true: "#a7b8ff" }}
                thumbColor={
                  notificationPreferences.moodReminder ? "#000C7B" : "#f4f6fb"
                }
              />
            </View>

            <View style={styles.preferenceDivider} />

            <View style={styles.preferenceRow}>
              <View style={styles.preferenceTextBlock}>
                <Text style={styles.preferenceRowTitle}>
                  Cuestionarios de salud mental
                </Text>
                <Text style={styles.preferenceRowDescription}>
                  Avisos para completar evaluaciones de bienestar cuando estén
                  disponibles en la app.
                </Text>
              </View>
              <Switch
                value={notificationPreferences.mentalHealthQuestionnaires}
                onValueChange={(value) =>
                  updateNotificationToggle("mentalHealthQuestionnaires", value)
                }
                trackColor={{ false: "#d6dbe8", true: "#a7b8ff" }}
                thumbColor={
                  notificationPreferences.mentalHealthQuestionnaires
                    ? "#000C7B"
                    : "#f4f6fb"
                }
              />
            </View>

            <View style={styles.preferenceDivider} />

            <View style={styles.preferenceRow}>
              <View style={styles.preferenceTextBlock}>
                <Text style={styles.preferenceRowTitle}>
                  Novedades de la app
                </Text>
                <Text style={styles.preferenceRowDescription}>
                  Recibe avisos sobre nuevas funciones, cambios importantes o
                  contenido nuevo dentro de la aplicación.
                </Text>
              </View>
              <Switch
                value={notificationPreferences.appUpdates}
                onValueChange={(value) =>
                  updateNotificationToggle("appUpdates", value)
                }
                trackColor={{ false: "#d6dbe8", true: "#a7b8ff" }}
                thumbColor={
                  notificationPreferences.appUpdates ? "#000C7B" : "#f4f6fb"
                }
              />
            </View>
          </View>

          <View style={styles.selectorCard}>
            <Text style={styles.selectorTitle}>Frecuencia general</Text>
            <View style={styles.optionGroup}>
              {frequencyOptions.map((option) => {
                const isSelected =
                  notificationPreferences.frequency === option;

                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionChip,
                      isSelected && styles.optionChipSelected,
                    ]}
                    onPress={() =>
                      updateNotificationOption("frequency", option)
                    }
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        isSelected && styles.optionChipTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.selectorCard}>
            <Text style={styles.selectorTitle}>Horario preferido</Text>
            <View style={styles.optionGroup}>
              {preferredTimeOptions.map((option) => {
                const isSelected =
                  notificationPreferences.preferredTime === option;

                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionChip,
                      isSelected && styles.optionChipSelected,
                    ]}
                    onPress={() =>
                      updateNotificationOption("preferredTime", option)
                    }
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        isSelected && styles.optionChipTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default NotificationPreferences;

const styles = StyleSheet.create({
  heroSection: {
    paddingHorizontal: 0,
    paddingBottom: 12,
  },
  heroSubtitle: {
    color: "#FFFFFF",
    marginTop: 8,
  },
  heroText: {
    textAlign: "justify",
    color: "#FFFFFF",
    lineHeight: 24,
  },
  contentCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  contentScroll: {
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 32,
  },
  sectionTitle: {
    color: "#1e293b",
    fontFamily: "DoppioOne",
    fontSize: 18,
    marginBottom: 14,
  },
  preferencesCard: {
    backgroundColor: "#f7f9fc",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#e3e8f2",
  },
  preferenceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    gap: 12,
  },
  preferenceTextBlock: {
    flex: 1,
    paddingRight: 8,
  },
  preferenceRowTitle: {
    color: "#243b53",
    fontFamily: "DoppioOne",
    fontSize: 14,
    marginBottom: 4,
  },
  preferenceRowDescription: {
    color: "#5c6169",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "justify",
  },
  preferenceDivider: {
    height: 1,
    backgroundColor: "#e3e8f2",
  },
  selectorCard: {
    backgroundColor: "#f7f9fc",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#e3e8f2",
    marginTop: 14,
  },
  selectorTitle: {
    color: "#243b53",
    fontFamily: "DoppioOne",
    fontSize: 14,
    marginBottom: 12,
  },
  optionGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionChip: {
    borderWidth: 1,
    borderColor: "#d2dae8",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  optionChipSelected: {
    backgroundColor: "#000C7B",
    borderColor: "#000C7B",
  },
  optionChipText: {
    color: "#4b5563",
    fontSize: 12,
    fontWeight: "600",
  },
  optionChipTextSelected: {
    color: "#fff",
  },
});
