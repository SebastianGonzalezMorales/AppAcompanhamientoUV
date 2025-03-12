import React, { useState } from 'react';
import { SafeAreaView, Text, ScrollView, View } from 'react-native';
import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';
import SettingsButton from '../../../components/buttons/SettingsButton';

function Informacion({ navigation }) {
  // Estado para controlar qué secciones están desplegadas
  const [expandedSections, setExpandedSections] = useState({
    counseling: false,
    peerSupport: false,
    communityResources: false,
  });

  // Función para alternar el estado de cada sección
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
        <Text style={[GlobalStyle.subtitleMenu, { color: '#FFFFFF' }]}>Información</Text>
        <Text style={[GlobalStyle.text,{ textAlign:'justify' }]}>
        A continuación, encuentra información sobre salud mental para estudiantes universitarios. Las imágenes provienen del grupo Conectados de la DAE.
        </Text>
      </View>

      {/* Contenedor para las secciones */}
  {/* Contenedor para las secciones */}
<View style={GlobalStyle.rowTwo}>
  <ScrollView>
    {/* Botón para Salud Mental */}
    <SettingsButton
      text="Salud mental"
      onPress={() => navigation.navigate('InfoSaludMental')}
    />

    {/* Botón para Ansiedad */}
    <SettingsButton
      text="Ansiedad"
      onPress={() => navigation.navigate('Ansiedad')}
    />

    {/* Botón para Depresión */}
    <SettingsButton
      text="Depresión"
      onPress={() => navigation.navigate('Depresion')}
    />

    {/* Botón para Burnout académico */}
    <SettingsButton
      text="Burnout académico"
      onPress={() => navigation.navigate('Burnout')}
    />

    {/* Botón para Cómo enfrentar una evaluación */}
    <SettingsButton
      text="Cómo enfrentar una evaluación ?"
      onPress={() => navigation.navigate('Evaluacion')}
    />

    {/* Botón para Qué es una crisis */}
    <SettingsButton
      text="Qué es una crisis ?"
      onPress={() => navigation.navigate('Crisis')}
    />

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default Informacion;
