import React from 'react';
import {
  SafeAreaView,
  Text,
  ScrollView,
  View,
  StyleSheet,
} from 'react-native';
import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';
import SettingsButton from '../../../components/buttons/SettingsButton';

function Informacion({ navigation }) {
  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {/* Encabezado azul */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>
            Información sobre salud mental
          </Text>
        </View>

        <Text style={[GlobalStyle.text, styles.headerDescription]}>
          A continuación, encuentra información sobre salud mental para
          estudiantes universitarios. Las imágenes provienen del grupo
          Conectados de la DAE.
        </Text>
      </View>

      {/* Sección blanca con scroll de botones */}
      <View style={styles.whiteSection}>
        <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={true}>
          <SettingsButton
            text="Salud mental"
            onPress={() => navigation.navigate('InfoSaludMental')}
          />

          <SettingsButton
            text="Ansiedad"
            onPress={() => navigation.navigate('Ansiedad')}
          />

          <SettingsButton
            text="Depresión"
            onPress={() => navigation.navigate('Depresion')}
          />

          <SettingsButton
            text="Burnout académico"
            onPress={() => navigation.navigate('Burnout')}
          />

          <SettingsButton
            text="Cómo enfrentar una evaluación ?"
            onPress={() => navigation.navigate('Evaluacion')}
          />

          <SettingsButton
            text="Qué es una crisis ?"
            onPress={() => navigation.navigate('Crisis')}
          />
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
  },
});

export default Informacion;
