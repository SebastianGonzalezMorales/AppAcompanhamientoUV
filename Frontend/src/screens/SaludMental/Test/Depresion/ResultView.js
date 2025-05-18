// react imports
import { SafeAreaView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import api from "../../../../utils/api";
import Constants from "expo-constants";

// Asigna API_URL desde la configuración
const { API_URL } = Constants.expoConfig?.extra || {};
// URL de la API desde las variables de entorno
import AsyncStorage from "@react-native-async-storage/async-storage";

import { format } from "date-fns";
import { es } from "date-fns/locale"; // Importa el idioma español

// components
import FormButton from "../../../../components/buttons/FormButton";

// customisation
import FormStyle from "../../../../assets/styles/FormStyle";
import GlobalStyle from "../../../../assets/styles/GlobalStyle";

const ResultView = ({ route, navigation }) => {
  // fetch document id passed from previous screen
  const { documentId } = route.params;

  // states
  const [total, setTotal] = useState("");
  const [severity, setSeverity] = useState("");
  const [date, setDate] = useState("");

  /*
   * *******************
   * **** Functions ****
   * *******************
   */

  // get document data based on document id
  useEffect(() => {
    const getResult = async () => {
      try {
        // Hacer una llamada a la API para obtener los resultados del test
        const token = await AsyncStorage.getItem("token"); // Autorización con token

        const response = await api.get(
          `${API_URL}/resultsTests/get-resultsTest/${documentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const resultData = response.data;

        setTotal(resultData.totalScore);
        setSeverity(resultData.severity);

        const formattedDate = format(
          new Date(resultData.created),
          "dd 'de' MMMM",
          { locale: es }
        );

        setDate(formattedDate);
      } catch (error) {
        console.error("Error al obtener los resultados:", error);
      }
    };

    getResult();
  }, [documentId]);

  /*
   * ****************
   * **** Screen ****
   * ****************
   */

  return (
    <SafeAreaView style={[FormStyle.container, GlobalStyle.androidSafeArea]}>
      {/* table */}
      <View style={FormStyle.resultContainer}>
        <Text style={FormStyle.resultTextOne}>Tu resultado</Text>
        <Text style={FormStyle.resultTextTwo}>{totalScore} / 27</Text>
        <Text style={FormStyle.resultTextThree}>{severity}</Text>
      </View>

      <View style={FormStyle.tableContainer}>
        <View style={FormStyle.tableHeader}>
          <Text style={FormStyle.tableHeaderTitle}>Fecha del test</Text>
        </View>
        <View style={[FormStyle.tableRowOdd, FormStyle.tableRowEnd]}>
          <Text style={FormStyle.tableText}>Fecha</Text>
          <Text style={FormStyle.tableText}>{date}</Text>
        </View>

        <View style={FormStyle.tableSubContainer}>
          <View style={FormStyle.tableHeader}>
            <Text style={FormStyle.tableHeaderTitle}>
              Clasificación del test
            </Text>
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

      {/* button */}
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
};

export default ResultView;
