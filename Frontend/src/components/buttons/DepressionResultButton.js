import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DepressionResultButton(props) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.button, props.buttonStyle]}
    >
      <View style={styles.content}>
        <Text
          numberOfLines={2}
          style={[styles.title, props.textStyle]}
        >
          {props.title}
        </Text>
        <View style={styles.metaContainer}>
          <Text numberOfLines={2} style={[styles.textOne, props.textStyle]}>
            {props.textOne}
          </Text>
          <Text numberOfLines={1} style={[styles.textTwo, props.textStyle]}>
            {props.textTwo}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    minHeight: 60,
    width: "100%",
    marginTop: 10,
    paddingVertical: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 18,
    flex: 1,
  },
  title: {
    flex: 1,
    flexShrink: 1,
    fontFamily: "DoppioOne",
    fontSize: 15,
    fontWeight: "bold",
    lineHeight: 20,
    paddingRight: 12,
    minWidth: 0,
    textAlign: "left",
  },
  metaContainer: {
    alignItems: "flex-end",
    flexShrink: 0,
    justifyContent: "center",
    marginLeft: 8,
    width: 100,
  },
  textOne: {
    fontFamily: "DoppioOne",
    fontSize: 13,
    lineHeight: 17,
    textAlign: "right",
    width: "100%",
  },
  textTwo: {
    fontFamily: "DoppioOne",
    fontSize: 14,
    textAlign: "right",
    marginTop: 4,
    width: "100%",
  },
});
