import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { BarChart } from "react-native-chart-kit";
import api from "../../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

import BackButton from "../../../../components/buttons/BackButton";
import { Dropdown } from "react-native-element-dropdown";

import { getMonth, getMonths } from "../../../../utils/getMonths";

import ChartStyle from "../../../../assets/styles/ChartStyle";
import GlobalStyle from "../../../../assets/styles/GlobalStyle";
import FormStyle from "../../../../assets/styles/FormStyle";

const { API_URL } = Constants.expoConfig?.extra || {};

const getCurrentMonthValue = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const getScoreColor = (score, opacity = 1) => {
  if (score >= 20) return `rgba(176, 0, 32, ${opacity})`;
  if (score >= 15) return `rgba(255, 159, 67, ${opacity})`;
  if (score >= 10) return `rgba(255, 214, 10, ${opacity})`;
  if (score >= 5) return `rgba(35, 139, 223, ${opacity})`;
  return `rgba(16, 159, 92, ${opacity})`;
};

const getScoreBaseColor = (score) => {
  if (score >= 20) return "#ffc9d2";
  if (score >= 15) return "#ffd7b0";
  if (score >= 10) return "#fff1a8";
  if (score >= 5) return "#d8eef7";
  return "#d8f7ea";
};

const QuestionnaireStats = ({ navigation }) => {
  const [x, setX] = useState([]);
  const [y, setY] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [noData, setNoData] = useState(false);

  const currentMonth = getMonth();
  const months = getMonths();
  const initialMonthValue = getCurrentMonthValue();

  const chartwidth = Dimensions.get("window").width * 0.99;

  useEffect(() => {
    setSelectedMonth(initialMonthValue);
    fetchData(initialMonthValue);
  }, []);

  const fetchData = async (month) => {
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

      const response = await api.post(
        `${API_URL}/resultsTests/get-resultsTestUser/${userId}`,
        { token },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data.results || [];

      if (Array.isArray(data) && data.length > 0) {
        const newX = [];
        const newY = [];

        data.forEach(({ totalScore, created }) => {
          const createdDate = new Date(created);
          const itemMonth = `${createdDate.getFullYear()}-${String(
            createdDate.getMonth() + 1
          ).padStart(2, "0")}`;

          if (itemMonth === month) {
            newX.push(String(createdDate.getDate()));
            newY.push(totalScore);
          }
        });

        if (newY.length === 0) {
          setNoData(true);
          setX([]);
          setY([]);
        } else {
          setX(newX);
          setY(newY);
        }
      } else {
        setNoData(true);
        setX([]);
        setY([]);
      }
    } catch (error) {
      console.error("Error al obtener datos del cuestionario:", error);
      setErrorMessage(
        "No pudimos conectarnos. Revisa tu conexión a Internet e inténtalo nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleMonthSelected = (item) => {
    setSelectedMonth(item.value);
    fetchData(item.value);
  };

  return (
    <SafeAreaView style={[FormStyle.container, GlobalStyle.androidSafeArea]}>
      <View style={FormStyle.flexContainer}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={[FormStyle.title, { left: 40 }]}>Estadísticas por mes</Text>
      </View>

      <View style={{ paddingHorizontal: 30, marginVertical: 20 }}>
        <Dropdown
          placeholderStyle={{ color: "#f2f2f2", fontFamily: "DoppioOne" }}
          containerStyle={{ borderRadius: 10 }}
          selectedTextStyle={{
            color: "#f2f2f2",
            fontFamily: "DoppioOne",
            fontSize: 14,
          }}
          itemTextStyle={{ color: "#666a72", fontFamily: "DoppioOne" }}
          iconStyle={{ tintColor: "#fff" }}
          placeholder={currentMonth}
          data={months}
          value={selectedMonth}
          onChange={(item) => handleMonthSelected(item)}
          labelField="label"
          valueField="value"
        />
      </View>

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#5da5a9" />
        ) : errorMessage ? (
          <View style={{ paddingHorizontal: 20 }}>
            <Text
              style={{
                color: "#666a72",
                fontFamily: "DoppioOne",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              {errorMessage}
            </Text>
          </View>
        ) : noData ? (
          <View style={{ paddingHorizontal: 20 }}>
            <Text
              style={{
                color: "#666a72",
                fontFamily: "DoppioOne",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              No se encontraron registros de tests para este mes 😞.
            </Text>
          </View>
        ) : (
          <View style={{ alignItems: "center", marginTop: 16 }}>
            <View style={{ position: "relative", alignItems: "center" }}>
              <BarChart
                data={{
                  labels: x,
                  datasets: [
                    {
                      data: y,
                      colors: y.map((score) => (opacity = 1) =>
                        getScoreColor(score, opacity < 0.75 ? 0.75 : opacity)
                      ),
                    },
                  ],
                }}
                width={Dimensions.get("window").width * 0.85}
                height={275}
                chartConfig={{
                  barPercentage: 0.8,
                  backgroundGradientFrom: "#f2f2f2",
                  backgroundGradientTo: "#f2f2f2",
                  decimalPlaces: 0,
                  fillShadowGradient: getScoreColor(Math.max(...y)),
                  fillShadowGradientFrom: getScoreBaseColor(Math.max(...y)),
                  fillShadowGradientFromOpacity: 1,
                  fillShadowGradientTo: getScoreColor(Math.max(...y)),
                  fillShadowGradientToOpacity: 1,
                  fillShadowGradientOpacity: 1,
                  color: (opacity = 1) => `rgba(93, 165, 169, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(40, 42, 45, ${opacity})`,
                  propsForDots: { r: "3", strokeWidth: "1", stroke: "#5da5a9" },
                  propsForBackgroundLines: { strokeDasharray: "" },
                }}
                style={ChartStyle.chartStyle}
                bezier
                yAxisInterval={4}
                fromZero={true}
                fromNumber={27}
                showValuesOnTopOfBars={true}
                withCustomBarColorFromData={true}
              />

              <Text
                style={{
                  position: "absolute",
                  left: -16,
                  top: "43%",
                  color: "#000000",
                  fontFamily: "DoppioOne",
                  fontSize: 11,
                  fontWeight: "700",
                  transform: [{ rotate: "-90deg" }],
                }}
              >
                Puntaje PHQ-9
              </Text>

              <Text
                style={{
                  position: "absolute",
                  bottom: 10,
                  alignSelf: "center",
                  color: "#000000",
                  fontFamily: "DoppioOne",
                  fontSize: 12,
                  fontWeight: "700",
                }}
              >
                Día del mes
              </Text>
            </View>
          </View>
        )}
      </View>

      <View
        style={[
          FormStyle.tableSubContainer,
          FormStyle.tableShadow,
          {
            width: chartwidth,
            alignSelf: "center",
            marginBottom: 50,
          },
        ]}
      >
        <View style={FormStyle.tableHeader}>
          <Text style={FormStyle.tableHeaderTitle}>Clasificación del test</Text>
        </View>

        <View style={FormStyle.tableColumnHeader}>
          <Text style={FormStyle.tableColumnText}>Estado</Text>
          <Text style={FormStyle.tableColumnText}>Puntaje</Text>
        </View>

        {[
          ["Normal", "0 - 4"],
          ["Leve", "5 - 9"],
          ["Moderado", "10 - 14"],
          ["Moderadamente grave", "15 - 19"],
          ["Grave", "20 - 27"],
        ].map(([label, range], idx) => (
          <View
            key={label}
            style={
              idx % 2 === 0
                ? FormStyle.tableRowOdd
                : idx === 4
                ? [FormStyle.tableRowOdd, FormStyle.tableRowEnd]
                : FormStyle.tableRowEven
            }
          >
            <Text style={FormStyle.tableText}>{label}</Text>
            <Text style={FormStyle.tableText}>{range}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default QuestionnaireStats;
