import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const Policy = ({ navigation }) => {
  const [isPolicyChecked, setIsPolicyChecked] = useState(false); // Estado para la casilla

  const acceptPolicy = async () => {
    if (isPolicyChecked) {
      try {
        await AsyncStorage.setItem('policyAccepted', 'true');
        Alert.alert('¡Todo Listo!', 'Gracias por aceptar nuestra política de privacidad. ¡Ahora puedes empezar a utilizar la aplicación!');
        navigation.navigate('Register'); // Redirigir al registro
      } catch (error) {
        console.error('Error al guardar la política:', error);
      }
    } else {
      Alert.alert('Atención', 'Debes aceptar la política para continuar.');
    }
  };

  const handleBackToOnboarding = () => {
    navigation.navigate('Login'); // Navegar de vuelta al Onboarding
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/images/PoliticaDePrivacidad/PoliticaDePrivacidadV1.png')}
          style={styles.image}
        />
        <Text style={styles.title}>Política de Seguridad y Privacidad</Text>

        {/* ScrollView solo para el texto de la política */}
        <ScrollView style={styles.textScroll} contentContainerStyle={styles.textContent}>
          <Text style={styles.text}>
            <Text style={styles.boldText}>AppAcompañamientoUV</Text> es una aplicación experimental destinada a apoyar a los estudiantes de primer año en su adaptación a la vida universitaria. Los datos proporcionados a través de esta aplicación no serán compartidos con terceros y solo serán utilizados con fines académicos en el contexto de esta investigación.{"\n\n"}
            
            Se garantiza que toda la información personal será almacenada de forma segura, respetando los principios de <Text style={styles.boldText}>confidencialidad</Text>, <Text style={styles.boldText}>integridad</Text> y <Text style={styles.boldText}>disponibilidad</Text>. Esto significa que:{"\n\n"}
            
            <Text style={styles.boldText}>Confidencialidad:</Text> Tus datos personales no serán divulgados a nadie fuera del equipo de investigación.{"\n"}
            <Text style={styles.boldText}>Integridad:</Text> La información proporcionada se almacenará sin alteraciones y será tratada de manera precisa.{"\n"}
            <Text style={styles.boldText}>Disponibilidad:</Text> La aplicación se mantendrá operativa, aunque puede haber interrupciones temporales debido a su carácter experimental.{"\n\n"}
            
            Al utilizar la aplicación, aceptas los términos de esta política y comprendes que es un proyecto académico destinado exclusivamente a investigación.
          </Text>
        </ScrollView>

        {/* Casilla de verificación utilizando BouncyCheckbox */}
        <View style={styles.checkboxContainer}>
          <BouncyCheckbox
            size={22}
            fillColor="#000C7B" // Mantiene el color azul fuerte
            unfillColor="#FFFFFF"
            text="He leído y acepto los términos de uso y la política de seguridad de appAcompañamientoUV."
            iconStyle={{ borderColor: "#000C7B", borderRadius: 4 }}
            innerIconStyle={{ borderWidth: 2 }}
            textStyle={{ textDecorationLine: "none", color: '#333', fontSize: 14 }}
            isChecked={isPolicyChecked}
            onPress={(isChecked) => setIsPolicyChecked(isChecked)}
          />
        </View>

        {/* Botón de Aceptar */}
        <TouchableOpacity
          style={[styles.acceptButton, !isPolicyChecked && styles.disabledButton]} 
          onPress={acceptPolicy}
          disabled={!isPolicyChecked} // Deshabilitar botón si no está marcada la casilla
        >
          <Text style={styles.buttonText}>Aceptar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBackToOnboarding} style={{ marginTop: 20 }} >
          <Text style={styles.textButton}>Volver atrás</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Policy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000C7B',
    marginVertical: 10,
  },
  textScroll: {
    maxHeight: 200, // Ajusta el alto máximo del ScrollView
    marginBottom: 20, // Espaciado inferior
  },
  textContent: {
    paddingRight: 10, // Añade espacio entre el borde derecho y el texto
  },
  text: {
    fontSize: 16,
    textAlign: 'justify',
    color: '#333',
  },
  boldText: {
    fontWeight: 'bold',
  },
  textButton: {
    color: '#000C7B',
    fontFamily: 'Actor',
    fontSize: 16,
  },
  acceptButton: {
    backgroundColor: '#000C7B',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 250,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
});
