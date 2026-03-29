// React Imports
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CustomButton(props) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      onLongPress={props.onLongPress}
      style={[styles.button, props.buttonStyle]}
    >
      <View style={styles.content}>
        <Text
          numberOfLines={2}
          style={[styles.title, { fontWeight: 'bold' }, props.textStyle]}
        >
          {props.title}
        </Text>

        <Text
          numberOfLines={1}
          style={[styles.textOne, props.textStyle]}
        >
          {props.textOne}
        </Text>

        <Text
          numberOfLines={1}
          style={[styles.textTwo, props.textStyle]}
        >
          {props.textTwo}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    minHeight: 60,
    marginTop: 10,
    width: '100%',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: 'DoppioOne',
    fontSize: 16,
    textAlign: 'left',
    flexShrink: 1,
    flex: 0.8,
    minWidth: 0,
  },
  textOne: {
    fontFamily: 'DoppioOne',
    fontSize: 14,
    textAlign: 'center',
    flexShrink: 1,
    flex: 1,
    minWidth: 0,
    marginHorizontal: 8,
  },
  textTwo: {
    fontFamily: 'DoppioOne',
    fontSize: 14,
    textAlign: 'right',
    flexShrink: 1,
    flex: 0.7,
    minWidth: 0,
  },
});
