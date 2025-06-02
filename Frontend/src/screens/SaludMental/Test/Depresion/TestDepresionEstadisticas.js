// react imports
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

// components
import BackButton from "../../../../components/buttons/BackButton";
import { Dropdown } from "react-native-element-dropdown";

// get functions
import { getMonth, getMonths, getMonthName } from "../../../../utils/getMonths";

// customisation
import ChartStyle from "../../../../assets/styles/ChartStyle";
import GlobalStyle from "../../../../assets/styles/GlobalStyle";
import FormStyle from "../../../../assets/styles/FormStyle";

const { API_URL } = Constants.expoConfig?.extra || {};

const QuestionnaireStats = ({ navigation }) => {
  /* ----- Estados ----- */
  const [x, setX] = useState([]);          // etiquetas eje X (días)
  const [y, setY] = useState([]);          // valores eje Y (puntajes)
  const [selectedMonth, setSelectedMonth] = useState("");
  const [monthChart, setMonthChart] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [noData, setNoData] = useState(false);

  const currentMonth = getMonth();
  const months = getMonths();

  const chartwidth = Dimensions.get("window").width * 0.99;

  /* ----- Traer datos al montar ----- */
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth() + 1;
    const initialMonth = `${currentYear}-${String(currentMonthIndex).padStart(
      2,
      "0"
    )}`;
    fetchData(initialMonth);
  }, []);

  /* ----- Fetch datos ----- */
  const fetchData = async (month) => {
    setIsLoading(true);
    setErrorMessage("");
    setNoData(false);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Sin token de autenticación");

      const response = await api.get(
        `${API_URL}/resultsTests/getResultsTestByMonth`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { month },
        }
      );

      const data = response.data.results || [];

      /* Mapear resultados */
      if (Array.isArray(data) && data.length > 0) {
        const newX = [];
        const newY = [];

        data.forEach(({ totalScore, created }) => {
          const itemMonth = `${new Date(created).getFullYear()}-${String(
            new Date(created).getMonth() + 1
          ).padStart(2, "0")}`;
          const day = new Date(created).getDate();
          if (itemMonth === month) {
            newX.push(String(day));
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

      setMonthChart(month);
    } catch (error) {
      console.error("Error al obtener datos del cuestionario:", error);
      setErrorMessage(
        "No pudimos conectarnos. Revisa tu conexión a Internet e inténtalo nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ----- Cambio de mes ----- */
  const handleMonthSelected = (item) => {
    setSelectedMonth(item.value);
    fetchData(item.value);
  };

  /* ----- Render ----- */
  return (
    <SafeAreaView style={[FormStyle.container, GlobalStyle.androidSafeArea]}>
      {/* Header */}
      <View style={FormStyle.flexContainer}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={[FormStyle.title, { left: 40 }]}>Estadísticas por mes</Text>
      </View>

      {/* Dropdown de mes */}
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

      {/* Gráfico o mensajes */}
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
          <BarChart
            data={{
              labels: x,
              datasets: [{ data: y }],
            }}
            width={Dimensions.get("window").width * 0.85}
            height={275}
            chartConfig={{
              barPercentage: 0.8,
              backgroundGradientFrom: "#f2f2f2",
              backgroundGradientTo: "#f2f2f2",
              decimalPlaces: 0,
              fillShadowGradient: "#5da5a9",
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
          />
        )}
      </View>

      {/* Tabla de clasificación */}
      <View style={[FormStyle.tableSubContainer, FormStyle.tableShadow, {
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
