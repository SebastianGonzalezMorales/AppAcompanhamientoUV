import {
  FlatList,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import api from "../../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Dropdown } from "react-native-element-dropdown";
import { getMonth, getMonths } from "../../../../utils/getMonths";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ModalStyle from "../../../../assets/styles/ModalStyle";
import CustomButton from "../../../../components/buttons/CustomButton";
import GlobalStyles from "../../../../assets/styles/GlobalStyle";

const { API_URL } = Constants.expoConfig?.extra || {};

const getCurrentMonthValue = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const getSeverityStyles = (severity) => {
  switch (severity) {
    case "Normal":
      return { backgroundColor: "#d8f7ea", textColor: "#109f5c" };
    case "Leve":
      return { backgroundColor: "#d8eef7", textColor: "#238bdf" };
    case "Moderado":
      return { backgroundColor: "#fff1a8", textColor: "#d4a000" };
    case "Moderadamente grave":
      return { backgroundColor: "#ffd7b0", textColor: "#f08c00" };
    case "Grave":
      return { backgroundColor: "#ffc9d2", textColor: "#b00020" };
    default:
      return { backgroundColor: "#ffffff", textColor: "#000000" };
  }
};

const QuestionnaireHistory = ({ navigation }) => {
  const [results, setResults] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [noData, setNoData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const months = getMonths();
  const currentMonth = getMonth();
  const initialMonthValue = getCurrentMonthValue();

  const fetchData = async (monthFilter = initialMonthValue) => {
    setIsLoading(true);
    setErrorMessage("");
    setNoData(false);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Sin token de autenticación");

      const { data: userResponse } = await api.post(
        `${API_URL}/tokens/userid`,
        { token },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userId = userResponse.userId;
      if (!userId) throw new Error("No se encontró userId");

      const { data: resultsResponse } = await api.post(
        `${API_URL}/resultsTests/get-resultsTestUser/${userId}`,
        { token },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const monthString = monthFilter;
      const data = resultsResponse.results || [];

      const mapped = data
        .filter((item) => {
          const createdDate = new Date(item.created);
          const itemMonth = `${createdDate.getFullYear()}-${String(
            createdDate.getMonth() + 1
          ).padStart(2, "0")}`;
          return itemMonth === monthString;
        })
        .sort((a, b) => new Date(b.created) - new Date(a.created))
        .map((item) => ({
          id: item._id,
          severity: item.severity,
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

  useEffect(() => {
    setSelectedMonth(initialMonthValue);
    fetchData(initialMonthValue);
  }, []);

  const handleMonthSelected = async (month) => {
    setSelectedMonth(month.value);
    await fetchData(month.value);
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
            renderItem={({ item }) => {
              const severityStyles = getSeverityStyles(item.severity);

              return (
                <CustomButton
                  buttonStyle={{
                    backgroundColor: severityStyles.backgroundColor,
                  }}
                  textStyle={{
                    color: severityStyles.textColor,
                  }}
                  title={item.severity}
                  textOne={item.date}
                  textTwo={item.totalScore}
                  onPress={() =>
                    navigation.navigate("ResultView", { documentId: item.id })
                  }
                />
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default QuestionnaireHistory;
