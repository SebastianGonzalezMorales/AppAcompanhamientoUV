import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Animated,
} from 'react-native';
import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function AreaDeAtencionArancelaria({ navigation }) {
  const [expandedSections, setExpandedSections] = useState({
    arancel: false,
    beneficios: false,
    cae: false,
    pagares: false,
    cobranzas: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const sections = [
    {
      key: 'arancel',
      title: 'Arancel',
      content: (
        <>
          <Text style={styles.infoText}>
            Timbre de fusas, repactaciones, solicitud de certificados, saldos de arancel, problemas emisión de boletas, ajustes de cuentas, devoluciones, solicitudes de descuento por pronto pago.
          </Text>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => Linking.openURL('tel:997430082')}
          >
            <MaterialCommunityIcons name="phone" size={18} color="#FFF" />
            <Text style={styles.callButtonText}>Llamar a N.°1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => Linking.openURL('tel:968316653')}
          >
            <MaterialCommunityIcons name="phone" size={18} color="#FFF" />
            <Text style={styles.callButtonText}>Llamar a N.°2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.emailButton}
            onPress={() => Linking.openURL('mailto:unidad.aranceles@uv.cl')}
          >
            <MaterialCommunityIcons name="email" size={20} color="#FFF" />
            <Text style={styles.emailButtonText}>Enviar correo</Text>
          </TouchableOpacity>
        </>
      ),
    },
    {
      key: 'beneficios',
      title: 'Beneficios estudiantiles',
      content: (
        <>
          <Text style={styles.infoText}>
            Asuntos de beneficios, gratuidad, becas, FSCU, renuncias y suspensión de beneficios ante Mineduc.
          </Text>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => Linking.openURL('tel:971383317')}
          >
            <MaterialCommunityIcons name="phone" size={18} color="#FFF" />
            <Text style={styles.callButtonText}>Llamar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.emailButton}
            onPress={() => Linking.openURL('mailto:gestion.beneficios@uv.cl')}
          >
            <MaterialCommunityIcons name="email" size={20} color="#FFF" />
            <Text style={styles.emailButtonText}>Enviar correo</Text>
          </TouchableOpacity>
        </>
      ),
    },
    {
      key: 'cae',
      title: 'Crédito con aval del estado (CAE)',
      content: (
        <>
          <Text style={styles.infoText}>
            Asuntos de CAE, renuncias, suspensión, firmas de pagaré CAE, revisión de montos asignados.
          </Text>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => Linking.openURL('tel:971383317')}
          >
            <MaterialCommunityIcons name="phone" size={18} color="#FFF" />
            <Text style={styles.callButtonText}>Llamar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.emailButton}
            onPress={() => Linking.openURL('mailto:gestion.cae@uv.cl')}
          >
            <MaterialCommunityIcons name="email" size={20} color="#FFF" />
            <Text style={styles.emailButtonText}>Enviar correo</Text>
          </TouchableOpacity>
        </>
      ),
    },
    {
      key: 'pagares',
      title: 'Pagarés',
      content: (
        <>
          <Text style={styles.infoText}>
            Atención de recepción de pagaré y convenio.
          </Text>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => Linking.openURL('tel:997321722')}
          >
            <MaterialCommunityIcons name="phone" size={18} color="#FFF" />
            <Text style={styles.callButtonText}>Llamar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.emailButton}
            onPress={() => Linking.openURL('mailto:pagares@uv.cl')}
          >
            <MaterialCommunityIcons name="email" size={20} color="#FFF" />
            <Text style={styles.emailButtonText}>Enviar correo</Text>
          </TouchableOpacity>
        </>
      ),
    },
    {
      key: 'cobranzas',
      title: 'Cobranzas',
      content: (
        <>
          <Text style={styles.infoText}>
            Atención de deudas morosas de cheques, letras, CUV y arancel 2020 hacia atrás.
          </Text>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => Linking.openURL('tel:968310393')}
          >
            <MaterialCommunityIcons name="phone" size={18} color="#FFF" />
            <Text style={styles.callButtonText}>Llamar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.emailButton}
            onPress={() => Linking.openURL('mailto:cobranzas@uv.cl')}
          >
            <MaterialCommunityIcons name="email" size={20} color="#FFF" />
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
          <Text style={styles.headerTitle}>Unidad de atención arancelaria</Text>
        </View>
        <Text style={[GlobalStyle.text, styles.headerDescription]}>
          Accede a servicios y apoyo estudiantil desde el área de atención arancelaria.
        </Text>
      </View>

      {/* Sección blanca */}
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
  <View style={styles.expandedContent}>
    {section.content.map ? section.content.map((c, i) => <React.Fragment key={i}>{c}</React.Fragment>) : section.content}
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
  alignItems: 'center', // <--- Esto centra los botones horizontalmente
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
  justifyContent: 'center', // <--- Asegura que el contenido del botón también esté centrado
  backgroundColor: '#4CAF50',
  borderRadius: 20,
  paddingVertical: 10,
  paddingHorizontal: 20,
  marginVertical: 5,
  minWidth: '70%', // Opcional: da un ancho mínimo uniforme
},
  callButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emailButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center', // <--- Centra contenido del botón
  backgroundColor: '#2196F3',
  borderRadius: 20,
  paddingVertical: 10,
  paddingHorizontal: 20,
  marginVertical: 5,
  minWidth: '70%', // Opcional: ancho mínimo
},
  emailButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default AreaDeAtencionArancelaria;
