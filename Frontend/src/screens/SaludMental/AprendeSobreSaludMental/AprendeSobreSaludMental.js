import React from 'react';
import {
  SafeAreaView,
  Text,
  ScrollView,
  View,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';
import SettingsButton from '../../../components/buttons/SettingsButton';

const { height } = Dimensions.get('window');

function AprendeSobreSaludMental({ navigation }) {
  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {/* Encabezado azul */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Salud mental</Text>
        </View>

        <Text style={[GlobalStyle.text, styles.headerDescription]}>
          Encuentra herramientas y recursos destinados a fortalecer tu salud
          mental y emocional como estudiante.
        </Text>

        <Image
          source={require('./../../../assets/images/Menu/salud_Mental.png')}
          style={styles.headerImage}
        />
      </View>

      {/* Sección blanca con scroll de botones */}
      <View style={styles.whiteSection}>
        <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }} showsVerticalScrollIndicator={true}>
          <SettingsButton
            text="Información"
            onPress={() => navigation.navigate('Informacion')}
          />
          <SettingsButton
            text="Consejos"
            onPress={() => navigation.navigate('Consejos')}
          />
          <SettingsButton
            text="Consejos de estudiantes"
            onPress={() => navigation.navigate('ConsejosDeEstudiantes')}
          />
          <SettingsButton
            text="Redes de apoyo"
            onPress={() => navigation.navigate('RedesDeApoyo')}
            backgroundColor="#FFE0B2"
            textColor="#FF762C"
            iconColor="#E65100"
          />
          <SettingsButton
            text="Contactarse con apoyo UV"
            onPress={() => navigation.navigate('ContactarseConApoyoUV')}
            backgroundColor="#fbcdd1"
            textColor="#F20C0C"
            iconColor="#c62828"
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
  headerSubtitle: {
    marginTop: 5,
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  headerDescription: {
    marginTop: 10,
    color: '#FFFFFF',
    textAlign: 'justify',
  },
  headerImage: {
    width: '80%',
    height: height * 0.12,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 15,
  },
  whiteSection: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
});

export default AprendeSobreSaludMental;
