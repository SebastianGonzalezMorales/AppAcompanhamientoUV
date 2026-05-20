// React Imports
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function FormButton(props) {
  return (
    <TouchableOpacity
      disabled={props.disabled}
      onPress={props.onPress}
      style={[
        styles.button,
        props.disabled ? styles.buttonDisabled : null,
        props.buttonStyle,
      ]}
    >
      <Text style={[styles.text, props.textStyle]}>{props.text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 10,
    height: 60,
    justifyContent: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  text: {
    fontFamily: 'DoppioOne',
    fontSize: 18,
  },
});
