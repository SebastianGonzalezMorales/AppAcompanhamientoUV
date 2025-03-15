import React, { useState } from 'react';
import { SafeAreaView, Text, ScrollView, View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';
import SupportButton from '../../../components/buttons/SupportButton';
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
  
  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {/* Encabezado */}
      <View style={{ height: 260, padding: 15 }}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={GlobalStyle.welcomeText}>Espacio UV</Text>
        <Text style={[GlobalStyle.subtitleMenu, { color: '#FFFFFF' }]}>Accede a servicios y apoyo estudiantil</Text>
        <Text style={[GlobalStyle.text, { textAlign: 'justify', color: '#FFFFFF' }]}>
          Unidad de atención arancelaria
        </Text>
      </View>

      {/* Contenido principal */}
      <View style={GlobalStyle.rowTwo}>
        <ScrollView>

          {/* Botón 1: Arancel */}
          <SupportButton
            text="Arancel"
            onPress={() => toggleSection('arancel')}
            isExpanded={expandedSections.arancel}
          />
          {expandedSections.arancel && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Timbre de fusas, repactaciones, solicitud de certificados, saldos de arancel, 
                problemas emisión de boletas, ajustes de cuentas, devoluciones, solicitudes 
                de descuento por pronto pago.
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
            </View>
          )}

          {/* Botón 2: Beneficios estudiantiles */}
          <SupportButton
            text="Beneficios estudiantiles"
            onPress={() => toggleSection('beneficios')}
            isExpanded={expandedSections.beneficios}
          />
          {expandedSections.beneficios && (
            <View style={styles.infoBox}>
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
            </View>
          )}

          {/* Botón 3: CAE */}
          <SupportButton
            text="Crédito con aval del estado (CAE)"
            onPress={() => toggleSection('cae')}
            isExpanded={expandedSections.cae}
          />
          {expandedSections.cae && (
            <View style={styles.infoBox}>
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
            </View>
          )}

          {/* Botón 4: Pagarés */}
          <SupportButton
            text="Pagarés"
            onPress={() => toggleSection('pagares')}
            isExpanded={expandedSections.pagares}
          />
          {expandedSections.pagares && (
            <View style={styles.infoBox}>
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
            </View>
          )}

          {/* Botón 5: Cobranzas */}
          <SupportButton
            text="Cobranzas"
            onPress={() => toggleSection('cobranzas')}
            isExpanded={expandedSections.cobranzas}
          />
          {expandedSections.cobranzas && (
            <View style={styles.infoBox}>
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
            </View>
          )}

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
    textAlign: 'justify',
    marginBottom: 15,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginVertical: 5,
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
    backgroundColor: '#2196F3',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
  },
  emailButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default AreaDeAtencionArancelaria;
