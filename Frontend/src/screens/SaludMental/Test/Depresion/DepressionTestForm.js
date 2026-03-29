// react imports
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { format } from "date-fns";
import { es } from "date-fns/locale"; // Importar el idioma español

// Import the API URL from environment variables
import Constants from "expo-constants";

// Asigna API_URL desde la configuración
const { API_URL } = Constants.expoConfig?.extra || {};

// components
import BackButton from "../../../../components/buttons/BackButton";
import FormButton from "../../../../components/buttons/FormButton";
import OptionButton from "../../../../components/buttons/OptionButton";
import SmallFormButton from "../../../../components/buttons/SmallFormButton";

// customisation
import FormStyle from "../../../../assets/styles/FormStyle";
import GlobalStyle from "../../../../assets/styles/GlobalStyle";

// helper for PHQ-9 severity
import { getSeverity } from "../../../../utils/phq9";

const DepressionTestForm = ({ navigation }) => {
  // states
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [date, setDate] = useState("");
  const [severity, setSeverity] = useState("");
  const [pendingQuestionNumber, setPendingQuestionNumber] = useState(null);
  const [validationModalVisible, setValidationModalVisible] = useState(false);

  // get all questions from the API
  useEffect(() => {
    const getQuestions = async () => {
      setSelectedOptions({});
      setShowResults(false);
      try {
        const token = await AsyncStorage.getItem("token");

        if (token) {
          const response = await api.get(
            `${API_URL}/questions/get-questions?code=PHQ9`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setQuestions(response.data);
        } else {
          console.log("No se encontró el token. Por favor, inicia sesión.");
        }
      } catch (error) {
        console.error(error);
      }
    };

    getQuestions();
  }, []);

  // set the selected option
  const handleSelectedOptions = (index, option) => {
    setSelectedOptions({
      ...selectedOptions,
      [index]: option,
    });
  };

  // submit for results and set data to database
  const handleSubmit = async () => {
    const firstUnansweredIndex = questions.findIndex(
      (_, index) => selectedOptions[index] === undefined
    );

    if (firstUnansweredIndex !== -1) {
      setPendingQuestionNumber(firstUnansweredIndex + 1);
      setValidationModalVisible(true);
      return;
    }

    let totalScore = 0;
    questions.forEach((question, index) => {
      if (selectedOptions[index] === question.selectedoption1) {
        totalScore += 0;
      } else if (selectedOptions[index] === question.selectedoption2) {
        totalScore += 1;
      } else if (selectedOptions[index] === question.selectedoption3) {
        totalScore += 2;
      } else if (selectedOptions[index] === question.selectedoption4) {
        totalScore += 3;
      }
    });

    // determine severity using helper
    const computedSeverity = getSeverity(totalScore);
    setSeverity(computedSeverity);
    setScore(totalScore);
    setShowResults(true);

    // Generar la fecha en español
    const formattedDate = format(new Date(), "dd 'de' MMMM", { locale: es });
    setDate(formattedDate);

    try {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        const userResponse = await api.post(
          `${API_URL}/tokens/userid`,
          { token },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const userId = userResponse.data.userId;

        await api.post(
          `${API_URL}/resultsTests/post-resultsTest`,
          {
            userId,
            code: "PHQ9",
            totalScore,
            severity: computedSeverity,
            date: formattedDate,
            created: new Date(),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error("Error al enviar datos:", error);
      setPendingQuestionNumber(null);
      setValidationModalVisible(true);
    }
  };

  if (questions.length === 0) {
    return (
      <View>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (showResults) {
    return (
      <SafeAreaView style={[FormStyle.container, GlobalStyle.androidSafeArea]}>
        <View style={FormStyle.resultContainer}>
          <Text style={FormStyle.resultTextOne}>Tu resultado</Text>
          <Text style={FormStyle.resultTextTwo}>
            {score} / {questions.length * 3}
          </Text>
          <Text style={FormStyle.resultTextThree}>{severity}</Text>
        </View>

        <View style={FormStyle.tableContainer}>
          <View style={[FormStyle.tableRowOdd, FormStyle.tableRowEnd]}>
            <Text style={[FormStyle.tableText]}>Fecha del test</Text>
            <Text style={[FormStyle.tableText]}>{date}</Text>
          </View>

          <View style={FormStyle.tableSubContainer}>
            <View style={FormStyle.tableHeader}>
              <Text style={FormStyle.tableHeaderTitle}>
                Clasificación del test
              </Text>
            </View>

            <View style={FormStyle.tableColumnHeader}>
              <Text style={FormStyle.tableColumnText}>Estado</Text>
              <Text style={FormStyle.tableColumnText}>Puntaje</Text>
            </View>

            <View style={FormStyle.tableRowOdd}>
              <Text style={FormStyle.tableText}>Normal</Text>
              <Text style={FormStyle.tableText}>0 - 4</Text>
            </View>
            <View style={FormStyle.tableRowEven}>
              <Text style={FormStyle.tableText}>Leve</Text>
              <Text style={FormStyle.tableText}>5 - 9</Text>
            </View>
            <View style={FormStyle.tableRowOdd}>
              <Text style={FormStyle.tableText}>Moderado</Text>
              <Text style={FormStyle.tableText}>10 - 14</Text>
            </View>
            <View style={FormStyle.tableRowEven}>
              <Text style={FormStyle.tableText}>Moderadamente grave</Text>
              <Text style={FormStyle.tableText}>15 - 19</Text>
            </View>
            <View style={[FormStyle.tableRowOdd, FormStyle.tableRowEnd]}>
              <Text style={FormStyle.tableText}>Grave</Text>
              <Text style={FormStyle.tableText}>20 - 27</Text>
            </View>
          </View>
        </View>

        <View style={[FormStyle.buttonContainer, FormStyle.buttonPosition]}>
          <FormButton
            onPress={() => navigation.navigate("DepressionTestMain")}
            text="Volver atrás"
            buttonStyle={{ backgroundColor: "#f2f2f2" }}
            textStyle={{ color: "#5da5a9" }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[FormStyle.container, GlobalStyle.androidSafeArea]}>
      <Modal
        transparent
        animationType="fade"
        visible={validationModalVisible}
        onRequestClose={() => setValidationModalVisible(false)}
      >
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalCard}>
            <Text style={localStyles.modalTitle}>
              {pendingQuestionNumber ? "Pregunta pendiente" : "Error"}
            </Text>
            <Text style={localStyles.modalText}>
              {pendingQuestionNumber
                ? (
                  <>
                    Debes responder la pregunta{" "}
                    <Text style={localStyles.modalTextNumber}>
                      {pendingQuestionNumber}
                    </Text>{" "}
                    antes de continuar.
                  </>
                )
                : "No se pudo enviar los resultados. Por favor, inténtalo de nuevo."}
            </Text>

            <TouchableOpacity
              style={localStyles.modalButton}
              onPress={() => setValidationModalVisible(false)}
            >
              <Text style={localStyles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={FormStyle.flexContainer}>
        <BackButton onPress={() => navigation.goBack()} />

        <Text style={FormStyle.title}>PHQ-9</Text>
      </View>

      <FlatList
        data={questions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          const formattedQuestion = item.question
            .trim()
            .replace(/^(\d+\.\s*¿)\s*/, "$1"); // Formatea para mantener "1. ¿"
          return (
            <View>
              {index === 0 && (
                <Text style={FormStyle.questionnaireText}>
                  Durante las últimas dos semanas, ¿ con qué frecuencia le han
                  molestado alguno de los siguientes problemas ?
                </Text>
              )}
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <Text
                  style={[
                    FormStyle.question,
                    { fontFamily: "CustomFontForQuestion" },
                  ]}
                >
                  {formattedQuestion}
                </Text>
              </View>
              <View style={FormStyle.optionContainer}>
                <OptionButton
                  buttonStyle={[
                    selectedOptions[index] === 0 && FormStyle.selectedOption,
                  ]}
                  textStyle={
                    selectedOptions[index] === 0 && FormStyle.selectedOptionText
                  }
                  onPress={() => handleSelectedOptions(index, 0)}
                  text={item.option1}
                />
                <OptionButton
                  buttonStyle={[
                    selectedOptions[index] === 1 && FormStyle.selectedOption,
                  ]}
                  textStyle={
                    selectedOptions[index] === 1 && FormStyle.selectedOptionText
                  }
                  onPress={() => handleSelectedOptions(index, 1)}
                  text={item.option2}
                />
                <OptionButton
                  buttonStyle={[
                    selectedOptions[index] === 2 && FormStyle.selectedOption,
                  ]}
                  textStyle={
                    selectedOptions[index] === 2 && FormStyle.selectedOptionText
                  }
                  onPress={() => handleSelectedOptions(index, 2)}
                  text={item.option3}
                />
                <OptionButton
                  buttonStyle={[
                    selectedOptions[index] === 3 && FormStyle.selectedOption,
                  ]}
                  textStyle={
                    selectedOptions[index] === 3 && FormStyle.selectedOptionText
                  }
                  onPress={() => handleSelectedOptions(index, 3)}
                  text={item.option4}
                />
              </View>
              {index === 8 && (
                <View style={FormStyle.smallButtonContainer}>
                  <SmallFormButton onPress={handleSubmit} text={"Responder"} />
                </View>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default DepressionTestForm;

const localStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.28)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  modalCard: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  modalTitle: {
    color: "#5c6169",
    fontFamily: "DoppioOne",
    fontSize: 19,
    marginBottom: 8,
    textAlign: "center",
  },
  modalText: {
    color: "#5c6169",
    fontFamily: "Actor",
    fontSize: 18,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 16,
  },
  modalTextNumber: {
    fontFamily: "Actor",
    fontSize: 18,
    color: "#5c6169",
  },
  modalButton: {
    alignSelf: "center",
    minWidth: 96,
    borderRadius: 12,
    backgroundColor: "#f2f2f2",
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  modalButtonText: {
    color: "#5da5a9",
    fontFamily: "DoppioOne",
    fontSize: 17,
    textAlign: "center",
  },
});
