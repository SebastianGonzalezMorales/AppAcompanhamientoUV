// react imports
import {
    SafeAreaView,
    Text,
    ScrollView,
    Image,
    View,
    Dimensions
  } from 'react-native';
  
  // customisation
  import GlobalStyle from '../../../assets/styles/GlobalStyle';


  //Components
  import BackButton from '../../../components/buttons/BackButton';
  import CustomButton from '../../../components/buttons/CustomButton';
  import SettingsButton from '../../../components/buttons/SettingsButton';

  const { width, height } = Dimensions.get('window'); // Obtener las dimensiones de la pantalla
  
  function SaludMental({ navigation }) {
    return (
      <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
          <BackButton onPress={() => navigation.goBack()} />
      
              {/*
       * *********************
       * ***** Section 1 *****
       * *********************
       */}
        {/*
     
         */}
     <View style={{ height: height * 0.5, padding: 10 }}>
          <Text style={GlobalStyle.welcomeText}>Salud mental </Text>
          <Text style={GlobalStyle.subtitle}>Tests psicológicos</Text>
        <Text style={[GlobalStyle.text, { textAlign: 'justify' }]}>
         A continuación, podrás realizar diferentes tests psicológicos para conocer mejor tu bienestar emocional y recibir orientación sobre tu estado de ánimo.
        </Text>
          
                  {/* Imagen con altura ajustada */}
        <Image
          source={require('../../../assets/images/SlidesOnboarding/test.png')}
          style={{
            width: '100%',
            height: height * 0.20, // Ajustar la altura de la imagen al 20% de la pantalla
            resizeMode: 'contain', // Cambiar a 'contain' para evitar recortes
            marginTop: 11
          }}
        />
        
        </View>

        
  
        {
         }
       
             {/*
        {/*
       * *********************
       * ***** Section 2 *****
       * *********************
       */}
      <View style={GlobalStyle.rowTwo}>
        <View style={GlobalStyle.statsContainer}>
          
        </View>
        <ScrollView>
          <View style={{ marginTop: 10 }}>
            <SettingsButton
              text="Depresión"
              onPress={() => navigation.navigate('DepressionTestMain')}
            /> 
            <SettingsButton
              text="Ansiedad"
              onPress={() => navigation.navigate('AnsiedadTestMain')}
            />
            {/* <SettingsButton text="Notifications" onPress={() => navigation.navigate('Counselling')} /> */}
           {/*  <SettingsButton
              text="Privacy policy"
               onPress={() => navigation.navigate('Notification')}
            /> */}

          </View>
        </ScrollView>
      </View>
      
      </SafeAreaView>
    );
  }
  
  export default SaludMental;
  