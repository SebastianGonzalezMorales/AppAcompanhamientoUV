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
import Icon from 'react-native-vector-icons/MaterialIcons';

function Tne({ navigation }) {
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
      title: 'Cómo realizar el proceso de obtención de TNE como estudiante de primer año?',
      content: (
        <Text style={styles.infoText}>
          Primero tienes que acercarte a cualquier oficina TNE para sacarte la fotografía (revisa horarios y direcciones en
          <Text style={styles.link} onPress={() => Linking.openURL('http://www.tne.cl')}> www.tne.cl</Text>
          ). A fines de febrero la UV cancelará el valor del pase e informará tu matrícula a Junaeb. Luego llegará el pase a la Universidad entre 30 y 60 días. Te informaremos dónde y cómo retirar tu TNE en tu correo institucional.
        </Text>
      ),
    },
    {
      key: 'dos',
      title: 'Si cursé estudios superiores anteriormente en otra IES, ¿qué debo hacer con mi TNE?',
      content: (
        <Text style={styles.infoText}>
          Si ya tienes la TNE, puedes utilizarla hasta el 31 de mayo de 2024. En marzo la UV cancelará el valor del pase e informará tu matrícula a Junaeb. Durante mayo vendrán revalidadores Junaeb para que puedas poner el sello 2024. Si necesitas un nuevo pase de Educación Superior, tienes que solicitarlo directamente en oficinas Junaeb.
        </Text>
      ),
    },
    {
      key: 'tres',
      title: 'Dónde debo pagar por la tarjeta TNE?',
      content: (
        <Text style={styles.infoText}>
          No debes cancelar nada por la TNE. La Universidad se hace cargo del valor de las tarjetas nuevas de los estudiantes de primer año y de las revalidaciones (sello 2024). Solo las reposiciones son de cargo directo de cada estudiante.
        </Text>
      ),
    },
    {
      key: 'cuatro',
      title: 'Soy estudiante de primer año, ¿cómo puedo saber si soy beneficiario de la TNE?',
      content: (
        <Text style={styles.infoText}>
          Todos los estudiantes de Educación Superior tienen derecho al beneficio de rebaja en el transporte público (TNE). En el caso de nuestra Universidad, los estudiantes no cancelan nada, solo deben sacarse la fotografía y el pase llegará a la Universidad.
        </Text>
      ),
    },
    {
      key: 'cinco',
      title: 'Soy estudiante de Postgrado, ¿cómo puedo obtener la TNE?',
      content: (
        <>
          <Text style={styles.infoText}>
            Debes comunicarte al correo:
          </Text>
          <TouchableOpacity
            style={styles.emailButton}
            onPress={() => Linking.openURL('mailto:tne.postgrado@alumnos.uv.cl')}
          >
            <Icon name="email" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.emailButtonText}>Enviar correo</Text>
          </TouchableOpacity>
        </>
      ),
    },
  ];

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {/* Encabezado azul */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Preguntas Frecuentes TNE</Text>
        </View>
        <Text style={[GlobalStyle.text, styles.headerDescription]}>
          Encuentra respuestas a las dudas más frecuentes sobre la Tarjeta Nacional Estudiantil (TNE).
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
  emailButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    borderRadius: 20,
    paddingHorizontal: 15,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  emailButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Tne;
