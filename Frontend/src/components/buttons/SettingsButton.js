// React Imports
import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

// Customisation
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function SettingsButton(props) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.button, { backgroundColor: props.backgroundColor || '#d8eef7' }]}
    >
      <Text
        style={[styles.text, { color: props.textColor || '#238bdf' }]}
      >
        {props.text}
      </Text>
      <MaterialCommunityIcons
        style={styles.icon}
        name="chevron-right"
        size={28}
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
    minHeight: 60,
    justifyContent: 'space-between',
    marginTop: 10,
    paddingVertical: 12,
  },
  text: {
    color: '#238bdf',
    flex: 1,
    flexShrink: 1,
    fontFamily: 'DoppioOne',
    fontSize: 16,
    marginLeft: 20,
    marginRight: 12,
  },
  icon: {
    marginRight: 15,
    alignSelf: 'center',
  },
});
