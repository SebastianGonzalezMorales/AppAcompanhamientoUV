import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { getMonth, getMonths } from "../../../../utils/getMonths";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ModalStyle from "../../../../assets/styles/ModalStyle";
import GlobalStyles from "../../../../assets/styles/GlobalStyle";

const TestAnsiedadEstadisticas = ({ navigation }) => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  const months = useMemo(() => getMonths(), []);
  const currentMonth = getMonth();

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
          onChange={(item) => handleMonthSelected(item)}
          labelField="label"
          valueField="value"
        />
      </View>

      <View
        style={[
          ModalStyle.flatlistWrapper,
          {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          },
        ]}
      >
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#5da5a9" />
          </View>
        ) : noData ? (
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
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default TestAnsiedadEstadisticas;
