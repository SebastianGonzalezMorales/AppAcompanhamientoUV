// react imports
import { FlatList, Modal, SafeAreaView, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';

// firebase


// components
import CustomButton from '../../components/buttons/CustomButton';
import FormButton from '../../components/buttons/FormButton';
import HistoryButton from '../../components/buttons/HistoryButton';
import PickMoodButton from '../../components/buttons/PickMoodButton';
import StatsButton from '../../components/buttons/StatsButton';

// customisation
import GlobalStyle from '../../assets/styles/GlobalStyle';
import ModalStyle from '../../assets/styles/ModalStyle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import axios from 'axios';

const Mood = ({ navigation }) => {
  // references
 /*  const userRef = firebase
    .firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid);

  const moodRef = firebase
    .firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .collection('mood');
 */
  // states
  const [name, setName] = useState('');
  const [moods, setMoods] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [motivationalQuote, setMotivationalQuote] = useState('');
  /*
   * *******************
   * **** Functions ****
   * *******************
   */

  // transfer document id to the next screen
  const startTracking = async (mood, value) => {
    const selectedMood = userRef.collection('mood').doc();
    // store id of document into documentId
    const documentId = selectedMood.id;
    await selectedMood.set({
      mood,
      value,
    });

    /* // pass the documentId to the following page
    navigation.navigate('TrackMood', { documentId }); */

    // delay promise execution
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('New document created');
  };

  // hook to fetch user's data
 /*  useEffect(() => {
    const fetchName = async () => {
      userRef.onSnapshot((snapshot) => {
        const { fullName } = snapshot.data();
        const firstName = fullName.split(' ')[0];
        setName(firstName);
      });
    };
    fetchName();
  }, []);
 */
  // hook to fetch all documents
  useEffect(() => {
    const fetchData = async () => {
/*       // onSnapshot method to listen to real time updates
      moodRef.orderBy('created', 'desc').onSnapshot((querySnapshot) => {
        const moods = [];
        querySnapshot.forEach((doc) => {
          const { mood, created } = doc.data();
          const date = created.toDate().toString().slice(4, 10);
          const time = created.toDate().toString().slice(16, 21);
          moods.push({
            id: doc.id, // document id
            mood,
            date,
            time,
          });
        });
        setMoods(moods);
      }); */
    };

    fetchData(); // call the async function to fetch data
  }, []);

  // delete document function
  const deleteItem = () => {
    if (selectedId) {
      
      console.log('Document', selectedId, 'has been deleted');
      setModalVisible(false);
    } else {
      console.log('Document not found');
    }
  };

  const fetchMotivationalQuote = async () => {
    try {
      const response = await axios.get('http://192.168.1.3:3000/api/v1/tips/get-random-tips', {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmRiOWIzMjQ0MWFhYzVkNTliZmRjOTciLCJlbWFpbCI6ImNhcmxhQGdtYWlsLmNvbSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3MjU5OTQ3NDMsImV4cCI6MTcyNjA4MTE0M30.xmnalOxXvih1tFfV7z0NseVYIrpQuqNVO60djXww5Gw`  // Reemplaza YOUR_ACCESS_TOKEN con el token real
        }

        });
        const { mensaje, autor } = response.data;
        console.log(`Mensaje: ${mensaje}`);
        console.log(`Autor: ${autor}`);
      setMotivationalQuote(`${mensaje} - ${autor}`); // Ajusta según la estructura de tu respuesta
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
  };
  
  // Llama a la función en un useEffect para que se ejecute cuando el componente se monte
  useEffect(() => {
    fetchMotivationalQuote();
  }, []); 
  

  useEffect(() => {
   
    const fetchUserData = async () => {
      try {
        console.log("g¿hila")
        const response = await axios.post('http://192.168.1.3:3000/api/v1/users/userdata',
          {
            // Token en el cuero de la solicitud
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmRiOWIzMjQ0MWFhYzVkNTliZmRjOTciLCJlbWFpbCI6ImNhcmxhQGdtYWlsLmNvbSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3MjU5OTQ3NDMsImV4cCI6MTcyNjA4MTE0M30.xmnalOxXvih1tFfV7z0NseVYIrpQuqNVO60djXww5Gw'
          },
          {
            // Token de autorización en el header
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmRiOWIzMjQ0MWFhYzVkNTliZmRjOTciLCJlbWFpbCI6ImNhcmxhQGdtYWlsLmNvbSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3MjU5OTQ3NDMsImV4cCI6MTcyNjA4MTE0M30.xmnalOxXvih1tFfV7z0NseVYIrpQuqNVO60djXww5Gw`
            }
          }
        );
        const userName = response.data.data.name;

        // Actualiza el estado con el nombre
        setName(userName);
  
        // Para verificar en la consola
        console.log('User name:', userName);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
  
    };
    fetchUserData();
  }, []);

  /*
   * ****************
   * **** Screen ****
   * ****************
   */

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
      {/*
       * *****************
       * ***** Modal *****
       * *****************
       */}

      {/* info modal */}
      <Modal
        visible={infoModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setInfoModalVisible(!infoModalVisible);
        }}
      >
        <View style={ModalStyle.smallModalContainer}>
          <View style={ModalStyle.smallModalContent}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text style={ModalStyle.smallModalTitle}>Tips</Text>
              <MaterialCommunityIcons
                name="close"
                color="#f2f2f2"
                size={30}
                style={ModalStyle.modalToggleExit}
                onPress={() => setInfoModalVisible(!infoModalVisible)}
              />
            </View>
            <Text style={ModalStyle.smallModalText}>
              1. Tap on a mood to start tracking!
            </Text>
            <Text style={ModalStyle.smallModalTextTwo}>
              2. Tap and hold to delete an entry
            </Text>
          </View>
        </View>
      </Modal>

      {/* delete document modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={ModalStyle.halfModalContent}>
          <View style={ModalStyle.halfModalWrapper}>
            <FormButton
              text="Delete"
              onPress={() => {
                deleteItem(), setModalVisible(!modalVisible);
              }}
              buttonStyle={{
                backgroundColor: '#e55e7e',
              }}
              textStyle={{ color: '#f2f2f2' }}
            />

            <FormButton
              text="Cancel"
              onPress={() => setModalVisible(!modalVisible)}
              buttonStyle={{
                backgroundColor: '#5da5a9',
              }}
              textStyle={{ color: '#f2f2f2' }}
            />
          </View>
        </View>
      </Modal>

      {/*
       * *********************
       * ***** Section 1 *****
       * *********************
       */}
      <View style={{ height: 301 }}>
        <Text style={GlobalStyle.welcomeText}>Hola, {name} 😀 !</Text >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={GlobalStyle.subtitle}>Ho do you feel right now?</Text>
          <MaterialCommunityIcons
            name="information"
            color="#f2f2f2"
            size={24}
            style={{ paddingTop: 28, paddingRight: 30 }}
            onPress={() => setInfoModalVisible(true)}
          />
        </View>
        <View style={GlobalStyle.moodsContainer}>
          <PickMoodButton
            onPress={() => startTracking('Bad', 1)}
            emoji="😞"
            text="Bad"
          />
          <PickMoodButton
            onPress={() => startTracking('Good', 2)}
            emoji="🙂"
            text="Good"
          />
          <PickMoodButton
            onPress={() => startTracking('Great', 3)}
            emoji="😊"
            text="Great"
          />
          <PickMoodButton
            onPress={() => startTracking('Excellent', 4)}
            emoji="😃"
            text="Excellent"
          />
                    {/* Motivational Quote Section */}
  
  </View>
  <View style={{ marginTop: 5, alignItems: 'center', paddingHorizontal: 20 }}>
  <Text style={GlobalStyle.subtitle}>Motivational Quote:</Text>
  <Text style={[GlobalStyle.quoteText, { textAlign: 'left', marginTop: 10 }]}>
    {motivationalQuote}
  </Text>
</View>
      </View>

      {/*
       * *********************
       * ***** Section 2 *****
       * *********************
       */}
      <View style={GlobalStyle.rowTwo}>
        <View style={GlobalStyle.statsContainer}>
          <Text style={GlobalStyle.statsTitle}>Statistics</Text>
          <StatsButton onPress={() => navigation.navigate('MoodStats')} />
        </View>
        <HistoryButton
          onPress={() => navigation.navigate('MoodHistory')}
          textLeft="Recent"
          textRight="See all"
        />
        <FlatList
          data={moods.slice(0, 5)}
          numColumns={1}
          renderItem={({ item }) => (
            <CustomButton
              buttonStyle={{
                backgroundColor:
                  item.mood === 'Bad'
                    ? '#f7d8e3'
                    : item.mood === 'Good'
                    ? '#d8eef7'
                    : item.mood === 'Great'
                    ? '#d8f7ea'
                    : '#f7e7d8',
              }}
              textStyle={{
                color:
                  item.mood === 'Bad'
                    ? '#d85a77'
                    : item.mood === 'Good'
                    ? '#238bdf'
                    : item.mood === 'Great'
                    ? '#109f5c'
                    : '#af7b56',
              }}
              title={item.mood}
              textOne={item.date}
              textTwo={item.time}
              onLongPress={() => (
                setModalVisible(true), setSelectedId(item.id) // set id as the document id
              )}
              onPress={() => {
                navigation.navigate('UpdateMood', { documentId: item.id });
              }}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Mood;
