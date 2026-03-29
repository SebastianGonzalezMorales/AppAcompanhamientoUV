// React Imports
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // O el tipo de ícono que prefieras

export default function AuthButton(props) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.button, props.buttonStyle]} 
      // Asegura que props.buttonStyle pueda sobrescribir el estilo predeterminado
    >
      <View style={styles.buttonContent}>
        <Icon name={props.iconName} size={30} color={props.iconColor || "#fff"} style={styles.icon} />
        <Text style={[styles.text, props.textStyle]}>{props.text}</Text>
        
         {/* Asegura que props.textStyle también se aplique */}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#000C7B', // Color predeterminado que puede ser sobrescrito
    borderRadius: 10,
    minHeight: 60,
    justifyContent: 'center',
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  text: {
    color: '#fff', // Color predeterminado del texto que puede ser sobrescrito
    fontFamily: 'DoppioOne',
    fontSize: 18,
    flexShrink: 1,
    marginLeft: 20, // Espacio entre el ícono y el texto
    textAlign: 'center',
  },
  icon: {
    marginRight: -10, // Espaciado entre el ícono y el texto
  },
});
