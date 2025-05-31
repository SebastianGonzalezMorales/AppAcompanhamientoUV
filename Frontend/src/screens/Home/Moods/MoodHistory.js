import {
  FlatList,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { fetchWithToken } from "../../../utils/apiHelpers";
import { Dropdown } from "react-native-element-dropdown";
import { getMonth, getMonths } from "../../../utils/getMonths";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ModalStyle from "../../../assets/styles/ModalStyle";
import CustomButton from "../../../components/buttons/CustomButton";
import GlobalStyles from "../../../assets/styles/GlobalStyle";

const MoodHistory = ({ navigation }) => {
  const [moods, setMoods] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [noData, setNoData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const months = getMonths();
  const currentMonth = getMonth();

  const fetchData = async (monthFilter = null) => {
    setIsLoading(true);
    setErrorMessage("");
    setNoData(false);

    try {
      const response = await fetchWithToken(
        "/moodState/get-MoodStatesByUserId"
      );
      const moodData = response?.data || [];

      if (!Array.isArray(moodData)) {
        throw new Error("Formato de datos inválido");
      }

      const filteredMoods = moodData
        .filter((entry) => {
          const date = new Date(entry.date);
          const entryMonth = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`;

          if (monthFilter) return entryMonth === monthFilter;
          return date.getMonth() === new Date().getMonth();
        })
        .map((entry) => ({
          id: entry._id,
          mood: entry.moodState,
          date: new Date(entry.date).toLocaleDateString(),
          time: new Date(entry.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

      if (filteredMoods.length === 0) {
        setNoData(true);
        setMoods([]);
      } else {
        setNoData(false);
        setMoods(filteredMoods);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setErrorMessage(
        "No pudimos conectarnos. Revisa tu conexión a Internet e inténtalo nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMonthSelected = async (selectedValue) => {
    setSelectedMonth(selectedValue);
    await fetchData(selectedValue);
  };

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
          Historial de estado de ánimo
        </Text>
      </View>

      {/* Dropdown de mes */}
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
          onChange={(month) => handleMonthSelected(month.value)}
          labelField="label"
          valueField="value"
        />
      </View>

      {/* Lista, mensaje de error o mensaje sin datos */}
      <View style={[{ flex: 1 }, ModalStyle.flatlistWrapper]}>
        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
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
              No se encontraron registros de estados de ánimo para este mes 😞.
            </Text>
          </View>
        ) : (
          <FlatList
            data={moods}
            numColumns={1}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CustomButton
                buttonStyle={{
                  backgroundColor:
                    item.mood === "Mal"
                      ? "#f7d8e3"
                      : item.mood === "Bien"
                      ? "#d8eef7"
                      : item.mood === "Excelente"
                      ? "#d8f7ea"
                      : "#FBEEB0",
                }}
                textStyle={{
                  color:
                    item.mood === "Mal"
                      ? "#F20C0C"
                      : item.mood === "Bien"
                      ? "#2626D8"
                      : item.mood === "Excelente"
                      ? "#32CD32"
                      : "#F4D63D",
                }}
                title={item.mood}
                textOne={item.date}
                textTwo={item.time}
                onPress={() => {
                  navigation.navigate("MoodDetails", { moodId: item.id });
                }}
              />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default MoodHistory;
