import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SupportButton = ({ text, onPress, isExpanded }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{text}</Text>
      <MaterialCommunityIcons
        style={styles.icon}
        name={isExpanded ? 'chevron-up' : 'chevron-down'} // Flecha dinámica
        size={28}
        color="#238bdf"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#d8eef7', // Mismo color de fondo
    borderRadius: 10,
    flexDirection: 'row',
    minHeight: 80,
    justifyContent: 'space-between',
    marginTop: 10,
    paddingVertical: 12,
  },
  text: {
    color: '#238bdf',
    flex: 1,
    flexShrink: 1,
    fontFamily: 'DoppioOne', // Fuente igual a la que usas
    fontSize: 16,
    marginLeft: 20,
    marginRight: 12,
  },
  icon: {
    marginRight: 15,
    alignSelf: 'center',
  },
});

export default SupportButton;
