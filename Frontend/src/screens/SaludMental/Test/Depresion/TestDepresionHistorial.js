import {
  FlatList,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
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

  const months = getMonths();
  const currentMonth = getMonth();

  // Hook para obtener los datos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentMonthString = `${new Date().getFullYear()}-${String(
          new Date().getMonth() + 1
        ).padStart(2, "0")}`;

        console.log("currentMonthString:", currentMonthString);

        const response = await fetchWithToken(
          `/resultsTests/getResultsTestByMonth?month=${currentMonthString}`
        );
        console.log("Response:", response);

        const data = response?.results || [];
        console.log("Data:", data);

        const results = data.map((item) => {
          const severity = item.severity; // Suponiendo que la severidad ya está en español
          const date = new Date(item.created).toLocaleDateString();
          const totalScore = `${item.totalScore}/27`;

          return {
            id: item._id,
            severity,
            date,
            totalScore,
          };
        });
        console.log("Results:", results);

        setResults(results);
      } catch (error) {
        console.error("Error al obtener los resultados:", error);
      }
    };

    fetchData();
  }, []);

  // Manejar la selección del mes
  const handleMonthSelected = async (item) => {
    setSelectedMonth(item.value);
    try {
      const response = await fetchWithToken(
        `/resultsTests/getResultsTestByMonth?month=${item.value}`
      );
      console.log("Response:", response);

      const data = response?.results || [];
      console.log("Data:", data);

      const results = data.map((item) => {
        const severity = item.severity;
        const date = new Date(item.created).toLocaleDateString();
        const totalScore = `${item.totalScore}/27`;

        return {
          id: item._id,
          severity,
          date,
          totalScore,
        };
      });
      setResults(results);
    } catch (error) {
      console.error("Error al obtener los resultados:", error);
    }
  };

  return (
    <SafeAreaView
      style={[
        GlobalStyles.androidSafeArea,
        { backgroundColor: "#fff", flex: 1 },
      ]}
    >
      <View style={ModalStyle.headerWrapper}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" color="#666a72" size={30} />
        </TouchableOpacity>
        <Text style={[ModalStyle.modalTitle, { flex: 1, textAlign: "center" }]}>
          Historial de tests realizados
        </Text>
      </View>

      {/* Dropdown */}
      <View style={{ paddingHorizontal: 30, marginVertical: 10 }}>
        <Dropdown
          placeholderStyle={{
            color: "#666a72",
            fontFamily: "DoppioOne",
          }}
          containerStyle={{
            borderRadius: 10,
          }}
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

      <View style={ModalStyle.flatlistWrapper}>
        <FlatList
          data={results}
          numColumns={1}
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
                    : "#ffffff", // Color por defecto
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
                    : "#000000", // Color por defecto
              }}
              title={item.severity}
              textOne={item.date}
              textTwo={item.totalScore}
              onPress={() => {
                navigation.navigate("ResultView", {
                  documentId: item.id,
                });
              }}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default QuestionnaireHistory;
