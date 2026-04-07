import {
  SafeAreaView,
  Text,
  View,
  Alert,
  TouchableOpacity,
  StyleSheet, Linking,
  ScrollView
} from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';

// Componentes personalizados
import CustomButton from '../../../../components/buttons/CustomButton';
import HistoryButton from '../../../../components/buttons/HistoryButton';
import StatsButton from '../../../../components/buttons/StatsButton';
import CircularButton from '../../../../components/buttons/CircularButton';
import BackButton from '../../../../components/buttons/BackButton';

// Estilos globales
import GlobalStyle from '../../../../assets/styles/GlobalStyle';

function AnsiedadTestMain({ navigation }) {
  const [results, setResults] = useState([]);
  const [lastTest, setLastTest] = useState('Cargando...');
  const [graveCount, setGraveCount] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const initializeTooltip = async () => {
    try {
      const shown = await AsyncStorage.getItem('shownTooltipAnsiedad');
      if (!shown) {
        setShowTooltip(true);
      } else {
        setShowTooltip(false);
      }
    } catch (error) {
      console.error('Error al inicializar el estado del tooltip:', error);
    }
  };

  const storeTooltipShown = async () => {
    try {
      await AsyncStorage.setItem('shownTooltipAnsiedad', 'true');
      setShowTooltip(false);
    } catch (error) {
      console.error('Error al guardar el estado del tooltip:', error);
    }
  };

  const resetTooltip = async () => {
    try {
      await AsyncStorage.removeItem('shownTooltipAnsiedad');
      setShowTooltip(true);
    } catch (error) {
      console.error('Error al reiniciar el estado del tooltip:', error);
    }
  };

  const handleLinkPress = () => {
    Linking.openURL('https://pubmed.ncbi.nlm.nih.gov/16717171/');
  };
  


  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);

          // Inicializar tooltip solo una vez al entrar a la vista
          await initializeTooltip();

          // Simulación de retraso para mostrar "Cargando..." por más tiempo
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Simulación de obtención de datos
          const fetchedResults = []; // Simulamos que no hay resultados
          setResults(fetchedResults);

          if (fetchedResults.length > 0) {
            setLastTest(formatDate(fetchedResults[0].created));
          } else {
            setLastTest('Sin resultados previos');
          }

          const graveResults = fetchedResults.filter(
            (result) => result.severity === 'Grave'
          );
          setGraveCount(graveResults.length);
        } catch (error) {
          console.error('Error al obtener los resultados:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }, [])
  );

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      <BackButton onPress={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={styles.screenContent}
        showsVerticalScrollIndicator={false}
      >

      {graveCount >= 20 && (
        <View style={styles.alertContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={16}
              color="#e53935"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.alertTitle}>Atención</Text>
            <MaterialCommunityIcons
              name="close"
              size={16}
              color="#e53935"
              onPress={() => setGraveCount(0)}
            />
          </View>
          <Text style={styles.alertMessage}>
            Hemos detectado que podrías estar atravesando una situación difícil.
          </Text>
          <Text style={styles.alertSubMessage}>
            Por favor, envíanos un correo a{' '}
            <Text style={{ fontWeight: 'bold' }}>dae@uv.cl</Text>, indicando tu
            teléfono. También puedes llamarnos o escribirnos un WhatsApp al
            +569 68301655 de Lunes a Viernes de 8:30 a 17:30 horas.
          </Text>
        </View>
      )}

      <View style={{ minHeight: 320, paddingBottom: 16 }}>
        <Text style={GlobalStyle.welcomeText}>Test GAD-7</Text>
        <Text style={[GlobalStyle.subtitle, { textAlign: 'justify', marginTop: 8 }]}>Test de Ansiedad Generalizada</Text>
        <Text style={[GlobalStyle.text, { textAlign: 'justify' }]}> El cuestionario GAD-7 es una herramienta que se utiliza para medir la
          gravedad de la ansiedad a través de siete preguntas. Ayuda a
          identificar a las personas que pueden requerir una evaluación o
          tratamiento adicional para la ansiedad.</Text>

          
  {/* Contenedor del botón con margen izquierdo igual al del texto */}
  <View style={{ 
    marginTop: 8, 
    paddingLeft: GlobalStyle.text.paddingLeft || 16, // Asegúrate de que coincida con el padding del texto
    // Si `GlobalStyle.text` no tiene `paddingLeft`, ajusta el valor según corresponda
  }}>
    <TouchableOpacity
      onPress={handleLinkPress}
      style={{
        backgroundColor: '#E6F0FF',
        paddingVertical: 4, // Aumenté el padding para mejor apariencia
        paddingHorizontal: 12,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#B0C4DE',
        alignSelf: 'flex-start', // Alinea el botón al inicio del contenedor
      }}
    >
      <Ionicons name="link" size={14} color="#1E90FF" />
      <Text style={{ 
        color: '#1E90FF', 
        fontSize: 12, 
        marginLeft: 4, 
        fontWeight: '500' 
      }}>
        Fuente
      </Text>
    </TouchableOpacity>
  </View>


        <View style={GlobalStyle.line} />
        <Text style={[GlobalStyle.text, { textAlign: 'justify' }]}>Última prueba realizada: {isLoading ? 'Cargando...' : lastTest}</Text>
      </View>

            {/* Sección de estadísticas y resultados */}
            <View style={[GlobalStyle.rowTwo, styles.resultsCard]}>
        <View style={GlobalStyle.statsContainer}>
          <Text style={GlobalStyle.statsTitle}>Estadísticas</Text>
          <StatsButton
            onPress={() => navigation.navigate('TestAnsiedadHistorial')}
          />
        </View>

        <HistoryButton
          onPress={() => navigation.navigate('TestAnsiedadEstadisticas')}
          textLeft="Resultados"
          textRight="Ver todos"
        />

      {isLoading ? (
        <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>Cargando resultados...</Text>
      ) : results.length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>            Aún no has realizado ningún test. Completa un test para ver tus resultados.</Text>
      ) : (
        <View>
          {results.slice(0, 10).map((item) => (
            <CustomButton
              key={item.id}
              buttonStyle={{
                backgroundColor:
                  item.severity === 'Normal'
                    ? '#fdf3e4'
                    : item.severity === 'Leve'
                    ? '#e4f7f1'
                    : item.severity === 'Moderado'
                    ? '#e4eff7'
                    : item.severity === 'Moderadamente grave'
                    ? '#f7e4eb'
                    : '#f7d8e3',
                paddingVertical: 15,
                paddingHorizontal: 20,
                marginBottom: 10,
                borderRadius: 10,
              }}
              onPress={() => {
                navigation.navigate('ResultView', { documentId: item.id });
              }}
              title={item.severity}
              textOne={item.dateData}
              textTwo={item.totalScore}
              textStyle={{ color: '#af7b56' }}
            />
          ))}
        </View>
      )}
    </View>
    </ScrollView>

      {showTooltip && (
        <>
          <View style={styles.tooltipContainer}>
            <Text style={styles.tooltipText}>¡Pulsa aquí para iniciar tu primer test!</Text>
            <TouchableOpacity
              onPress={() => {
                setShowTooltip(false);
                storeTooltipShown();
              }}
              style={styles.tooltipButton}
            >
              <Text style={styles.tooltipButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
          <Animatable.View
            animation="bounce"
            easing="ease-in-out"
            iterationCount="infinite"
            style={styles.arrowContainer}
          >
            <MaterialCommunityIcons name="arrow-down" size={30} color="#9F8758" />
          </Animatable.View>
        </>
      )}

      {/* Botón flotante */}
      <Animatable.View
        animation="pulse"
        easing="ease-in-out"
        duration={800}
        iterationCount="infinite"
        style={styles.floatingButtonContainer}
      >
        <CircularButton
          onPress={async () => {
            Alert.alert(
              'Funcionalidad no disponible',
              'Las preguntas de este test aún no están cargadas. La funcionalidad se habilitará cuando el contenido sea cargado por el administrador. Intenta nuevamente más tarde.',
              [{ text: 'Aceptar' }]
            );
            setShowTooltip(false);
            await storeTooltipShown();
          }}
          setVisble={false}
        />
      </Animatable.View>

      <View style={{ position: 'absolute', top: 100, right: 20 }}>
{/*         <TouchableOpacity
          onPress={resetTooltip}
          style={{ backgroundColor: '#ddd', padding: 10, borderRadius: 5 }}
        >
          <Text>Reset Tooltip</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ 
  screenContent: {
    paddingBottom: 0,
  },
  resultsCard: {
    paddingBottom: 32,
  },

  floatingButtonContainer: {
    position: 'absolute',
    bottom: 22,
    right: 30,
    backgroundColor: '#FFF',
    padding: 5,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  tooltipContainer: {
    position: 'absolute',
    bottom: '12%',
    right: '10%',
    width: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipText: {
    color: '#888',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 10,
  },
  tooltipButton: {
    backgroundColor: '#9F8758',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  tooltipButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  arrowContainer: {
    position: 'absolute',
    bottom: 109,
    right: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertContainer: {
    padding: 15,
    backgroundColor: '#fff3e0',
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ffd699',
  },
  alertTitle: {
    color: '#e53935',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  alertMessage: {
    color: '#e53935',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'justify',
    marginTop: 8,
    fontWeight: 'bold',
  },
  alertSubMessage: {
    color: '#333',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'justify',
    marginTop: 5,
  },

 });

export default AnsiedadTestMain;
