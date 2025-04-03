// react imports
import { Dimensions, SafeAreaView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { BarChart } from 'react-native-chart-kit';
import api from '../../../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

// components
import BackButton from '../../../../components/buttons/BackButton';
import { Dropdown } from 'react-native-element-dropdown';

// get functions
import { getMonth, getMonths, getMonthName } from '../../../../utils/getMonths';

// customisation
import ChartStyle from '../../../../assets/styles/ChartStyle';
import GlobalStyle from '../../../../assets/styles/GlobalStyle';
import FormStyle from '../../../../assets/styles/FormStyle';

const QuestionnaireStats = ({ navigation }) => {

  // states
  const [x, setX] = useState([]);
  const [y, setY] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [monthChart, setMonthChart] = useState('');

  const currentMonth = getMonth();
  const months = getMonths();

  // fetch questionnaire data
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth() + 1;
    const initialMonth = `${currentYear}-${String(currentMonthIndex).padStart(2, '0')}`;
    fetchData(initialMonth);
  }, []);

  const fetchData = async (month) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No se encontró el token');
        return;
      }

      const response = await api.get(`${API_URL}/resultsTests/getResultsTestByMonth`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { month },
      });

      const data = response.data.results; // Obtén los resultados del objeto de respuesta

      // Verifica si data es un array antes de iterar
      if (Array.isArray(data) && data.length > 0) {
        const x = [];
        const y = [];

        data.forEach(({ total, created }) => {
          const itemMonth = `${new Date(created).getFullYear()}-${String(new Date(created).getMonth() + 1).padStart(2, '0')}`;
          const day = new Date(created).getDate(); // Obtener el día del test
          if (itemMonth === month) {
            x.push(String(day)); // Agrega el día al eje X
            y.push(total);
          }
        });
        

        //y.unshift(0); // Añade 0 al inicio para la gráfica
        setX(x);
        setY(y);
        setMonthChart(month);
        console.log(`Valores de y para el gráfico: ${y}`);
      } else {
        console.log('No se encontraron resultados para el mes especificado.');
        setX([]);
        setY([]);
        setMonthChart(month);
      }
    } catch (error) {
      console.error('Error al obtener datos del cuestionario:', error);
    }
  };


  //console.error('Data:', error.response.data);
  // console.error('Status:', error.response.status);
  //console.error('Headers:', error.response.headers);

  // handle month selection
  const handleMonthSelected = (month) => {
    setSelectedMonth(month); // Establece el mes seleccionado correctamente
    fetchData(month); // Llama a fetchData con el mes formateado
  };


  return (
    <SafeAreaView style={[FormStyle.container, GlobalStyle.androidSafeArea]}>
      <View style={FormStyle.flexContainer}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={[FormStyle.title, {left: 40}]}>Estadísticas por mes</Text>
      </View>

      {/* Dropdown for selecting month */}
      <View style={{ paddingHorizontal: 30, marginVertical: 20 }}>
        <Dropdown
          placeholderStyle={{ color: '#f2f2f2', fontFamily: 'DoppioOne' }}
          containerStyle={{ borderRadius: 10 }}
          selectedTextStyle={{ color: '#f2f2f2', fontFamily: 'DoppioOne', fontSize: 14 }}
          itemTextStyle={{ color: '#666a72', fontFamily: 'DoppioOne' }}
          iconStyle={{ tintColor: '#fff' }}
          placeholder={currentMonth} // Muestra solo el nombre del mes actual
          data={getMonths()} // Utiliza la nueva función getMonths()
          value={selectedMonth}
          onChange={(item) => handleMonthSelected(item.value)} // Pasa solo el valor
          labelField="label"
          valueField="value"
        />


      </View>

      {y.length > 0 ? (
        <View>
          <BarChart
            data={{
               labels: x, // Días en los que se realizó el test
              datasets: [{ data: y }],
            }}
            width={Dimensions.get('window').width * 0.85}
            height={275}
            chartConfig={{
              barPercentage: 0.8,
              backgroundGradientFrom: '#f2f2f2',
              backgroundGradientTo: '#f2f2f2',
              decimalPlaces: 0,
              fillShadowGradient: '#5da5a9',
              fillShadowGradientOpacity: 1,
              color: (opacity = 1) => `rgba(93, 165, 169, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(40, 42, 45, ${opacity})`,
              propsForDots: {
                r: '3',
                strokeWidth: '1',
                stroke: '#5da5a9',
              },
              propsForBackgroundLines: {
                strokeDasharray: '', // Para líneas continuas en el fondo
              },
            }}
            style={ChartStyle.chartStyle}
            bezier
            yAxisInterval={4}
            fromZero={true} // Asegura que el eje Y comience desde cero
            fromNumber={27} // Establece el valor máximo del eje Y en 27.
            showValuesOnTopOfBars={true} //Muestra los valores de cada barra arriba.

          />

          {/* Etiqueta del eje Y */}
          <Text
            style={{
              position: 'absolute',
              top: '40%', // Centrado relativo a la altura del gráfico
              left: Dimensions.get('window').width * 0.05, // Ajuste de posición horizontal
              transform: [{ rotate: '-90deg' }],
              fontFamily: 'DoppioOne',
              color: '#666a72',
            }}
          >
            Puntaje
          </Text>
          

          {/* Etiqueta del eje X */}
          <Text
            style={{
              position: 'absolute',
              bottom: '3%', // Ajuste relativo a la parte inferior del gráfico
       
              left: Dimensions.get('window').width * 0.45, // Ajuste de posición horizontal
              fontFamily: 'DoppioOne',
              color: '#666a72',
            }}
          >
            Día del mes
          </Text>
        </View>



      ) : (
        <Text>Cargando gráfico...</Text>
      )}

      {/* Table */}
      <View style={[FormStyle.tableSubContainer, FormStyle.tableShadow]}>

        <View style={FormStyle.tableHeader}>
          <Text style={FormStyle.tableHeaderTitle}>
            Clasificación del test
          </Text>
        </View>
        {/* Subtítulos para las columnas */}
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
    </SafeAreaView>
  );
};

export default QuestionnaireStats;
