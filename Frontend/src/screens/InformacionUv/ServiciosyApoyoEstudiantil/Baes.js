import React, { useState } from 'react';
import { SafeAreaView, Text, ScrollView, View, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';
import SupportButton from '../../../components/buttons/SupportButton';

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

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      <View style={{ height: 260, padding: 15 }}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={GlobalStyle.welcomeText}>Espacio UV</Text>
        <Text style={[GlobalStyle.subtitleMenu, { color: '#FFFFFF' }]}>Servicios y apoyo estudiantil</Text>
        <Text style={[GlobalStyle.text, { textAlign: 'justify', color: '#FFFFFF' }]}>
          Preguntas Frecuentes BAES
        </Text>
      </View>

      <View style={[GlobalStyle.rowTwo]}>
        <ScrollView>
          <View style={{ marginTop: 15 }}>
            {/* Pregunta 1 */}
            <SupportButton
              text={
                <Text style={{ fontFamily: 'DoppioOne', fontSize: 16 }}>
                  <Text style={{ fontFamily: 'Raleway', fontSize: 20 }}>¿</Text>
                  Soy preseleccionado de gratuidad, cuándo podré usar mi beca BAES ?
                </Text>
              }
              onPress={() => toggleSection('uno')}
              isExpanded={expandedSections.uno}
            />
            {expandedSections.uno && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  Una vez que el Mineduc te asigne definitivamente la gratuidad, Junaeb te informará a tu
                  correo que fuiste beneficiado con la BAES y te indicará cómo usarla y desde cuándo. Por lo
                  general, durante el mes de marzo (para primer año).
                </Text>
              </View>
            )}

            {/* Pregunta 2 */}
            <SupportButton
              text={
                <Text style={{ fontFamily: 'DoppioOne', fontSize: 16 }}>
                  <Text style={{ fontFamily: 'Raleway', fontSize: 20 }}>¿</Text>
                  Tengo beca de Presidente de la República, puedo tener beca BAES ?
                </Text>
              }
              onPress={() => toggleSection('dos')}
              isExpanded={expandedSections.dos}
            />
            {expandedSections.dos && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  La BAES la asigna Junaeb a los estudiantes que son beneficiados con un beneficio de arancel
                  (Gratuidad, Becas de Arancel o Créditos). La beca Presidente de la República no incluye la
                  BAES.
                </Text>
              </View>
            )}

            {/* Pregunta 3 */}
            <SupportButton
              text={
                <Text style={{ fontFamily: 'DoppioOne', fontSize: 16 }}>
                  <Text style={{ fontFamily: 'Raleway', fontSize: 20 }}>¿</Text>
                  Yo almorzaba en el colegio por el programa de alimentación escolar, puedo obtener la beca ?
                </Text>
              }
              onPress={() => toggleSection('tres')}
              isExpanded={expandedSections.tres}
            />
            {expandedSections.tres && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  La BAES la asigna Junaeb a los estudiantes que son beneficiados con un beneficio de arancel
                  (Gratuidad, Becas de Arancel o Créditos). El programa de alimentación escolar no tiene
                  continuidad en Educación Superior.
                </Text>
              </View>
            )}

            {/* Pregunta 4 */}
            <SupportButton
              text={
                <Text style={{ fontFamily: 'DoppioOne', fontSize: 16 }}>
                  <Text style={{ fontFamily: 'Raleway', fontSize: 20 }}>¿</Text>
                  Si salí preseleccionado para CAE y Fondo Solidario, puedo tener beca BAES ?
                </Text>
              }
              onPress={() => toggleSection('cuatro')}
              isExpanded={expandedSections.cuatro}
            />
            {expandedSections.cuatro && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  Sí, Junaeb te puede asignar la BAES siempre que tenga disponibilidad presupuestaria. Primero
                  se asigna a estudiantes con Gratuidad y luego a los con Becas de Arancel o Fondo Solidario.
                </Text>
              </View>
            )}

            {/* Pregunta 5 */}
            <SupportButton
              text={
                <Text style={{ fontFamily: 'DoppioOne', fontSize: 16 }}>
                  <Text style={{ fontFamily: 'Raleway', fontSize: 20 }}>¿</Text>
                  Soy del 40% más vulnerable según el RSH, por qué no me dieron la beca BAES ?
                </Text>
              }
              onPress={() => toggleSection('cinco')}
              isExpanded={expandedSections.cinco}
            />
            {expandedSections.cinco && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  La BAES se asigna cuando el Mineduc otorga beneficios de arancel como Gratuidad o Becas. Si
                  no recibiste la BAES, revisa la disponibilidad presupuestaria asignada.
                </Text>
              </View>
            )}

            {/* Pregunta 6 */}
            <SupportButton
              text={
                <Text style={{ fontFamily: 'DoppioOne', fontSize: 16 }}>
                  <Text style={{ fontFamily: 'Raleway', fontSize: 20 }}>¿</Text>
                  Tenía beca SODEXO en otra institución, cómo realizo el proceso para la tarjeta BAES ?
                </Text>
              }
              onPress={() => toggleSection('seis')}
              isExpanded={expandedSections.seis}
            />
            {expandedSections.seis && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  A comienzos de marzo, entrega tu certificado de alumno regular UV 2024 a la secretaría de
                  la asistente social para solicitar la reactivación de tu BAES.
                </Text>
              </View>
            )}

            {/* Pregunta 7 */}
            <SupportButton
              text={
                <Text style={{ fontFamily: 'DoppioOne', fontSize: 16 }}>
                  <Text style={{ fontFamily: 'Raleway', fontSize: 20 }}>¿</Text>
                  Cuándo será la primera carga de BAES ?
                </Text>
              }
              onPress={() => toggleSection('siete')}
              isExpanded={expandedSections.siete}
            />
            {expandedSections.siete && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  Para estudiantes de primer año será durante el mes de marzo. Para cursos superiores será el
                  1 de abril (retroactivo para marzo y abril).
                </Text>
              </View>
            )}

            {/* Pregunta 8 */}
            <SupportButton
              text={
                <Text style={{ fontFamily: 'DoppioOne', fontSize: 16 }}>
                  <Text style={{ fontFamily: 'Raleway', fontSize: 20 }}>¿</Text>
                  Cuántos meses dura la BAES ?
                </Text>
              }
              onPress={() => toggleSection('ocho')}
              isExpanded={expandedSections.ocho}
            />
            {expandedSections.ocho && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  De marzo a diciembre de cada año, siempre y cuando mantengan la calidad de alumno regular.
                </Text>
              </View>
            )}

            {/* Pregunta 9 */}
            <SupportButton
              text={
                <Text style={{ fontFamily: 'DoppioOne', fontSize: 16 }}>
                  <Text style={{ fontFamily: 'Raleway', fontSize: 20 }}>¿</Text>
                  Cómo renuevo mi beca Presidente de la República ?
                </Text>
              }
              onPress={() => toggleSection('nueve')}
              isExpanded={expandedSections.nueve}
            />
            {expandedSections.nueve && (
              <View style={styles.infoBox}>
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
              </View>
            )}

            {/* Pregunta 10 */}
            <SupportButton
              text={
                <Text style={{ fontFamily: 'DoppioOne', fontSize: 16 }}>
                  <Text style={{ fontFamily: 'Raleway', fontSize: 20 }}>¿</Text>
                  Tenía Beca Indígena en la enseñanza media, cómo renuevo el beneficio ?
                </Text>
              }
              onPress={() => toggleSection('diez')}
              isExpanded={expandedSections.diez}
            />
            {expandedSections.diez && (
              <View style={styles.infoBox}>
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
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    textAlign: 'justify',
  },
  link: {
    color: '#1E88E5',
    textDecorationLine: 'underline',
  },
});

export default Baes;
