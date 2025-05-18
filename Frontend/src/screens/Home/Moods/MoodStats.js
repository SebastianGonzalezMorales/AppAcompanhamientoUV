import { Dimensions, SafeAreaView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { LineChart, PieChart } from "react-native-chart-kit";
import { fetchWithToken } from "../../../utils/apiHelpers";
import { Dropdown } from "react-native-element-dropdown";
import { getMonth, getMonths, getMonthName } from "../../../utils/getMonths";
import ChartStyle from "../../../assets/styles/ChartStyle";
import GlobalStyle from "../../../assets/styles/GlobalStyle";
import FormStyle from "../../../assets/styles/FormStyle";

import BackButton from "../../../components/buttons/BackButton";

const MoodStats = ({ navigation }) => {
  const [x, setX] = useState([]);
  const [y, setY] = useState([]);
  const [malCounter, setMalCount] = useState(0);
  const [regularCounter, setRegularCount] = useState(0);
  const [bienCounter, setBienCount] = useState(0);
  const [excelenteCounter, setExcelenteCount] = useState(0);
  const [monthChart, setMonthChart] = useState("");
  const [moodData, setMoodData] = useState([]);

  const currentMonth = getMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const months = getMonths();

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

  // Obtenemos los datos solo una vez
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithToken(
          "/moodState/get-MoodStatesByUserId"
        );
        setMoodData(response.data);
      } catch (error) {
        console.error("Error al obtener los estados de ánimo:", error);
      }
    };
    fetchData();
  }, []);

  // Cada vez que cambia el mes seleccionado o se cargan los datos, filtramos
  useEffect(() => {
    if (moodData.length > 0) {
      filterDataByMonth(selectedMonth);
    }
  }, [selectedMonth, moodData]);

  const filterDataByMonth = (monthLabel) => {
    const x = [];
    const y = [];
    let mal = 0;
    let regular = 0;
    let bien = 0;
    let excelente = 0;

    moodData.forEach((moodEntry) => {
      const { moodState, intensity, date } = moodEntry;
      const moodStateValue =
        typeof moodState === "object"
          ? moodState.value || moodState.label
          : moodState;
      const intensidadValue =
        typeof intensity === "object"
          ? intensity.value || intensity.label
          : intensity;
      const month = getMonthName(new Date(date).getMonth());

      if (monthLabel === month) {
        x.push("");
        y.push(Number(intensidadValue));
        setMonthChart(monthLabel);

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

    y.unshift(0);
    setX(x);
    setY(y);
    setMalCount(mal);
    setRegularCount(regular);
    setBienCount(bien);
    setExcelenteCount(excelente);
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
          data={months.map((month) => ({
            label: month.label,
            value: month.label,
          }))}
          value={selectedMonth}
          onChange={(item) => setSelectedMonth(item.label)}
          labelField="label"
          valueField="value"
        />
      </View>

      {y.length > 0 ? (
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
            fromZero={true}
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
      ) : (
        <Text>Cargando gráfico...</Text>
      )}

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
    </SafeAreaView>
  );
};

export default MoodStats;
