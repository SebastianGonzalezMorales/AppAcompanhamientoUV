import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DepressionResultButton(props) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.button, props.buttonStyle]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, props.textStyle]}>
          {props.title}
        </Text>
        <Text style={[styles.textOne, props.textStyle]}>
          {props.textOne}
        </Text>
        <Text style={[styles.textTwo, props.textStyle]}>
          {props.textTwo}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    height: 60,
    width: "100%",
    marginTop: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 18,
    flex: 1,
  },
  title: {
    flex: 1.8,
    flexShrink: 1,
    fontFamily: "DoppioOne",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
  },
  textOne: {
    flex: 0.95,
    fontFamily: "DoppioOne",
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 8,
  },
  textTwo: {
    flex: 0.45,
    fontFamily: "DoppioOne",
    fontSize: 14,
    textAlign: "right",
  },
});
