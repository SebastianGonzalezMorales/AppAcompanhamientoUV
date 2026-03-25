import React, { useEffect, useMemo, useState } from "react";
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
  const [x, setX] = useState([]);
  const [y, setY] = useState([]);

  const [malCounter, setMalCount] = useState(0);
  const [regularCounter, setRegularCount] = useState(0);
  const [bienCounter, setBienCount] = useState(0);
  const [excelenteCounter, setExcelenteCount] = useState(0);

  const [moodData, setMoodData] = useState([]);
  const [monthChart, setMonthChart] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMsg] = useState("");
  const [noData, setNoData] = useState(false);

  const currentMonth = getMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const months = getMonths();

  const pieChartData = useMemo(
    () => [
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
    ],
    [malCounter, regularCounter, bienCounter, excelenteCounter]
  );

  const hasPieData = pieChartData.some((item) => Number(item.count) > 0);
  const hasLineData = Array.isArray(y) && y.length > 1;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setErrorMsg("");
      setNoData(false);

      try {
        const response = await fetchWithToken(
          "/moodState/get-MoodStatesByUserId"
        );

        console.log("Respuesta completa de la API:", response);

        const safeData = Array.isArray(response?.data) ? response.data : [];

        setMoodData(safeData);

        if (safeData.length === 0) {
          setNoData(true);
          setX([]);
          setY([]);
          setMalCount(0);
          setRegularCount(0);
          setBienCount(0);
          setExcelenteCount(0);
          setMonthChart(selectedMonth);
        }
      } catch (err) {
        console.error("Error al obtener los estados de ánimo:", err);
        setMoodData([]);
        setNoData(false);
        setErrorMsg(
          "No pudimos conectarnos. Revisa tu conexión a Internet e inténtalo nuevamente."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth]);

  useEffect(() => {
    if (!Array.isArray(moodData) || moodData.length === 0) {
      setNoData(true);
      setX([]);
      setY([]);
      setMalCount(0);
      setRegularCount(0);
      setBienCount(0);
      setExcelenteCount(0);
      setMonthChart(selectedMonth);
      return;
    }

    filterDataByMonth(selectedMonth);
  }, [selectedMonth, moodData]);

  const filterDataByMonth = (monthLabel) => {
    const newX = [];
    const newY = [];

    let mal = 0;
    let regular = 0;
    let bien = 0;
    let excelente = 0;

    moodData.forEach(({ moodState, intensity, date }) => {
      if (!date) return;

      const month = getMonthName(new Date(date).getMonth());

      if (monthLabel === month) {
        newX.push("");

        const intensidadValue =
          typeof intensity === "object"
            ? intensity?.value ?? intensity?.label
            : intensity;

        const numericIntensity = Number(intensidadValue);

        if (Number.isFinite(numericIntensity)) {
          newY.push(numericIntensity);
        }

        const moodStateValue =
          typeof moodState === "object"
            ? moodState?.value ?? moodState?.label
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
          default:
            break;
        }
      }
    });

    const totalPie = mal + regular + bien + excelente;

    if (newY.length === 0 || totalPie === 0) {
      setNoData(true);
      setX([]);
      setY([]);
      setMalCount(0);
      setRegularCount(0);
      setBienCount(0);
      setExcelenteCount(0);
      setMonthChart(monthLabel);
      return;
    }

    setNoData(false);
    setX(newX);
    setY([0, ...newY]);
    setMalCount(mal);
    setRegularCount(regular);
    setBienCount(bien);
    setExcelenteCount(excelente);
    setMonthChart(monthLabel);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#5da5a9" />
        </View>
      );
    }

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

    if (noData || !hasPieData || !hasLineData) {
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

    return (
      <>
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

        <View style={ChartStyle.legendContainer}>
          <Text style={ChartStyle.legendtext}>1 - Mal</Text>
          <Text style={ChartStyle.legendtext}>2 - Regular</Text>
          <Text style={ChartStyle.legendtext}>3 - Bien</Text>
          <Text style={ChartStyle.legendtext}>4 - Excelente</Text>
        </View>

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

  return (
    <SafeAreaView style={[FormStyle.container, GlobalStyle.androidSafeArea]}>
      <View style={FormStyle.flexContainer}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={[FormStyle.title, { left: 30 }]}>
          Estadísticas por mes
        </Text>
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
          data={months.map((m) => ({ label: m.label, value: m.label }))}
          value={selectedMonth}
          onChange={(item) => setSelectedMonth(item.label)}
          labelField="label"
          valueField="value"
        />
      </View>

      {renderContent()}
    </SafeAreaView>
  );
};

export default MoodStats;