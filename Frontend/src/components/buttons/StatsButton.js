// React Imports
import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

// Customisation
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function StatsButton(props) {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.button}>
      <Text style={styles.text}>Mis estadísticas</Text>
      <MaterialCommunityIcons
        style={styles.icon}
        name="chevron-right"
        size={28}
        color="#9F8758"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#F3EFE1',
    borderRadius: 10,
    flexDirection: 'row',
    minHeight: 60,
    justifyContent: 'space-between',
    marginTop: 20,
    paddingVertical: 12,
  },
  text: {
    color: '#9F8758',
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
