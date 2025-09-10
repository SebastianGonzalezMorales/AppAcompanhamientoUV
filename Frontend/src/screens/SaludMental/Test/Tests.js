import React from 'react';
import {
  SafeAreaView,
  Text,
  ScrollView,
  Image,
  View,
  Dimensions,
  StyleSheet,
} from 'react-native';
import GlobalStyle from '../../../assets/styles/GlobalStyle';
import BackButton from '../../../components/buttons/BackButton';
import SettingsButton from '../../../components/buttons/SettingsButton';

const { height } = Dimensions.get('window');

function SaludMental({ navigation }) {
  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      
      {/* Encabezado azul */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Test psicológicos</Text>
        </View>

        <Text style={[GlobalStyle.text, styles.headerDescription]}>
          A continuación, podrás realizar diferentes tests psicológicos para conocer mejor tu bienestar emocional y recibir orientación sobre tu estado de ánimo.
        </Text>

        <Image
          source={require('../../../assets/images/SlidesOnboarding/test.png')}
          style={styles.headerImage}
        />
      </View>

      {/* Sección blanca con scroll de botones */}
      <View style={styles.whiteSection}>
        <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }} showsVerticalScrollIndicator={true}>
          <SettingsButton
            text="Depresión"
            onPress={() => navigation.navigate('DepressionTestMain')}
          />

          {/* Mensaje debajo del único test visible */}
          <Text
            style={[
              GlobalStyle.text,
              {
                textAlign: 'center',
                marginTop: 20,
                fontStyle: 'italic',
                color: '#333',
              },
            ]}
          >
            Estamos trabajando en nuevos test psicológicos. Agradecemos su paciencia...
          </Text>
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
  headerImage: {
    width: '80%',
    height: height * 0.2,
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

export default SaludMental;
