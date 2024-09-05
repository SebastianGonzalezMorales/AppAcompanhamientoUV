// React Imports

import React, {useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

// Navigation
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import { StatusBar } from 'expo-status-bar';

//Screens
import Onboarding from './src/screens/onboarding/Onboarding';
import HomeScreen from './src/components/buttons/HomeScreen';

import Login from './src/screens/authentication/Login';
import Register from './src/screens/authentication/Register';



// Customisation
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator(); // create tab navigator method
const Stack = createNativeStackNavigator(); // create stack navigator method


// Tab navigator
function Home() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarStyle: { paddingTop: 10 },

        tabBarIcon: ({ focused, size, color }) => {
          let iconName;
          if (route.name === 'Mood') {
            iconName = focused ? 'home-variant' : 'home-variant-outline';
            size = 23;
            color = focused ? '#5da5a9' : '#999';
          } else if (route.name === 'Medication') {
            iconName = focused ? 'calendar' : 'calendar-outline';
            size = 22;
            color = focused ? '#5da5a9' : '#999';
          } else if (route.name === 'Questionnaire') {
            iconName = focused ? 'file-document' : 'file-document-outline';
            size = 22;
            color = focused ? '#5da5a9' : '#999';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog' : 'cog-outline';
            size = 22;
            color = focused ? '#5da5a9' : '#999';
          } else {
          }
          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
      })}
    >
      <Tab.Screen
        options={{ headerShown: false, gestureEnabled: false }}
        name={'Mood'}
        component={Mood}
      />
      <Tab.Screen
        options={{ headerShown: false, gestureEnabled: false }}
        name={'Medication'}
        component={Medication}
      />
      <Tab.Screen
        options={{ headerShown: false, gestureEnabled: false }}
        name={'Questionnaire'}
        component={Questionnaire}
      />
      <Tab.Screen
        options={{ headerShown: false, gestureEnabled: false }}
        name={'Settings'}
        component={Settings}
      />
    </Tab.Navigator>
  );
}


export default function App() {
  //const [loading, setLoading] = useState(true);
  const [viewedOnboarding, setViewedOnboarding] = useState(false);
  const checkOnboarding = async () => {
  try {
    const value = await AsyncStorage.getItem('@viewedOnboarding');

    if (value !== null){
      setViewedOnboarding(true)
    }

  } catch (err) {

    console.log('Error @checkOnboarding:', err)
  } finally {
    //setLoading(false)

  }
  }

  useEffect(() => {
    checkOnboarding();
  }, [])

 /*  const handleOnboardingCompletion = () => {
    setViewedOnboarding(true);
  } */

     const [initialising, setInitialising] = useState(true);
  const [user, setUser] = useState();

  // pre-loading fonts
  const [fontsLoaded] = useFonts({
    DoppioOne: require('./src/assets/fonts/DoppioOne-Regular.ttf'),
    Actor: require('./src/assets/fonts/Actor-Regular.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);
/* 
  // Handle user state changesn'pkdsjsdf
  function onAuthStateChanged(user) {
    setUser(user);
    if (initialising) setInitialising(false);
  }

  // Remember user
  useEffect(() => {
    /* const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged); 
    const subscriber = console.log("hola");
    return subscriber;
  }, []); 
  */

  if (!fontsLoaded) {
    return undefined;
  } else {
    SplashScreen.hideAsync();
  }

 /*  if (initialising) return null; */
  
 return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* authentication */}
        {/* {viewedOnboarding ? (
          <Stack.Screen name="Login" component={Login} />
        ) : (
          <Stack.Screen name="Onboarding" component={Onboarding} />
        )} */}
        {!viewedOnboarding ? ( <Stack.Screen name="Onboarding" component={Onboarding} options={{ gestureEnabled: false }}
          />
        ) : (
          <></>
        )}
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ gestureEnabled: false }}
        />
     {/*    <Stack.Screen name="Register" component={Register} /> */}
        {/* mood tracker */}
{/*         <Stack.Screen name="TrackMood" component={TrackMood} />
        <Stack.Screen name="UpdateMood" component={UpdateMood} />
        <Stack.Screen name="MoodStats" component={MoodStats} />
        <Stack.Screen
          name="MoodHistory"
          component={MoodHistory}
          options={{
            presentation: 'modal',
            animationTypeForReplace: 'push',
            animation: 'slide_from_bottom',
          }}
        /> */}


        
        {/* questionnaire */}
{/*         <Stack.Screen name="Test" component={Test} />
        <Stack.Screen
          name="QuestionnaireStats"
          component={QuestionnaireStats}
        />
        <Stack.Screen name="ResultView" component={ResultView} />
        <Stack.Screen
          name="QuestionnaireHistory"
          component={QuestionnaireHistory}
          options={{
            presentation: 'modal',
            animationTypeForReplace: 'push',
            animation: 'slide_from_bottom',
          }}
        /> */}


        {/* settings */}
     {/*    <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Counselling" component={Counselling} /> */}
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
