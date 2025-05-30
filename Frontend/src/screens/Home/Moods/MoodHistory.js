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
  const [isLoading, setIsLoading] = useState(true);

  const months = getMonths();
  const currentMonth = getMonth();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage("");

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
            id: entry._id,
            mood: entry.moodState,
            date: new Date(entry.date).toLocaleDateString(),
            time: new Date(entry.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));

        if (filteredMoods.length === 0) {
          setErrorMessage("No se encontraron registros para este mes.");
        } else {
          setErrorMessage("");
        }

        setMoods(filteredMoods);
      } catch (error) {
        console.error("Error al obtener los estados de ánimo:", error);
        setErrorMessage(
          "Error al cargar los datos. Por favor, inténtalo de nuevo."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMonthSelected = async (selectedValue) => {
    setSelectedMonth(selectedValue);
    setIsLoading(true);
    setErrorMessage("");

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
          id: entry._id,
          mood: entry.moodState,
          date: new Date(entry.date).toLocaleDateString(),
          time: new Date(entry.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

      if (filteredMoods.length === 0) {
        setErrorMessage("No se encontraron registros para este mes.");
      } else {
        setErrorMessage("");
      }

      setMoods(filteredMoods);
    } catch (error) {
      console.error("Error al obtener los estados de ánimo:", error);
      setErrorMessage(
        "Error al cargar los datos. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
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

      {/* Lista o mensaje de error o cargando */}
      <View style={ModalStyle.flatlistWrapper}>
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
              padding: 20,
            }}
          >
            <Text
              style={[
                GlobalStyles.text,
                { textAlign: "center", color: "#666a72" },
              ]}
            >
              {errorMessage}
            </Text>
          </View>
        ) : (
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
                  navigation.navigate("MoodDetails", { moodId: item.id });
                }}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default MoodHistory;
