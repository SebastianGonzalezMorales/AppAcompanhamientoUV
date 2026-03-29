import {
  Image,
  ScrollView,
  View,
  StyleSheet,
  Text,
  useWindowDimensions,
} from 'react-native';
import React from 'react';

const OnboardingItem = ({ item }) => {
  // Obtiene el ancho de la pantalla
  const { width, height, fontScale } = useWindowDimensions();
  const isLargeText = fontScale > 1.15;
  const imageHeight = isLargeText
    ? Math.min(height * 0.22, 180)
    : Math.min(height * 0.3, 240);

  return (
    <View style={[styles.container, { width }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: isLargeText ? 8 : 12, paddingBottom: isLargeText ? 32 : 24 },
        ]}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        <Image
          source={item.image}
          style={[
            styles.image,
            {
              width: width * (isLargeText ? 0.66 : 0.78),
              height: imageHeight,
              marginBottom: isLargeText ? 16 : 24,
            },
          ]}
        />
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              {
                fontSize: isLargeText ? 24 : 28,
                lineHeight: isLargeText ? 30 : 34,
                paddingHorizontal: isLargeText ? 20 : 30,
              },
            ]}
          >
            {item.title}
          </Text>
          <Text
            style={[
              styles.description,
              {
                paddingHorizontal: isLargeText ? 26 : 50,
                lineHeight: isLargeText ? 28 : 24,
              },
            ]}
          >
            {item.description}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default OnboardingItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  image: {
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  textContainer: {
    width: '100%',
    flexGrow: 1,
  },
  title: {
    fontWeight: '800',
    fontSize: 28,
    lineHeight: 34,
    marginBottom: 10,
    color: '#000C7B',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  description: {
    fontWeight: '400',
    color: '#4D4F54',
    textAlign: 'center',
    paddingHorizontal: 50,
    fontSize: 17,
    lineHeight: 24,
  },
});
