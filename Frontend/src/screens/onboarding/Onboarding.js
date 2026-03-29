// react imports
import { Animated, FlatList, View, StyleSheet, TouchableOpacity, Text } from 'react-native';

import React, { useRef, useState } from 'react';
import OnboardingItem from './OnboardingItem';
import Paginator from './Paginator';
import NextButton from './NextButton';
import slides from '../../assets/data/OnboardingSlides';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Onboarding = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slideRef = useRef(null);

  const goToPolicy = async () => {
    try {
      await AsyncStorage.setItem('@viewedOnboarding', 'true');
      console.log('completed');
      navigation.navigate('Policy');
    } catch (err) {
      console.log('Error @setItem:', err);
    }
  };

  const skipToLastSlide = () => {
    const lastSlideIndex = slides.length - 1;
    slideRef.current?.scrollToIndex({ index: lastSlideIndex });
    setCurrentIndex(lastSlideIndex);
  };

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    console.log("Viewable Items: ", viewableItems);
    if (viewableItems.length > 0) {
      console.log("Current Index: ", viewableItems[0].index);
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;
  
  // La siguiente diapositiva debe estar al menos en un 50 % en la pantalla antes de que pueda cambiar.
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = async() => {
    if (currentIndex < slides.length - 1) {
      slideRef.current.scrollToIndex({ index: currentIndex + 1 });
  } else{
    await goToPolicy();
    /* console.log('Last item.'); */
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={skipToLastSlide} style={styles.skipButton}>
          <Text style={styles.skipText}>SALTAR</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 3 }}>
        <FlatList
          data={slides}
          renderItem={({ item }) => <OnboardingItem item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: false,
            }
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slideRef}
        />
      </View>

      <Paginator data={slides} scrollX={scrollX} />
      <NextButton scrollTo={scrollTo} />
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  skipContainer: {
    width: '100%',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 34,
  },
  skipButton: {
    minWidth: 72,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#B9C2D0',
    borderRadius: 10,
    backgroundColor: '#F1F3F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    color: '#000C7B',
    fontFamily: 'Actor',
    fontSize: 14,
    letterSpacing: 0.4,
  },
});

