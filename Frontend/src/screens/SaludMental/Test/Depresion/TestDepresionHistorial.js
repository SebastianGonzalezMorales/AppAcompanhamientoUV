import {
  FlatList,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { fetchWithToken } from "../../../../utils/apiHelpers";
import { Dropdown } from "react-native-element-dropdown";
import { getMonth, getMonths } from "../../../../utils/getMonths";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ModalStyle from "../../../../assets/styles/ModalStyle";
import CustomButton from "../../../../components/buttons/CustomButton";
import GlobalStyles from "../../../../assets/styles/GlobalStyle";

const QuestionnaireHistory = ({ navigation }) => {
  const [results, setResults] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [noData, setNoData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const months = getMonths();       // [{ label, value }, …]
  const currentMonth = getMonth();  // p. ej. "2025-06"

  /* ----- Función para traer datos ----- */
  const fetchData = async (monthFilter = null) => {
    setIsLoading(true);
    setErrorMessage("");
    setNoData(false);

    try {
      const monthString = monthFilter
        ? monthFilter
        : `${new Date().getFullYear()}-${String(
            new Date().getMonth() + 1
          ).padStart(2, "0")}`;

      const response = await fetchWithToken(
        `/resultsTests/getResultsTestByMonth?month=${monthString}`
      );
      const data = response?.results || [];

      const mapped = data.map((item) => ({
        id: item._id,
        severity: item.severity, // “Normal”, “Leve”, etc.
        date: new Date(item.created).toLocaleDateString(),
        totalScore: `${item.totalScore}/27`,
      }));

      if (mapped.length === 0) {
        setNoData(true);
        setResults([]);
      } else {
        setResults(mapped);
      }
    } catch (error) {
      console.error("Error al obtener los resultados:", error);
      setErrorMessage(
        "No pudimos conectarnos. Revisa tu conexión a Internet e inténtalo nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ----- Efecto inicial ----- */
  useEffect(() => {
    fetchData();
  }, []);

  /* ----- Cambio de mes ----- */
  const handleMonthSelected = async (month) => {
    setSelectedMonth(month.value);
    await fetchData(month.value);
  };

  /* ----- Render ----- */
  return (
    <SafeAreaView
      style={[
        GlobalStyles.androidSafeArea,
        { backgroundColor: "#fff", flex: 1 },
      ]}
    >
      {/* Header */}
      <View style={ModalStyle.headerWrapper}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" color="#666a72" size={30} />
        </TouchableOpacity>
        <Text style={[ModalStyle.modalTitle, { flex: 1, textAlign: "center" }]}>
          Historial de tests realizados
        </Text>
      </View>

      {/* Dropdown de mes */}
      <View style={{ paddingHorizontal: 30, marginVertical: 10 }}>
        <Dropdown
          placeholderStyle={{
            color: "#666a72",
            fontFamily: "DoppioOne",
          }}
          containerStyle={{ borderRadius: 10 }}
          selectedTextStyle={{
            color: "#666a72",
            fontFamily: "DoppioOne",
            fontSize: 14,
          }}
          itemTextStyle={{ color: "#666a72", fontFamily: "DoppioOne" }}
          placeholder={currentMonth}
          data={months}
          value={selectedMonth}
          onChange={(month) => handleMonthSelected(month)}
          labelField="label"
          valueField="value"
        />
      </View>

      {/* Lista, mensaje de error o sin datos */}
      <View style={[{ flex: 1 }, ModalStyle.flatlistWrapper]}>
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#5da5a9" />
          </View>
        ) : errorMessage ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <MaterialCommunityIcons name="wifi-off" size={60} color="#666a72" />
            <Text
              style={{
                color: "#666a72",
                fontFamily: "DoppioOne",
                fontSize: 16,
                marginTop: 10,
                textAlign: "center",
              }}
            >
              {errorMessage}
            </Text>
          </View>
        ) : noData ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                color: "#666a72",
                fontFamily: "DoppioOne",
                fontSize: 16,
                marginTop: 10,
                textAlign: "center",
              }}
            >
              No se encontraron registros de tests para este mes 😞.
            </Text>
          </View>
        ) : (
          <FlatList
            data={results}
            numColumns={1}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CustomButton
                buttonStyle={{
                  backgroundColor:
                    item.severity === "Normal"
                      ? "#f7e7d8"
                      : item.severity === "Leve"
                      ? "#d8f7ea"
                      : item.severity === "Moderado"
                      ? "#d8eef7"
                      : item.severity === "Moderadamente grave"
                      ? "#f7d8e3"
                      : item.severity === "Grave"
                      ? "#f7d8e3"
                      : "#ffffff",
                }}
                textStyle={{
                  color:
                    item.severity === "Normal"
                      ? "#af7b56"
                      : item.severity === "Leve"
                      ? "#109f5c"
                      : item.severity === "Moderado"
                      ? "#238bdf"
                      : item.severity === "Moderadamente grave"
                      ? "#d85a77"
                      : item.severity === "Grave"
                      ? "#d85a77"
                      : "#000000",
                }}
                title={item.severity}
                textOne={item.date}
                textTwo={item.totalScore}
                onPress={() =>
                  navigation.navigate("ResultView", { documentId: item.id })
                }
              />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default QuestionnaireHistory;
