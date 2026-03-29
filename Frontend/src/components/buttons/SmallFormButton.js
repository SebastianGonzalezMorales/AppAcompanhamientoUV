// React Imports
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function SmallFormButton(props) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      disabled={props.disabled}
      style={[styles.button, props.buttonStyle]}
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
    width: '40%',
    backgroundColor: '#f2f2f2',
    margin: 15,
  },
  text: {
    fontFamily: 'DoppioOne',
    fontSize: 18,
    color: '#7db7ba',
  },
});
