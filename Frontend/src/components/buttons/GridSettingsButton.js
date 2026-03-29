// React Imports
import React from 'react';
import { StyleSheet, TouchableOpacity, Text, Image, View } from 'react-native';

// Customisation
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function GridSettingsButton(props) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.button, { backgroundColor: props.backgroundColor || '#d8eef7' }]}
    >
      <View style={styles.content}>
        {props.imageSource && (
          <Image source={props.imageSource} style={styles.image} resizeMode="contain" />
        )}
        <Text
          style={[styles.text, { color: props.textColor || '#238bdf' }]}
        >
          {props.text}
        </Text>
      </View>
      <MaterialCommunityIcons
        style={styles.icon}
        name="chevron-right"
        size={24}
        color={props.iconColor || '#238bdf'}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#d8eef7',
    borderRadius: 10,
    flexDirection: 'row',
    minHeight: 150,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    margin: 5,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 5,
    flex: 1,
  },
  text: {
    color: '#238bdf',
    fontFamily: 'DoppioOne',
    fontSize: 15,
    marginTop: 4,
    textAlign: 'center',
    flexShrink: 1,
  },
  image: {
    width: 110,
    height: 90,
    marginBottom: 2,
  },
  icon: {
    marginRight: 1,
    alignSelf: 'center',
  },
});
