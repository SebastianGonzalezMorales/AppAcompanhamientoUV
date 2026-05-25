import React, { useContext, useState, useEffect, useRef } from 'react';
import { ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';

// Importa el AuthContext
import { AuthContext } from '../context/AuthContext';

// Importa tus pantallas de autenticación
import Onboarding from '../screens/onboarding/Onboarding';
import Policy from '../screens/policy/Policy';
import Login from '../screens/authentication/Login';
import Register from '../screens/authentication/Register';
import ForgotPassword from '../screens/authentication/ForgotPassword';
import ChangePassword from '../screens/authentication/ChangePassword';

// Importa el HomeTabs
import HomeTabs from './HomeTabs';

// Importa otras pantallas que no están en los tabs
import Tests from '../screens/SaludMental/Test/Tests';
import DepressionTestForm from '../screens/SaludMental/Test/Depresion/DepressionTestForm';
import AnsiedadTestMain from '../screens/SaludMental/Test/Ansiedad/AnsiedadTestMain';
import DepressionTestMain from '../screens/SaludMental/Test/Depresion/DepressionTestMain';
import TestDepresionHistorial from '../screens/SaludMental/Test/Depresion/TestDepresionHistorial';
import TestAnsiedadHistorial from '../screens/SaludMental/Test/Ansiedad/TestAnsiedadHistorial';
import TestAnsiedadEstadisticas from '../screens/SaludMental/Test/Ansiedad/TestAnsiedadEstadisticas';
import TestDepresionEstadisticas from '../screens/SaludMental/Test/Depresion/TestDepresionEstadisticas';
import ResultView from '../screens/SaludMental/Test/Depresion/ResultView';
import MoodTrack from '../screens/Home/Moods/MoodTrack';
import MoodStats from '../screens/Home/Moods/MoodStats';
import MoodHistory from '../screens/Home/Moods/MoodHistory';
import MoodDetails from '../screens/Home/Moods/MoodDetails';
import Informacion from '../screens/SaludMental/AprendeSobreSaludMental/Informacion';
import Burnout from '../screens/SaludMental/AprendeSobreSaludMental/Informacion/Burnout';
import Ansiedad from '../screens/SaludMental/AprendeSobreSaludMental/Informacion/Ansiedad';
import Depresion from '../screens/SaludMental/AprendeSobreSaludMental/Informacion/Depresion';
import Crisis from '../screens/SaludMental/AprendeSobreSaludMental/Informacion/Crisis';
import InfoSaludMental from '../screens/SaludMental/AprendeSobreSaludMental/Informacion/InfoSaludMental';
import Evaluacion from '../screens/SaludMental/AprendeSobreSaludMental/Informacion/Evaluacion';
import AprendeSobreSaludMental from '../screens/SaludMental/AprendeSobreSaludMental/AprendeSobreSaludMental';
import Consejos from '../screens/SaludMental/AprendeSobreSaludMental/Consejos';
import ConsejosDeEstudiantes from '../screens/SaludMental/AprendeSobreSaludMental/ConsejosDeEstudiantes';
import RedesDeApoyo from '../screens/SaludMental/AprendeSobreSaludMental/RedesDeApoyo';
import RedesSociales from '../screens/InformacionUv/Novedades/RedesSociales';
import InformacionUv from '../screens/InformacionUv/ServiciosyApoyoEstudiantil/InformacionUv';
import ContactarseConApoyoUV from '../screens/InformacionUv/ContactarseConApoyoUv/ContactarseConApoyoUv';
import AsistenteSocial from '../screens/InformacionUv/ContactarseConApoyoUv/AsistenteSocial';
import Conectados from '../screens/InformacionUv/ContactarseConApoyoUv/Conectados';
import AppaUv from '../screens/InformacionUv/ServiciosyApoyoEstudiantil/AppaUv';
import DaeUv from '../screens/InformacionUv/ServiciosyApoyoEstudiantil/DaeUv';
import ConectadosUv from '../screens/InformacionUv/ServiciosyApoyoEstudiantil/ConectadosUv';
import UvInclusiva from '../screens/InformacionUv/ServiciosyApoyoEstudiantil/UvInclusiva';
import UnidadDeSalud from '../screens/InformacionUv/ServiciosyApoyoEstudiantil/UnidadDeSalud';
import UnidadPrimeraInfancia from '../screens/InformacionUv/ServiciosyApoyoEstudiantil/UnidadPrimeraInfancia';
import AreaDeporteyRecreacion from '../screens/InformacionUv/ServiciosyApoyoEstudiantil/AreaDeporteyRecreacion';
import Tne from '../screens/InformacionUv/ServiciosyApoyoEstudiantil/Tne';
import Baes from '../screens/InformacionUv/ServiciosyApoyoEstudiantil/Baes';
import AreaDeAtencionArancelaria from '../screens/InformacionUv/ServiciosyApoyoEstudiantil/AreaDeAtencionArancelaria';
import NotificationPreferences from '../screens/UserProfile/NotificationPreferences';

const Stack = createNativeStackNavigator();
const navigationRef = createNavigationContainerRef();

const getNotificationData = (response) =>
  response?.notification?.request?.content?.data || {};

const isDailyPhraseNotification = (data) =>
  data?.screen === 'HomeMood' || data?.type === 'daily_phrase';

const shouldShowPhraseModal = (data) =>
  data?.showPhraseModal === true || data?.showPhraseModal === 'true';

const AppNavigator = () => {
  const { userToken, isLoading } = useContext(AuthContext);
  const [viewedOnboarding, setViewedOnboarding] = useState(false);
  const [resumePasswordRecovery, setResumePasswordRecovery] = useState(false);
  const [isRecoveryStateLoading, setIsRecoveryStateLoading] = useState(true);
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const [pendingNotificationData, setPendingNotificationData] = useState(null);
  const handledNotificationIdRef = useRef(null);

  // Pre-loading fonts
  const [fontsLoaded] = useFonts({
    DoppioOne: require('../assets/fonts/DoppioOne-Regular.ttf'),
    Actor: require('../assets/fonts/Actor-Regular.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const loadRecoveryState = async () => {
      try {
        const recoveryState = await AsyncStorage.multiGet([
          'resetPasswordEmail',
          'resetPasswordAutoResume',
          'resetPasswordRequestedAt',
        ]);
        const storedEmail = recoveryState[0]?.[1];
        const autoResume = recoveryState[1]?.[1];
        const requestedAtRaw = recoveryState[2]?.[1];
        const requestedAt = Number(requestedAtRaw || 0);

        if (storedEmail && !requestedAtRaw) {
          await AsyncStorage.setItem(
            'resetPasswordRequestedAt',
            Date.now().toString()
          );
        }

        const isRecoveryValid =
          !!storedEmail &&
          ((requestedAt > 0 &&
            Date.now() - requestedAt < 60 * 60 * 1000) ||
            !requestedAtRaw);
        const shouldResume = isRecoveryValid && autoResume === 'true';

        setResumePasswordRecovery(shouldResume);

        if (!isRecoveryValid && (storedEmail || requestedAt)) {
          await AsyncStorage.multiRemove([
            'resetPasswordEmail',
            'resetPasswordAutoResume',
            'resetPasswordRequestedAt',
          ]);
        }

        if (shouldResume) {
          await AsyncStorage.setItem('resetPasswordAutoResume', 'false');
        }
      } catch (error) {
        console.error('Error al recuperar el estado de cambio de contraseña:', error);
        setResumePasswordRecovery(false);
      } finally {
        setIsRecoveryStateLoading(false);
      }
    };

    loadRecoveryState();
  }, [userToken]);

  useEffect(() => {
    const navigateToHomeMood = (data) => {
      if (!navigationRef.isReady()) {
        return false;
      }

      navigationRef.navigate('Home', {
        screen: 'HomeMood',
        params: {
          showPhraseModal: shouldShowPhraseModal(data),
        },
      });

      return true;
    };

    const handleNotificationResponse = (response) => {
      const notificationId = response?.notification?.request?.identifier;

      if (
        notificationId &&
        handledNotificationIdRef.current === notificationId
      ) {
        return;
      }

      const data = getNotificationData(response);

      if (!isDailyPhraseNotification(data)) {
        return;
      }

      if (notificationId) {
        handledNotificationIdRef.current = notificationId;
      }

      if (!userToken || !navigateToHomeMood(data)) {
        setPendingNotificationData(data);
      }
    };

    const subscription =
      Notifications.addNotificationResponseReceivedListener(
        handleNotificationResponse
      );

    Notifications.getLastNotificationResponseAsync()
      .then((response) => {
        if (response) {
          handleNotificationResponse(response);
        }
      })
      .catch((error) => {
        console.error(
          'Error al recuperar la respuesta inicial de notificacion:',
          error
        );
      });

    return () => {
      subscription.remove();
    };
  }, [userToken, isNavigationReady]);

  useEffect(() => {
    if (
      !userToken ||
      !isNavigationReady ||
      !isDailyPhraseNotification(pendingNotificationData)
    ) {
      return;
    }

    navigationRef.navigate('Home', {
      screen: 'HomeMood',
      params: {
        showPhraseModal: shouldShowPhraseModal(pendingNotificationData),
      },
    });
    setPendingNotificationData(null);
  }, [isNavigationReady, pendingNotificationData, userToken]);

  if (!fontsLoaded || isLoading || isRecoveryStateLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => setIsNavigationReady(true)}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!userToken ? (
          <>
            {resumePasswordRecovery ? (
              <>
                <Stack.Screen name="ChangePassword" component={ChangePassword} />
                <Stack.Screen name="Onboarding" component={Onboarding} />
                <Stack.Screen name="Policy" component={Policy} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
              </>
            ) : (
              <>
                <Stack.Screen name="Onboarding" component={Onboarding} />
                <Stack.Screen name="Policy" component={Policy} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                <Stack.Screen name="ChangePassword" component={ChangePassword} />
              </>
            )}
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeTabs} />
            <Stack.Screen name="Tests" component={Tests} />
            <Stack.Screen name="DepressionTestForm" component={DepressionTestForm} />
            <Stack.Screen name="AnsiedadTestMain" component={AnsiedadTestMain} />
            <Stack.Screen name="DepressionTestMain" component={DepressionTestMain} />
            <Stack.Screen name="TestDepresionHistorial" component={TestDepresionHistorial} />
            <Stack.Screen name="TestAnsiedadHistorial" component={TestAnsiedadHistorial} />
            <Stack.Screen name="TestAnsiedadEstadisticas" component={TestAnsiedadEstadisticas} />
            <Stack.Screen name="TestDepresionEstadisticas" component={TestDepresionEstadisticas} />
            <Stack.Screen name="ResultView" component={ResultView} />
            <Stack.Screen name="MoodTrack" component={MoodTrack} />
            <Stack.Screen name="MoodStats" component={MoodStats} />
            <Stack.Screen name="MoodHistory" component={MoodHistory} />
            <Stack.Screen name="MoodDetails" component={MoodDetails} />
            <Stack.Screen name="Informacion" component={Informacion} />
            <Stack.Screen name="Burnout" component={Burnout} />
            <Stack.Screen name="Ansiedad" component={Ansiedad} />
            <Stack.Screen name="Depresion" component={Depresion} />
            <Stack.Screen name="Crisis" component={Crisis} />
            <Stack.Screen name="InfoSaludMental" component={InfoSaludMental} />
            <Stack.Screen name="Evaluacion" component={Evaluacion} />
            <Stack.Screen name="AprendeSobreSaludMental" component={AprendeSobreSaludMental} />
            <Stack.Screen name="Consejos" component={Consejos} />
            <Stack.Screen name="ConsejosDeEstudiantes" component={ConsejosDeEstudiantes} />
            <Stack.Screen name="RedesDeApoyo" component={RedesDeApoyo} />
            <Stack.Screen name="RedesSociales" component={RedesSociales} />
            <Stack.Screen name="InformacionUv" component={InformacionUv} />
            <Stack.Screen name="ContactarseConApoyoUV" component={ContactarseConApoyoUV} />
            <Stack.Screen name="AsistenteSocial" component={AsistenteSocial} />
            <Stack.Screen name="Conectados" component={Conectados} />
            <Stack.Screen name="AppaUv" component={AppaUv} />
            <Stack.Screen name="DaeUv" component={DaeUv} />
            <Stack.Screen name="ConectadosUv" component={ConectadosUv} />
            <Stack.Screen name="UvInclusiva" component={UvInclusiva} />
            <Stack.Screen name="UnidadDeSalud" component={UnidadDeSalud} />
            <Stack.Screen name="UnidadPrimeraInfancia" component={UnidadPrimeraInfancia} />
            <Stack.Screen name="AreaDeporteyRecreacion" component={AreaDeporteyRecreacion} />
            <Stack.Screen name="Tne" component={Tne} />
            <Stack.Screen name="Baes" component={Baes} />
            <Stack.Screen name="AreaDeAtencionArancelaria" component={AreaDeAtencionArancelaria} />
            <Stack.Screen name="NotificationPreferences" component={NotificationPreferences} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
