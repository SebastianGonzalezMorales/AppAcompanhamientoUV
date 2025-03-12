import React, { useState } from 'react';
import { SafeAreaView, Text, ScrollView, View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';
import SupportButton from '../../../components/buttons/SupportButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function RedesDeApoyo({ navigation }) {
  const [expandedSections, setExpandedSections] = useState({
    uno: false,
    dos: false,
    tres: false,
    cuatro: false,
    cinco: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      <View style={{ height: 260, padding: 15 }}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={GlobalStyle.welcomeText}>Aprende sobre salud mental</Text>
        <Text style={[GlobalStyle.subtitleMenu, { color: '#FFFFFF' }]}>Redes de apoyo</Text>
        {/*  <Text style={{ color: '#FFFFFF', marginVertical: 10, paddingHorizontal: 20, textAlign: 'justify' }}> */}
        <Text style={[GlobalStyle.text, { textAlign: 'justify', color: '#FFFFFF' }]}>
          Conecta con los recursos y contactos disponibles para apoyarte en momentos difíciles.
        </Text>
      </View>

      <View style={GlobalStyle.rowTwo}>
        <ScrollView>
          <View style={{ marginTop: 15 }}>

            {/* Botón 1: Fono Prevención del Suicidio */}
            <SupportButton
              text="Fono prevención del suicidio - MINSAL"
              onPress={() => toggleSection('uno')}
              isExpanded={expandedSections.uno}
            />
            {expandedSections.uno && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  Si estás enfrentando una situación de crisis o necesitas orientación inmediata para
                  prevenir el suicidio, puedes comunicarte con un profesional capacitado. Este servicio es gratuito y está disponible las 24
                  horas, todos los días.
                </Text>
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => Linking.openURL('tel:*4141')}
                >
                  <MaterialCommunityIcons name="phone" size={18} color="#FFF" />
                  <Text style={styles.callButtonText}>Llamar al *4141</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Botón 2: Salud Responde */}
            <SupportButton
              text="Salud responde - MINSAL"
              onPress={() => toggleSection('dos')}
              isExpanded={expandedSections.dos}
            />
            {expandedSections.dos && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  Este servicio responde a las necesidades de información de la población en múltiples materias
                  asociadas a la salud. Específicamente para salud mental, cuenta con psicólogos que ofrecen
                  orientación profesional y ayuda en situaciones de crisis.
                </Text>
                <Text style={styles.infoText}>
                  Horario de atención: lunes a viernes, de 08:30 a 20:30 horas.
                </Text>
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => Linking.openURL('tel:6003607777')}
                >
                  <MaterialCommunityIcons name="phone" size={18} color="#FFF" />
                  <Text style={styles.callButtonText}>Llamar al 600 360 7777</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Botón 3: Hablemos de todo */}
            <SupportButton
              text="Hablemos de todo - INJUV"
              onPress={() => toggleSection('tres')}
              isExpanded={expandedSections.tres}
            />
            {expandedSections.tres && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  Chat de apoyo psicológico dirigido a jóvenes entre 15 y 29 años. Accede al chat para recibir
                  orientación profesional y emocional en tiempo real.
                </Text>
                <TouchableOpacity
                  style={styles.chatButton}
                  onPress={() => Linking.openURL('https://hablemosdetodo.injuv.gob.cl/')} // URL del chat
                >
                  <MaterialCommunityIcons name="chat" size={18} color="#FFF" />
                  <Text style={styles.chatButtonText}>Ir al chat</Text>
                </TouchableOpacity>
              </View>
            )}


            {/* Botón 4: Fono Drogas y Alcohol */}
            <SupportButton
              text="Fono drogas y alcohol"
              onPress={() => toggleSection('cuatro')}
              isExpanded={expandedSections.cuatro}
            />
            {expandedSections.cuatro && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  Servicio gratuito, anónimo y confidencial, disponible las 24 horas del día para personas
                  afectadas por el consumo de alcohol y otras drogas, así como sus familiares, amigos o
                  cercanos.
                </Text>
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => Linking.openURL('tel:1412')} // Formato limpio
                >
                  <MaterialCommunityIcons name="phone" size={18} color="#FFF" />
                  <Text style={styles.callButtonText}>Llamar al 1412</Text>
                </TouchableOpacity>

              </View>
            )}



            {/* Botón 5: Violencia contra las Mujeres */}
            <SupportButton
              text="Fono orientación y ayuda violencia contra las mujeres"
              onPress={() => toggleSection('cinco')}
              isExpanded={expandedSections.cinco}
            />
            {expandedSections.cinco && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  Apoyo a mujeres que sufren maltrato, brindando orientación sobre cómo solicitar ayuda, a quiénes
                  acudir o dónde denunciar. Funciona 24/7, es gratuito y se puede llamar incluso sin saldo en el
                  teléfono celular.
                </Text>
                <TouchableOpacity
                  style={styles.callButton}
                  // Púrpura para este servicio
                  onPress={() => Linking.openURL('tel:1455')}
                // Número limpio
                >
                  <MaterialCommunityIcons name="phone" size={18} color="#FFF" />
                  <Text style={styles.callButtonText}>Llamar al 1455</Text>
                  {/* Número visible */}
                </TouchableOpacity>

              </View>

            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    textAlign: 'justify', // Justificado
    marginBottom: 15,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50', // Fondo verde
    borderRadius: 20, // Más pequeño
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  callButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9C27B0', // Fondo púrpura (para reflejar el color de la sección)
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  chatButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },

});



export default RedesDeApoyo;
