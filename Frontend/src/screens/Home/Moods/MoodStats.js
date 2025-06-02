import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { Dropdown } from "react-native-element-dropdown";

import { fetchWithToken } from "../../../utils/apiHelpers";
import { getMonth, getMonths, getMonthName } from "../../../utils/getMonths";

import BackButton from "../../../components/buttons/BackButton";
import ChartStyle from "../../../assets/styles/ChartStyle";
import GlobalStyle from "../../../assets/styles/GlobalStyle";
import FormStyle from "../../../assets/styles/FormStyle";

const MoodStats = ({ navigation }) => {
  /* ──────────── Estados principales ──────────── */
  const [x, setX] = useState([]);
  const [y, setY] = useState([]);

  const [malCounter, setMalCount] = useState(0);
  const [regularCounter, setRegularCount] = useState(0);
  const [bienCounter, setBienCount] = useState(0);
  const [excelenteCounter, setExcelenteCount] = useState(0);

  const [moodData, setMoodData] = useState([]);
  const [monthChart, setMonthChart] = useState("");

  /* Estados de UI */
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMsg] = useState("");
  const [noData, setNoData] = useState(false);

  /* Mes seleccionado */
  const currentMonth = getMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const months = getMonths();

  /* ──────────── Datos para el pie chart ──────────── */
  const pieChartData = [
    {
      name: "Mal",
      count: malCounter,
      color: "#F20C0C",
      legendFontColor: "#7F7F7F",
      legendFontSize: 14,
    },
    {
      name: "Regular",
      count: regularCounter,
      color: "#F4D63D",
      legendFontColor: "#7F7F7F",
      legendFontSize: 14,
    },
    {
      name: "Bien",
      count: bienCounter,
      color: "#2626D8",
      legendFontColor: "#7F7F7F",
      legendFontSize: 14,
    },
    {
      name: "Excelente",
      count: excelenteCounter,
      color: "#32CD32",
      legendFontColor: "#7F7F7F",
      legendFontSize: 14,
    },
  ];

  /* ──────────── 1. Descarga de datos ──────────── */

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setErrorMsg("");

      try {
        const response = await fetchWithToken(
          "/moodState/get-MoodStatesByUserId"
        );
        setMoodData(response.data || []);
      } catch (err) {
        console.error("Error al obtener los estados de ánimo:", err);
        setErrorMsg(
          "No pudimos conectarnos. Revisa tu conexión a Internet e inténtalo nuevamente."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ──────────── 2. Filtrado según mes ──────────── */

  useEffect(() => {
    if (moodData.length > 0) filterDataByMonth(selectedMonth);
  }, [selectedMonth, moodData]);

  const filterDataByMonth = (monthLabel) => {
    const newX = [];
    const newY = [];

    let mal = 0,
      regular = 0,
      bien = 0,
      excelente = 0;

    moodData.forEach(({ moodState, intensity, date }) => {
      const month = getMonthName(new Date(date).getMonth());

      if (monthLabel === month) {
        /* Eje X se mantiene vacío (simples separadores) */
        newX.push("");

        /* Intensidad (1-4) al eje Y */
        const intensidadValue =
          typeof intensity === "object"
            ? intensity.value || intensity.label
            : intensity;
        newY.push(Number(intensidadValue));

        /* Contadores para pie chart */
        const moodStateValue =
          typeof moodState === "object"
            ? moodState.value || moodState.label
            : moodState;

        switch (moodStateValue) {
          case "Mal":
            mal++;
            break;
          case "Regular":
            regular++;
            break;
          case "Bien":
            bien++;
            break;
          case "Excelente":
            excelente++;
            break;
        }
      }
    });

    /* ¿Hay registros? */
    if (newX.length === 0) {
      setNoData(true);
      /* Vaciar gráficos y contadores */
      setX([]);
      setY([]);
      setMalCount(0);
      setRegularCount(0);
      setBienCount(0);
      setExcelenteCount(0);
      return;
    }

    /* Sí hay registros */
    setNoData(false);
    newY.unshift(0); // para que el eje Y arranque en 0
    setX(newX);
    setY(newY);
    setMalCount(mal);
    setRegularCount(regular);
    setBienCount(bien);
    setExcelenteCount(excelente);
    setMonthChart(monthLabel);
  };

  /* ──────────── 3. Render ──────────── */
  const renderContent = () => {
    /* Cargando datos */
    if (isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#5da5a9" />
        </View>
      );
    }

    /* Error de red */
    if (errorMessage) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
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
      );
    }

    /* Sin datos en ese mes */
    if (noData) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Text
            style={{
              color: "#666a72",
              fontFamily: "DoppioOne",
              fontSize: 16,
              textAlign: "center",
            }}
          >
            No se encontraron registros de estados de ánimo para este mes 😞.
          </Text>
        </View>
      );
    }

    /*  Hay datos: mostramos gráficos + leyendas */
    return (
      <>
        {/* Line chart */}
        <View>
          <LineChart
            data={{ labels: x, datasets: [{ data: y }] }}
            width={Dimensions.get("window").width * 0.85}
            height={200}
            chartConfig={{
              backgroundGradientFrom: "#f2f2f2",
              backgroundGradientTo: "#f2f2f2",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(93, 165, 169, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(40, 42, 45, ${opacity})`,
              propsForDots: { r: "3", strokeWidth: "1", stroke: "#5da5a9" },
            }}
            style={ChartStyle.chartStyle}
            bezier
            fromNumber={4}
            yAxisMax={4}
            fromZero
          />
          <Text
            style={{
              position: "absolute",
              alignSelf: "center",
              bottom: "3%",
              paddingLeft: 30,
              color: "#666a72",
              fontFamily: "DoppioOne",
            }}
          >
            {monthChart}
          </Text>
        </View>

        {/* Leyenda 1-4 */}
        <View style={ChartStyle.legendContainer}>
          <Text style={ChartStyle.legendtext}>1 - Mal</Text>
          <Text style={ChartStyle.legendtext}>2 - Regular</Text>
          <Text style={ChartStyle.legendtext}>3 - Bien</Text>
          <Text style={ChartStyle.legendtext}>4 - Excelente</Text>
        </View>

        {/* Pie chart */}
        <View style={ChartStyle.pieChartContainer}>
          <PieChart
            data={pieChartData}
            width={Dimensions.get("window").width * 0.85}
            height={200}
            chartConfig={{
              backgroundGradientFrom: "#f2f2f2",
              backgroundGradientTo: "#f2f2f2",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(93, 165, 169, ${opacity})`,
            }}
            accessor="count"
            backgroundColor="transparent"
            style={ChartStyle.pieChartStyle}
          />
        </View>
      </>
    );
  };

  /* ──────────── UI superior (header + dropdown) ──────────── */

  return (
    <SafeAreaView style={[FormStyle.container, GlobalStyle.androidSafeArea]}>
      {/* Header */}
      <View style={FormStyle.flexContainer}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={[FormStyle.title, { left: 30 }]}>
          Estadísticas por mes
        </Text>
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
          data={months.map((m) => ({ label: m.label, value: m.label }))}
          value={selectedMonth}
          onChange={(item) => setSelectedMonth(item.label)}
          labelField="label"
          valueField="value"
        />
      </View>

      {/* Contenido dinámico */}
      {renderContent()}
    </SafeAreaView>
  );
};

export default MoodStats;
