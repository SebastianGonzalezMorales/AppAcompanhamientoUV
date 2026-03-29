// React Imports
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PickMoodButton(props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.subContainer} onPress={props.onPress}>
        <Text style={styles.emoji}>{props.emoji}</Text>
      </TouchableOpacity>
      <Text style={styles.emojiText}>{props.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 84,
    marginHorizontal: 4,
    marginTop: 20,
    flexShrink: 1,
  },
  subContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  emoji: {
    fontSize: 24,
  },
  emojiText: {
    color: '#fff',
    fontFamily: 'DoppioOne',
    fontSize: 11,
    paddingTop: 5,
    textAlign: 'center',
    flexShrink: 1,
    width: '100%',
    lineHeight: 14,
  },
});
