import React, { useState } from 'react';
import { SafeAreaView, Text, ScrollView, View, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';
import SupportButton from '../../../components/buttons/SupportButton';

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

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      <View style={{ height: 260, padding: 15 }}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={GlobalStyle.welcomeText}>Espacio UV</Text>
        <Text style={[GlobalStyle.subtitleMenu, { color: '#FFFFFF' }]}>Servicios y apoyo estudiantil</Text>
        <Text style={[GlobalStyle.text, { textAlign: 'justify', color: '#FFFFFF' }]}>
          Preguntas Frecuentes TNE
        </Text>
      </View>

      <View style={[GlobalStyle.rowTwo]}>
        <ScrollView>
        <View style={{ marginTop: 15 }}>
          
          {/* Pregunta 1 */}
          <SupportButton
            style={styles.supportButton}
            text={
              <Text style={{ fontFamily: 'DoppioOne', fontSize: 16}}>
                <Text style={{ fontFamily: 'Raleway', fontSize: 20 }}>¿</Text>
                Cómo realizar el proceso de obtención de TNE como estudiante de primer año?
              </Text>
            }
            onPress={() => toggleSection('uno')}
            isExpanded={expandedSections.uno}
          />
          {expandedSections.uno && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Primero tienes que acercarte a cualquier oficina TNE para sacarte la fotografía (revisa horarios y direcciones en
                <Text style={styles.link} onPress={() => Linking.openURL('http://www.tne.cl')}>
                  {' '}www.tne.cl
                </Text>
                ). A fines de febrero la UV cancelará el valor del pase e informará tu matrícula a Junaeb. Luego llegará el pase a la Universidad entre 30 y 60 días. Te informaremos dónde y cómo retirar tu TNE en tu correo institucional.
              </Text>
            </View>
          )}

          {/* Pregunta 2 */}
          <SupportButton
            style={styles.supportButton}
            text={
              <Text style={{ fontFamily: 'DoppioOne', fontSize: 16}}>
                Si cursé estudios superiores anteriormente en otra IES,{' '}
                <Text style={{ fontFamily: 'Raleway', fontSize: 20 }}>¿</Text>
                qué debo hacer con mi TNE ?
              </Text>
            }
            onPress={() => toggleSection('dos')}
            isExpanded={expandedSections.dos}
          />
          {expandedSections.dos && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Si ya tienes la TNE, puedes utilizarla hasta el 31 de mayo de 2024. En marzo la UV cancelará el valor del pase e informará tu matrícula a Junaeb. Durante mayo vendrán revalidadores Junaeb para que puedas poner el sello 2024. Si necesitas un nuevo pase de Educación Superior, tienes que solicitarlo directamente en oficinas Junaeb.
              </Text>
            </View>
          )}

          {/* Pregunta 3 */}
          <SupportButton
            style={styles.supportButton}
            text={
              <Text style={{ fontFamily: 'DoppioOne', fontSize: 16 }}>
                <Text style={{ fontFamily: 'Raleway', fontSize: 20 }}>¿</Text>
                Dónde debo pagar por la tarjeta TNE ?
              </Text>
            }
            onPress={() => toggleSection('tres')}
            isExpanded={expandedSections.tres}
          />
          {expandedSections.tres && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                No debes cancelar nada por la TNE. La Universidad se hace cargo del valor de las tarjetas nuevas de los estudiantes de primer año y de las revalidaciones (sello 2024). Solo las reposiciones son de cargo directo de cada estudiante.
              </Text>
            </View>
          )}

          {/* Pregunta 4 */}
          <SupportButton
            style={styles.supportButton}
            text={
              <Text style={{ fontFamily: 'DoppioOne', fontSize: 16}}>
                Soy estudiante de primer año,{' '}
                <Text style={{ fontFamily: 'Raleway', fontSize: 20 }}>¿</Text>
                cómo puedo saber si soy beneficiario de la TNE ?
              </Text>
            }
            onPress={() => toggleSection('cuatro')}
            isExpanded={expandedSections.cuatro}
          />
          {expandedSections.cuatro && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Todos los estudiantes de Educación Superior tienen derecho al beneficio de rebaja en el transporte público (TNE). En el caso de nuestra Universidad, los estudiantes no cancelan nada, solo deben sacarse la fotografía y el pase llegará a la Universidad.
              </Text>
            </View>
          )}

          {/* Pregunta 5 */}
          <SupportButton
            style={styles.supportButton}
            text={
              <Text style={{ fontFamily: 'DoppioOne', fontSize: 16 }}>
                Soy estudiante de Postgrado,{' '}
                <Text style={{ fontFamily: 'Raleway', fontSize: 20 }}>¿</Text>
                cómo puedo obtener la TNE ?
              </Text>
            }
            onPress={() => toggleSection('cinco')}
            isExpanded={expandedSections.cinco}
          />
{expandedSections.cinco && (
  <View style={styles.infoBox}>
    <Text style={styles.infoText}>
      Debes comunicarte al correo:
    </Text>
    <TouchableOpacity
      style={[styles.emailButton, { marginTop: 4 }]} // Reduce el espacio entre el texto y el botón
      onPress={() => Linking.openURL('mailto:tne.postgrado@alumnos.uv.cl')}
    >
      <Icon name="email" size={20} color="white" style={{ marginRight: 8 }} />
      <Text style={styles.emailButtonText}>Enviar correo</Text>
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
    textAlign: 'justify',
    marginBottom: 15,
  },
  link: {
    color: '#1E88E5',
    textDecorationLine: 'underline',
  },
  emailButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    borderRadius: 10,
    width: '90%',
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  emailButtonText: {
    color: 'white',
    fontSize: 16,
  }
  
});

export default Tne;
