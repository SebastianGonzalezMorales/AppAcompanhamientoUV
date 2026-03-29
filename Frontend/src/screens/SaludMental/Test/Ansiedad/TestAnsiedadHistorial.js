import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import BackButton from "../../../../components/buttons/BackButton";
import { Dropdown } from "react-native-element-dropdown";
import { getMonth, getMonths } from "../../../../utils/getMonths";
import GlobalStyle from "../../../../assets/styles/GlobalStyle";
import FormStyle from "../../../../assets/styles/FormStyle";

const TestAnsiedadHistorial = ({ navigation }) => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  const currentMonth = getMonth();
  const months = useMemo(() => getMonths(), []);
  const chartWidth = Dimensions.get("window").width * 0.99;

  useEffect(() => {
    const simulateLoading = async () => {
      setIsLoading(true);
      setNoData(false);

      await new Promise((resolve) => setTimeout(resolve, 700));

      setNoData(true);
      setIsLoading(false);
    };

    simulateLoading();
  }, []);

  const handleMonthSelected = (item) => {
    setSelectedMonth(item.value);
    setIsLoading(true);
    setNoData(false);

    setTimeout(() => {
      setNoData(true);
      setIsLoading(false);
    }, 600);
  };

  return (
    <SafeAreaView style={[FormStyle.container, GlobalStyle.androidSafeArea]}>
      <View style={FormStyle.flexContainer}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={[FormStyle.title, { left: 40 }]}>Estadisticas por mes</Text>
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
              No se encontraron registros de tests para este mes 🫤.
            </Text>
          </View>
        ) : null}
      </View>

      <View
        style={[
          FormStyle.tableSubContainer,
          FormStyle.tableShadow,
          {
            width: chartWidth,
            alignSelf: "center",
            marginBottom: 50,
          },
        ]}
      >
        <View style={FormStyle.tableHeader}>
          <Text style={FormStyle.tableHeaderTitle}>Clasificacion del test</Text>
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
        <View style={[FormStyle.tableRowEven, FormStyle.tableRowEnd]}>
          <Text style={FormStyle.tableText}>Grave</Text>
          <Text style={FormStyle.tableText}>15 - 21</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TestAnsiedadHistorial;
