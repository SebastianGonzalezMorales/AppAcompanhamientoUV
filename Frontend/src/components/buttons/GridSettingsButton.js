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
    height: 176,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    margin: 0,
    width: '100%',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    flex: 1,
    paddingRight: 6,
    height: '100%',
  },
  text: {
    color: '#238bdf',
    fontFamily: 'DoppioOne',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    flexShrink: 1,
    lineHeight: 15,
  },
  image: {
    width: 102,
    height: 80,
    marginBottom: 2,
  },
  icon: {
    marginTop: 0,
    alignSelf: 'center',
  },
});
