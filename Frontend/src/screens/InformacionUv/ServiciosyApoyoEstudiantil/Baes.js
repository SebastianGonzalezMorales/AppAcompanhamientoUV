import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Linking,
} from 'react-native';
import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function Baes({ navigation }) {
  const [expandedSections, setExpandedSections] = useState({
    uno: false,
    dos: false,
    tres: false,
    cuatro: false,
    cinco: false,
    seis: false,
    siete: false,
    ocho: false,
    nueve: false,
    diez: false,
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
      title: 'Soy preseleccionado de gratuidad, ¿cuándo podré usar mi beca BAES?',
      content: (
        <Text style={styles.infoText}>
          Una vez que el Mineduc te asigne definitivamente la gratuidad, Junaeb te informará a tu
          correo que fuiste beneficiado con la BAES y te indicará cómo usarla y desde cuándo. Por lo
          general, durante el mes de marzo (para primer año).
        </Text>
      ),
    },
    {
      key: 'dos',
      title: 'Tengo beca de Presidente de la República, ¿puedo tener beca BAES?',
      content: (
        <Text style={styles.infoText}>
          La BAES la asigna Junaeb a los estudiantes que son beneficiados con un beneficio de arancel
          (Gratuidad, Becas de Arancel o Créditos). La beca Presidente de la República no incluye la
          BAES.
        </Text>
      ),
    },
    {
      key: 'tres',
      title: 'Yo almorzaba en el colegio por el programa de alimentación escolar, ¿puedo obtener la beca?',
      content: (
        <Text style={styles.infoText}>
          La BAES la asigna Junaeb a los estudiantes que son beneficiados con un beneficio de arancel
          (Gratuidad, Becas de Arancel o Créditos). El programa de alimentación escolar no tiene
          continuidad en Educación Superior.
        </Text>
      ),
    },
    {
      key: 'cuatro',
      title: 'Si salí preseleccionado para CAE y Fondo Solidario, ¿puedo tener beca BAES?',
      content: (
        <Text style={styles.infoText}>
          Sí, Junaeb te puede asignar la BAES siempre que tenga disponibilidad presupuestaria. Primero
          se asigna a estudiantes con Gratuidad y luego a los con Becas de Arancel o Fondo Solidario.
        </Text>
      ),
    },
    {
      key: 'cinco',
      title: 'Soy del 40% más vulnerable según el RSH, ¿por qué no me dieron la beca BAES?',
      content: (
        <Text style={styles.infoText}>
          La BAES se asigna cuando el Mineduc otorga beneficios de arancel como Gratuidad o Becas. Si
          no recibiste la BAES, revisa la disponibilidad presupuestaria asignada.
        </Text>
      ),
    },
    {
      key: 'seis',
      title: 'Tenía beca SODEXO en otra institución, ¿cómo realizo el proceso para la tarjeta BAES?',
      content: (
        <Text style={styles.infoText}>
          A comienzos de marzo, entrega tu certificado de alumno regular UV 2024 a la secretaría de
          la asistente social para solicitar la reactivación de tu BAES.
        </Text>
      ),
    },
    {
      key: 'siete',
      title: '¿Cuándo será la primera carga de BAES?',
      content: (
        <Text style={styles.infoText}>
          Para estudiantes de primer año será durante el mes de marzo. Para cursos superiores será el
          1 de abril (retroactivo para marzo y abril).
        </Text>
      ),
    },
    {
      key: 'ocho',
      title: '¿Cuántos meses dura la BAES?',
      content: (
        <Text style={styles.infoText}>
          De marzo a diciembre de cada año, siempre y cuando mantengan la calidad de alumno regular.
        </Text>
      ),
    },
    {
      key: 'nueve',
      title: '¿Cómo renuevo mi beca Presidente de la República?',
      content: (
        <Text style={styles.infoText}>
          Debes realizar la renovación online en{' '}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL('https://portalbecas.junaeb.cl/')}
          >
            portalbecas.junaeb.cl
          </Text>{' '}
          antes del 19 de enero.
        </Text>
      ),
    },
    {
      key: 'diez',
      title: 'Tenía Beca Indígena en la enseñanza media, ¿cómo renuevo el beneficio?',
      content: (
        <Text style={styles.infoText}>
          La Beca Indígena no se renueva automáticamente al pasar a Educación Superior. Debes
          postular nuevamente en{' '}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL('https://portalbecas.junaeb.cl/')}
          >
            portalbecas.junaeb.cl
          </Text>
          .
        </Text>
      ),
    },
  ];

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {/* Encabezado azul */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Preguntas Frecuentes BAES</Text>
        </View>
        <Text style={[GlobalStyle.text, styles.headerDescription]}>
          Encuentra respuestas a las dudas más frecuentes sobre la Beca de Alimentación Escolar Superior (BAES).
        </Text>
      </View>

      {/* Sección blanca con scroll */}
      <View style={styles.whiteSection}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {sections.map((section) => (
            <View
              key={section.key}
              style={[
                styles.accordionContainer,
                expandedSections[section.key] && styles.accordionExpanded,
              ]}
            >
              <TouchableOpacity
                onPress={() => toggleSection(section.key)}
                style={styles.accordionButton}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>{section.title}</Text>
                <Animated.View
                  style={{
                    transform: [
                      { rotate: expandedSections[section.key] ? '90deg' : '0deg' },
                    ],
                  }}
                >
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color="#333"
                  />
                </Animated.View>
              </TouchableOpacity>
              {expandedSections[section.key] && (
                <View style={styles.expandedContent}>{section.content}</View>
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
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    textAlign: 'justify',
    marginBottom: 10,
  },
  link: {
    color: '#1E88E5',
    textDecorationLine: 'underline',
  },
});

export default Baes;
