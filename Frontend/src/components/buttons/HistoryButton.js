// React Imports
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HistoryButton(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.textLeft}>{props.textLeft}</Text>
      <TouchableOpacity onPress={props.onPress} style={styles.historyButton}>
        <Text style={styles.textRight}>{props.textRight}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 30,
  },
  textLeft: {
    color: '#5c6169',
    flex: 1,
    flexShrink: 1,
    fontFamily: 'DoppioOne',
    fontSize: 16,
    marginRight: 12,
  },
  textRight: {
    color: '#5c6169',
    fontFamily: 'DoppioOne',
    fontSize: 12,
    textAlign: 'right',
  },
});
