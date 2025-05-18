import {
  FlatList,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { fetchWithToken } from "../../../utils/apiHelpers";
import { Dropdown } from "react-native-element-dropdown";
import { getMonth, getMonths } from "../../../utils/getMonths";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ModalStyle from "../../../assets/styles/ModalStyle";
import CustomButton from "../../../components/buttons/CustomButton";
import GlobalStyles from "../../../assets/styles/GlobalStyle"; // Importa el estilo global

const MoodHistory = ({ navigation }) => {
  const [moods, setMoods] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");

  const months = getMonths();
  const currentMonth = getMonth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithToken(
          "/moodState/get-MoodStatesByUserId"
        );
        const moodData = response?.data || [];

        if (!Array.isArray(moodData)) {
          throw new Error(
            "Los datos obtenidos no son una lista válida de estados de ánimo"
          );
        }

        const currentMonthNumber = new Date().getMonth();

        const filteredMoods = moodData
          .filter(
            (entry) => new Date(entry.date).getMonth() === currentMonthNumber
          )
          .map((entry) => ({
            id: entry._id, // Asegúrate de pasar el ID correctamente
            mood: entry.moodState,
            date: new Date(entry.date).toLocaleDateString(),
            time: new Date(entry.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));

        setMoods(filteredMoods);
      } catch (error) {
        console.error("Error al obtener los estados de ánimo:", error);
      }
    };

    fetchData();
  }, []);

  const handleMonthSelected = async (selectedValue) => {
    setSelectedMonth(selectedValue);

    try {
      const response = await fetchWithToken(
        "/moodState/get-MoodStatesByUserId"
      );
      const moodData = response?.data || [];

      if (!Array.isArray(moodData)) {
        throw new Error(
          "Los datos obtenidos no son una lista válida de estados de ánimo"
        );
      }

      const filteredMoods = moodData
        .filter((entry) => {
          const entryMonth = `${new Date(entry.date).getFullYear()}-${String(
            new Date(entry.date).getMonth() + 1
          ).padStart(2, "0")}`;
          return entryMonth === selectedValue;
        })
        .map((entry) => ({
          id: entry._id, // Asegúrate de pasar el ID correctamente
          mood: entry.moodState,
          date: new Date(entry.date).toLocaleDateString(),
          time: new Date(entry.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

      setMoods(filteredMoods);
    } catch (error) {
      console.error("Error al obtener los estados de ánimo:", error);
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
        {/* Botón de volver */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" color="#666a72" size={30} />
        </TouchableOpacity>

        {/* Título centrado */}
        <Text style={[ModalStyle.modalTitle, { flex: 1, textAlign: "center" }]}>
          Historial de Estado de Ánimo
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
          onChange={(month) => handleMonthSelected(month.value)}
          labelField="label"
          valueField="value"
        />
      </View>

      <View style={ModalStyle.flatlistWrapper}>
        <FlatList
          data={moods}
          numColumns={1}
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
                navigation.navigate("MoodDetails", { moodId: item.id }); // Pasa el ID dinámico
              }}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default MoodHistory;
