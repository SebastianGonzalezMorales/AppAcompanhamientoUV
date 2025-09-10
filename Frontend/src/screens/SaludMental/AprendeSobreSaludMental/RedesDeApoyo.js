import React, { useState } from 'react';
import { SafeAreaView, Text, ScrollView, View, StyleSheet, TouchableOpacity, Linking, Animated } from 'react-native';
import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';
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

  const sections = [
    {
      key: 'uno',
      title: 'Fono prevención del suicidio - MINSAL',
      content: (
        <>
          <Text style={styles.infoText}>
            Si estás enfrentando una situación de crisis o necesitas orientación inmediata para prevenir el suicidio, puedes comunicarte con un profesional capacitado. Este servicio es gratuito y está disponible las 24 horas, todos los días.
          </Text>
          <TouchableOpacity style={styles.callButton} onPress={() => Linking.openURL('tel:*4141')}>
            <MaterialCommunityIcons name="phone" size={18} color="#FFF" />
            <Text style={styles.callButtonText}>Llamar al *4141</Text>
          </TouchableOpacity>
        </>
      )
    },
    {
      key: 'dos',
      title: 'Salud responde - MINSAL',
      content: (
        <>
          <Text style={styles.infoText}>
            Este servicio responde a las necesidades de información de la población en múltiples materias asociadas a la salud. Específicamente para salud mental, cuenta con psicólogos que ofrecen orientación profesional y ayuda en situaciones de crisis.
          </Text>
          <Text style={styles.infoText}>Horario de atención: lunes a viernes, de 08:30 a 20:30 horas.</Text>
          <TouchableOpacity style={styles.callButton} onPress={() => Linking.openURL('tel:6003607777')}>
            <MaterialCommunityIcons name="phone" size={18} color="#FFF" />
            <Text style={styles.callButtonText}>Llamar al 600 360 7777</Text>
          </TouchableOpacity>
        </>
      )
    },
    {
      key: 'tres',
      title: 'Hablemos de todo - INJUV',
      content: (
        <>
          <Text style={styles.infoText}>
            Chat de apoyo psicológico dirigido a jóvenes entre 15 y 29 años. Accede al chat para recibir orientación profesional y emocional en tiempo real.
          </Text>
          <TouchableOpacity style={styles.chatButton} onPress={() => Linking.openURL('https://hablemosdetodo.injuv.gob.cl/')}>
            <MaterialCommunityIcons name="chat" size={18} color="#FFF" />
            <Text style={styles.chatButtonText}>Ir al chat</Text>
          </TouchableOpacity>
        </>
      )
    },
    {
      key: 'cuatro',
      title: 'Fono drogas y alcohol',
      content: (
        <>
          <Text style={styles.infoText}>
            Servicio gratuito, anónimo y confidencial, disponible las 24 horas del día para personas afectadas por el consumo de alcohol y otras drogas, así como sus familiares, amigos o cercanos.
          </Text>
          <TouchableOpacity style={styles.callButton} onPress={() => Linking.openURL('tel:1412')}>
            <MaterialCommunityIcons name="phone" size={18} color="#FFF" />
            <Text style={styles.callButtonText}>Llamar al 1412</Text>
          </TouchableOpacity>
        </>
      )
    },
    {
      key: 'cinco',
      title: 'Fono orientación y ayuda violencia contra las mujeres',
      content: (
        <>
          <Text style={styles.infoText}>
            Apoyo a mujeres que sufren maltrato, brindando orientación sobre cómo solicitar ayuda, a quiénes acudir o dónde denunciar. Funciona 24/7, es gratuito y se puede llamar incluso sin saldo en el teléfono celular.
          </Text>
          <TouchableOpacity style={styles.callButton} onPress={() => Linking.openURL('tel:1455')}>
            <MaterialCommunityIcons name="phone" size={18} color="#FFF" />
            <Text style={styles.callButtonText}>Llamar al 1455</Text>
          </TouchableOpacity>
        </>
      )
    },
  ];

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {/* Encabezado azul */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Redes de apoyo</Text>
        </View>
        <Text style={[GlobalStyle.text, styles.headerDescription]}>
          Conecta con los recursos y contactos disponibles para apoyarte en momentos difíciles.
        </Text>
      </View>

      {/* Sección blanca con scroll */}
      <View style={styles.whiteSection}>
        <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={true}>
          {sections.map((section) => (
            <View
              key={section.key}
              style={[styles.accordionContainer, expandedSections[section.key] && styles.accordionExpanded]}
            >
              <TouchableOpacity
                onPress={() => toggleSection(section.key)}
                style={styles.accordionButton}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>{section.title}</Text>
                <Animated.View style={{ transform: [{ rotate: expandedSections[section.key] ? '90deg' : '0deg' }] }}>
                  <MaterialCommunityIcons name="chevron-right" size={24} color="#333" />
                </Animated.View>
              </TouchableOpacity>
              {expandedSections[section.key] && (
                <View style={styles.expandedContent}>
                  {section.content}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
    backgroundColor: '#000C7B',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    marginLeft: 12,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  headerDescription: {
    marginTop: 10,
    color: '#FFFFFF',
    textAlign: 'justify',
  },
  whiteSection: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    paddingBottom: 20,
  },
  accordionContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    marginTop: 10,
    overflow: 'hidden',
    alignItems: 'center',
  },
  accordionExpanded: {
    backgroundColor: '#E3F2FD',
  },
  accordionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  expandedContent: {
    width: '100%',
    paddingHorizontal: 15,
    paddingBottom: 15,
    alignItems: 'center', // Centra los botones
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    textAlign: 'justify',
    marginBottom: 10,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: 5,
    alignSelf: 'center', // centra el botón
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
    backgroundColor: '#9C27B0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: 5,
    alignSelf: 'center', // centra el botón
  },
  chatButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default RedesDeApoyo;
