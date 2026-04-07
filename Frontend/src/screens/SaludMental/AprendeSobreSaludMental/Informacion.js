import React from 'react';
import { SafeAreaView, Text, ScrollView, View, StyleSheet, Dimensions } from 'react-native';
import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';
import SettingsButton from '../../../components/buttons/SettingsButton';

const { height } = Dimensions.get('window');

function Informacion({ navigation }) {
  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={GlobalStyle.welcomeText}>Aprende sobre salud mental</Text>
          <Text style={[GlobalStyle.subtitleMenu, styles.heroSubtitle]}>Información</Text>
          <Text style={[GlobalStyle.text, styles.heroText]}>
            A continuación, encuentra información sobre salud mental para
            estudiantes universitarios. Las imágenes provienen del grupo
            Conectados de la DAE.
          </Text>
        </View>

        <View style={styles.contentCard}>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Informacion;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    minHeight: Math.min(height * 0.28, 260),
    padding: 15,
    paddingBottom: 12,
  },
  heroSubtitle: {
    color: '#FFFFFF',
  },
  heroText: {
    textAlign: 'justify',
    lineHeight: 24,
  },
  contentCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingTop: 14,
    paddingBottom: 24,
    flexGrow: 1,
  },
});
