// react imports
import { Alert, FlatList, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // Importar el idioma español

// Import the API URL from environment variables
import { API_URL } from '@env';

// components
import BackButton from '../../../../components/buttons/BackButton';
import FormButton from '../../../../components/buttons/FormButton';
import OptionButton from '../../../../components/buttons/OptionButton';
import SmallFormButton from '../../../../components/buttons/SmallFormButton';

// customisation
import FormStyle from '../../../../assets/styles/FormStyle';
import GlobalStyle from '../../../../assets/styles/GlobalStyle';

const DepressionTestForm = ({ navigation }) => {
  // states
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [date, setDate] = useState('');
  const [severity, setSeverity] = useState('');

  // get all questions from the API
  useEffect(() => {
    const getQuestions = async () => {
      setSelectedOptions({});
      setShowResults(false);
      try {
        const token = await AsyncStorage.getItem('token');

        if (token) {
          const response = await api.get(`${API_URL}/questions/get-questions`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const questions = response.data;
          setQuestions(questions);
        } else {
          console.log('No se encontró el token. Por favor, inicia sesión.');
        }
      } catch (error) {
        console.error(error);
      }
    };

    getQuestions();
  }, []);

  // set the selected option
  const handleSelectedOptions = (index, option) => {
    setSelectedOptions({
      ...selectedOptions,
      [index]: option,
    });
  };

  // submit for results and set data to database
  const handleSubmit = async () => {
    let total = 0;
    questions.forEach((question, index) => {
      if (selectedOptions[index] === question.selectedoption1) {
        total += 0;
      } else if (selectedOptions[index] === question.selectedoption2) {
        total += 1;
      } else if (selectedOptions[index] === question.selectedoption3) {
        total += 2;
      } else if (selectedOptions[index] === question.selectedoption4) {
        total += 3;
      }
    });

    let severity = '';
    if (total >= 0 && total <= 4) {
      severity = 'Normal';
    } else if (total > 4 && total < 10) {
      severity = 'Leve';
    } else if (total >= 10 && total < 15) {
      severity = 'Moderado';
    } else if (total >= 15 && total < 20) {
      severity = 'Moderadamente grave';
    } else {
      severity = 'Grave';
    }

    setSeverity(severity);
    setScore(total);
    setShowResults(true);

    // Generar la fecha en español
    const date = format(new Date(), "dd 'de' MMMM", { locale: es });
    setDate(date);

    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        const userResponse = await api.post(
          `${API_URL}/tokens/userid`,
          { token: `${token}` },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userId = userResponse.data.userId;

        const response = await api.post(
          `${API_URL}/resultsTests/post-resultsTest`,
          {
            userId,
            total,
            severity,
            date,
            created: new Date(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Datos enviados correctamente:', response.data);
      }
    } catch (error) {
      console.error('Error al enviar datos:', error);
      Alert.alert('Error', 'No se pudo enviar los resultados. Por favor, inténtalo de nuevo.');
    }
  };

  if (questions.length === 0) {
    return (
      <View>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (showResults) {
    return (
      <SafeAreaView style={[FormStyle.container, GlobalStyle.androidSafeArea]}>
        <View style={FormStyle.resultContainer}>
          <Text style={FormStyle.resultTextOne}>Tu resultado</Text>
          <Text style={FormStyle.resultTextTwo}>
            {score} / {questions.length * 3}
          </Text>
          <Text style={FormStyle.resultTextThree}>{severity}</Text>
        </View>

        <View style={FormStyle.tableContainer}>
          <View style={[FormStyle.tableRowOdd, FormStyle.tableRowEnd]}>
            <Text style={[FormStyle.tableText]}>Fecha del test</Text>
            <Text style={[FormStyle.tableText]}>{date}</Text>
          </View>

          <View style={FormStyle.tableSubContainer}>
            <View style={FormStyle.tableHeader}>
              <Text style={FormStyle.tableHeaderTitle}>
                Clasificación del test
              </Text>
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
            <View style={FormStyle.tableRowEven}>
              <Text style={FormStyle.tableText}>Moderadamente grave</Text>
              <Text style={FormStyle.tableText}>15 - 19</Text>
            </View>
            <View style={[FormStyle.tableRowOdd, FormStyle.tableRowEnd]}>
              <Text style={FormStyle.tableText}>Grave</Text>
              <Text style={FormStyle.tableText}>20 - 27</Text>
            </View>
          </View>
        </View>

        <View style={[FormStyle.buttonContainer, FormStyle.buttonPosition]}>
          <FormButton
            onPress={() => navigation.navigate('DepressionTestMain')}
            text="Volver atrás"
            buttonStyle={{ backgroundColor: '#f2f2f2' }}
            textStyle={{ color: '#5da5a9' }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[FormStyle.container, GlobalStyle.androidSafeArea]}>
      <View style={FormStyle.flexContainer}>
        <BackButton onPress={() => navigation.goBack()} />

        <Text style={FormStyle.title}>PHQ-9</Text>
      </View>

      <FlatList
  data={questions}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item, index }) => {
    const formattedQuestion = item.question.trim().replace(/^(\d+\.\s*¿)\s*/, '$1'); // Formatea para mantener "1. ¿"
    return (
      <View>
        {index === 0 && (
          <Text style={FormStyle.questionnaireText}>
            Durante las últimas dos semanas, ¿ con qué frecuencia le han molestado alguno de los siguientes problemas ?
          </Text>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <Text style={[FormStyle.question, { fontFamily: 'CustomFontForQuestion' }]}>
            {formattedQuestion}
          </Text>
        </View>
        <View style={FormStyle.optionContainer}>
          <OptionButton
            buttonStyle={[
              selectedOptions[index] === 0 && FormStyle.selectedOption,
            ]}
            textStyle={
              selectedOptions[index] === 0 && FormStyle.selectedOptionText
            }
            onPress={() => handleSelectedOptions(index, 0)}
            text={item.option1}
          />
          <OptionButton
            buttonStyle={[
              selectedOptions[index] === 1 && FormStyle.selectedOption,
            ]}
            textStyle={
              selectedOptions[index] === 1 && FormStyle.selectedOptionText
            }
            onPress={() => handleSelectedOptions(index, 1)}
            text={item.option2}
          />
          <OptionButton
            buttonStyle={[
              selectedOptions[index] === 2 && FormStyle.selectedOption,
            ]}
            textStyle={
              selectedOptions[index] === 2 && FormStyle.selectedOptionText
            }
            onPress={() => handleSelectedOptions(index, 2)}
            text={item.option3}
          />
          <OptionButton
            buttonStyle={[
              selectedOptions[index] === 3 && FormStyle.selectedOption,
            ]}
            textStyle={
              selectedOptions[index] === 3 && FormStyle.selectedOptionText
            }
            onPress={() => handleSelectedOptions(index, 3)}
            text={item.option4}
          />
        </View>
        {index === 8 && (
          <View style={FormStyle.smallButtonContainer}>
            <SmallFormButton onPress={handleSubmit} text={'Responder'} />
          </View>
        )}
      </View>
    );
  }}
/>



    </SafeAreaView>
  );
};

export default DepressionTestForm;
