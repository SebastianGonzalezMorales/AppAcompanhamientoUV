// react imports
import { Image, Text, TextInput, View, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import Svg, { Circle } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { Alert } from "react-native";

import { format } from "date-fns";

// Import the API URL from environment variables
import Constants from "expo-constants";

// Asigna API_URL desde la configuración
const { API_URL } = Constants.expoConfig?.extra || {};

// components
import AuthButton from "../../components/buttons/AuthButton";
import SmallAuthButton from "../../components/buttons/SmallAuthButton";

// customisation
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AuthStyle from "../../assets/styles/AuthStyle";

import facultiesData from "../../assets/data/facultades.json"; // Importamos el archivo JSON con las facultades y carreras

const Register = ({ navigation }) => {
  // states
  const [fullName, setFullName] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [birthdate, setBirthdate] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [faculty, setFaculty] = useState("");
  const [career, setCareer] = useState("");
  const [careersAvailable, setCareersAvailable] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("+569 "); // Inicializa con el prefijo

  const sanitizeEmail = (value) => value.replace(/\s+/g, "");
  const sanitizePasswordEdges = (value) => value.replace(/^\s+|\s+$/g, "");
  const handlePasswordChange = (value) => setPassword(sanitizePasswordEdges(value));
  const handleConfirmPasswordChange = (value) =>
    setConfirmPassword(sanitizePasswordEdges(value));

  /*
   * *******************
   * **** Functions ****
   * *******************
   */

  // Función para manejar el cambio de facultad
  const handleFacultadChange = (selectedFaculty) => {
    setFaculty(selectedFaculty);
    setCareersAvailable(facultiesData[selectedFaculty] || []);
    setCareer(""); // Resetea carrera si cambia la facultad
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Oculta el selector de fecha

    if (selectedDate) {
      // Formatear la fecha como "11-12-2024"
      const formattedDate = format(selectedDate, "dd-MM-yyyy");
      setBirthdate(formattedDate); // Guardar la fecha formateada
    }
  };

  const handlePhoneFocus = () => {
    if (!phoneNumber.startsWith("+569 ")) {
      setPhoneNumber("+569 "); // Agrega el prefijo al enfocar
    }
  };

  const handlePhoneNumberChange = (text) => {
    // Forzar el prefijo "+569 " al inicio
    if (!text.startsWith("+569 ")) {
      text = "+569 ";
    }

    // Permitir solo números después del prefijo
    let numbersOnly = text.slice(5).replace(/[^0-9]/g, "");

    // Limitar a 8 dígitos
    if (numbersOnly.length > 8) {
      numbersOnly = numbersOnly.slice(0, 8);
    }

    const formattedNumber = `+569 ${numbersOnly}`;
    console.log("Número actualizado correctamente:", formattedNumber); // Log adicional
    setPhoneNumber(formattedNumber);
  };

  /*
   * ***********************
   * **** Recuperación de AsyncStorage ****
   * ***********************
   */

  const handleBirthdateChange = (text) => {
    // Permitir solo números y guiones
    const validText = text.replace(/[^0-9\-]/g, "");

    // Aplicar formato YYYY-MM-DD de forma dinámica
    let formattedDate = "";
    const numbersOnly = validText.replace(/-/g, ""); // Eliminar guiones para contar caracteres

    if (numbersOnly.length > 0) {
      formattedDate += numbersOnly.substring(0, 4); // Añadir año
    }
    if (numbersOnly.length >= 5) {
      formattedDate += "-" + numbersOnly.substring(4, 6); // Añadir mes
    }
    if (numbersOnly.length >= 7) {
      formattedDate += "-" + numbersOnly.substring(6, 8); // Añadir día
    }

    // Actualizar el estado con el formato actual
    setBirthdate(formattedDate);

    // Solo hacer la validación cuando se haya ingresado una fecha completa
    if (formattedDate.length === 10) {
      const [year, month, day] = formattedDate.split("-").map(Number);

      // Validar el año (por ejemplo, debe ser un valor razonable)
      if (year < 1900 || year > new Date().getFullYear()) {
        console.log("Año inválido");
        return;
      }

      // Validar el mes (1 a 12)
      if (month < 1 || month > 12) {
        console.log("Mes inválido");
        return;
      }

      // Validar el día en función del mes y si el año es bisiesto
      const daysInMonth = [
        31,
        (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
      ];

      if (day < 1 || day > daysInMonth[month - 1]) {
        console.log("Día inválido");
        return;
      }

      // La fecha es válida
      console.log("Fecha válida");
    }
  };

  const validateRut = (rut) => {
    // Remover puntos y guiones
    rut = rut.replace(/[^0-9kK]/g, "");
    if (rut.length < 2) {
      return false;
    }

    // Separar número y dígito verificador
    const rutBody = rut.slice(0, -1);
    let dv = rut.slice(-1).toUpperCase();

    // Calcular el dígito verificador
    let sum = 0;
    let multiplier = 2;
    for (let i = rutBody.length - 1; i >= 0; i--) {
      sum += parseInt(rutBody.charAt(i)) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const calculatedDv = 11 - (sum % 11);

    // Convertir el dígito verificador calculado
    if (calculatedDv === 11) dv = "0";
    else if (calculatedDv === 10) dv = "K";
    else dv = calculatedDv.toString();

    return dv === rut.slice(-1).toUpperCase();
  };

  const formatRut = (rut) => {
    // Elimina cualquier carácter que no sea un número, punto o guion
    let cleanRut = rut.replace(/[^0-9kK.-]/g, "");

    // Añade puntos y guion si no están presentes
    if (cleanRut.length > 1) {
      if (cleanRut.length > 2 && cleanRut[2] !== ".") {
        cleanRut = cleanRut.slice(0, 2) + "." + cleanRut.slice(2);
      }
      if (cleanRut.length > 6 && cleanRut[6] !== ".") {
        cleanRut = cleanRut.slice(0, 6) + "." + cleanRut.slice(6);
      }
      if (cleanRut.length > 10 && cleanRut[10] !== "-") {
        cleanRut = cleanRut.slice(0, 10) + "-" + cleanRut.slice(10);
      }
    }

    return cleanRut.toUpperCase(); // Devuelve el RUT formateado
  };

  const handleRutChange = (text) => {
    // Aplica formateo solo si el usuario está ingresando caracteres, no borrando
    if (text.length >= rut.length) {
      setRut(formatRut(text));
    } else {
      // Si el usuario está borrando, simplemente actualiza el estado sin formatear
      setRut(text);
    }
  };

  const validateEmail = (email) => {
    const uvEmailPattern = /^[a-zA-Z]+\.[a-zA-Z]+@estudiantes\.uv\.cl$/;
    return uvEmailPattern.test(email);
  };

  const validateFullName = (fullName) => {
    const nameParts = fullName.trim().split(" ");
    return nameParts.length >= 2; // Verifica que haya al menos dos palabras
  };

  const isStrongPassword = (password) => {
    // Verificar longitud mínima
    if (password.length < 8) return false;

    // Verificar si contiene al menos una letra mayúscula
    if (!/[A-Z]/.test(password)) return false;

    // Verificar si contiene al menos una letra minúscula
    if (!/[a-z]/.test(password)) return false;

    // Verificar si contiene al menos un número
    if (!/[0-9]/.test(password)) return false;

    // Verificar si contiene al menos un símbolo
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;

    return true;
  };

  // sign up function
  const handleSignUp = async (
    fullName,
    rut,
    email,
    faculty,
    career,
    birthdate,
    phoneNumber,
    password,
    confirmPassword
  ) => {
    try {
      const sanitizedEmail = sanitizeEmail(email).trim().toLowerCase();
      const sanitizedPassword = sanitizePasswordEdges(password).trim();
      const sanitizedConfirmPassword = sanitizePasswordEdges(confirmPassword).trim();

      setEmail(sanitizedEmail);
      setPassword(sanitizedPassword);
      setConfirmPassword(sanitizedConfirmPassword);

      console.log(" ");
      console.log(fullName);
      console.log(rut);
      console.log(sanitizedEmail);
      console.log(faculty);
      console.log(career);
      console.log(birthdate);
      console.log(phoneNumber);
      console.log(sanitizedPassword);
      console.log(sanitizedConfirmPassword);
      console.log(" ");

      // Validación de nombre y apellido
      if (!validateFullName(fullName)) {
        Alert.alert("Error", "Por favor, ingresa tu nombre y apellido.", [
          { text: "OK" },
        ]);
        return;
      }

      if (!/^\+569 \d{8}$/.test(phoneNumber.trim())) {
        console.log(
          "Número de teléfono inválido (detalles):",
          phoneNumber.trim(),
          "Longitud:",
          phoneNumber.trim().length
        );
        Alert.alert(
          "Error",
          "El número ingresado no es válido. Asegúrate de usar el formato +569 XXXXXXXX.",
          [{ text: "OK" }]
        );
        return;
      }

      if (!faculty) {
        Alert.alert("Error", "Por favor, selecciona una facultad.", [
          { text: "OK" },
        ]);
        return;
      }

      if (!career) {
        Alert.alert("Error", "Por favor, selecciona una carrera.", [
          { text: "OK" },
        ]);
        return;
      }

      // Validar que la fecha de nacimiento no esté vacía
      if (!birthdate || birthdate.trim() === "") {
        Alert.alert("Error", "Por favor, selecciona tu fecha de nacimiento.", [
          { text: "OK" },
        ]);
        return;
      }

      // Verifica si se aceptó la política
      const accepted = await AsyncStorage.getItem("policyAccepted");
      console.log("Policy Accepted:", accepted); // Verificar en consola

      if (accepted !== "true") {
        alert("Debes aceptar la política de privacidad para continuar.");
        return; // Detenemos el registro si no se aceptó la política
      }

      if (!validateRut(rut)) {
        Alert.alert(
          "Error",
          "Rut inválido. Por favor, verifica el rut ingresado.",
          [{ text: "OK" }]
        );
        return;
      }

      if (!sanitizedEmail) {
        Alert.alert("Error", "Por favor, ingresa tu correo electrónico.", [
          { text: "OK" },
        ]);
        return;
      }

      if (!validateEmail(sanitizedEmail)) {
        Alert.alert(
          "Error",
          "Correo electrónico inválido. Por favor, utiliza el formato nombre.apellido@estudiantes.uv.cl.",
          [{ text: "OK" }]
        );
        return;
      }

      if (!isStrongPassword(sanitizedPassword)) {
        Alert.alert(
          "Error",
          "La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula, un número y un símbolo.",
          [{ text: "OK" }]
        );
        return;
      }

      if (sanitizedPassword !== sanitizedConfirmPassword) {
        Alert.alert(
          "Error",
          "Las contraseñas no coinciden. Por favor, verifica que ambas sean iguales.",
          [{ text: "OK" }]
        );
        return;
      }

      // Datos a enviar al backend
      const userData = {
        name: fullName,
        rut: rut,
        email: sanitizedEmail,
        password: sanitizedPassword,
        confirmPassword: sanitizedConfirmPassword,
        birthdate: birthdate,
        career: career,
        faculty: faculty,
        phoneNumber: phoneNumber.replace(" ", ""), // Elimina el espacio
        policyAccepted: accepted,
      };
      console.log("Datos enviados al backend:", userData);

      // Realizar la solicitud POST al backend
      const response = await api.post(`${API_URL}/auth/register`, userData);
      console.log("Datos enviados al backend:", userData);

      // Verificar la respuesta del servidor
    
        Alert.alert(
          "Registro exitoso",
          response.data.message,
  [{ text: "OK", onPress: () => navigation.navigate("Login") }]
);
 
    } catch (error) {
      if (error.response) {
        // Extraer la propiedad "message" del objeto devuelto por el backend
        const errorMessage =
          error.response.data.message || "Ha ocurrido un error inesperado.";

        Alert.alert("Error en el registro", errorMessage, [{ text: "OK" }]);
      } else if (error.request) {
        // Error de conexión
        Alert.alert(
          "Error de conexión",
          "No se recibió respuesta del servidor. Por favor, verifica tu conexión a Internet e intenta nuevamente.",
          [{ text: "OK" }]
        );
      } else {
        // Error al configurar la solicitud
        Alert.alert("Error", `Ocurrió un error inesperado: ${error.message}`, [
          { text: "OK" },
        ]);
      }
    }
  };

  /*
   * ****************
   * **** Screen ****
   * ****************
   */

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={AuthStyle.container}>
        {/* section one */}
        <View style={AuthStyle.rowOne}>
          <Svg style={{ position: "absolute" }}>
            <Circle opacity={0.2} fill="#abced5" cx="10%" cy="30%" r="25" />
          </Svg>
          <Svg style={{ position: "absolute" }}>
            <Circle opacity={0.2} fill="#abced5" cx="2%" cy="70%" r="25" />
          </Svg>
          <Svg style={{ position: "absolute" }}>
            <Circle opacity={0.2} fill="#abced5" cx="30%" cy="50%" r="30" />
          </Svg>
          <Svg style={{ position: "absolute" }}>
            <Circle opacity={0.2} fill="#abced5" cx="25%" cy="95%" r="30" />
          </Svg>
          <Svg style={{ position: "absolute" }}>
            <Circle opacity={0.2} fill="#abced5" cx="52%" cy="70%" r="25" />
          </Svg>
          <Svg style={{ position: "absolute" }}>
            <Circle opacity={0.2} fill="#abced5" cx="64%" cy="20%" r="25" />
          </Svg>
          <Svg style={{ position: "absolute" }}>
            <Circle opacity={0.2} fill="#abced5" cx="70%" cy="100%" r="25" />
          </Svg>
          <Svg style={{ position: "absolute" }}>
            <Circle opacity={0.2} fill="#abced5" cx="75%" cy="60%" r="30" />
          </Svg>
          <Svg style={{ position: "absolute" }}>
            <Circle opacity={0.2} fill="#abced5" cx="95%" cy="35%" r="25" />
          </Svg>
          <Svg style={{ position: "absolute" }}>
            <Circle opacity={0.2} fill="#abced5" cx="100%" cy="85%" r="30" />
          </Svg>
          <SafeAreaView style={AuthStyle.logo}>
            {/* <Text style={AuthStyle.logoText}>Logo</Text> */}
            <Image
              style={{ width: 100, height: 100 }}
              source={require("./../../assets/images/SlidesOnboarding/Icon_Application.png")}
            />
          </SafeAreaView>
        </View>
        {/* section two */}
        <View style={AuthStyle.rowTwo}>
          <Text style={AuthStyle.title}>Crea una cuenta</Text>
          <View style={AuthStyle.inputContainer}>
            <MaterialCommunityIcons
              name="account-outline"
              size={24}
              style={AuthStyle.icon}
            />
            <TextInput
              onChangeText={setFullName}
              placeholder="Nombre y apellido"
              placeholderTextColor="#92959f"
              selectionColor="#5da5a9"
              style={AuthStyle.input}
              keyboardType="default"
              autoCapitalize="words"
              autoCorrect={false}
              autoComplete="name"
              textContentType="name"
            />
          </View>
          <View style={AuthStyle.inputContainer}>
            <MaterialCommunityIcons
              name="information-outline"
              size={24}
              style={AuthStyle.icon}
            />
            <TextInput
              value={rut} // El valor es el RUT formateado
              onChangeText={handleRutChange} // Se maneja el cambio de texto con el formateador
              placeholder="Rut"
              placeholderTextColor="#92959f"
              selectionColor="#5da5a9"
              style={AuthStyle.input}
              keyboardType="numeric" // Cambia el teclado a numérico
              maxLength={12} // Máxima longitud del RUT formateado
            />
          </View>

          <View style={AuthStyle.inputContainer}>
            <MaterialCommunityIcons
              name="email-outline"
              size={23}
              style={AuthStyle.icon}
            />
            <TextInput
              autoCapitalize="none"
              keyboardType="Email address"
              onChangeText={(text) => setEmail(sanitizeEmail(text))}
              placeholder="Correo institucional"
              placeholderTextColor="#92959f"
              selectionColor="#5da5a9"
              style={AuthStyle.input}
              value={email}
            />
          </View>

          {/* Dropdown para Facultad */}
          <View
            style={[
              AuthStyle.inputContainer,
              styles.dateInputContainer,
              styles.pickerFieldContainer,
            ]}
          >
            <MaterialCommunityIcons
              name="domain"
              size={24}
              color="#5da5a9"
              style={AuthStyle.icon}
            />
            <Text
              allowFontScaling
              numberOfLines={2}
              pointerEvents="none"
              style={[
                AuthStyle.input,
                styles.dateFieldText,
                !faculty && styles.datePlaceholderText,
              ]}
            >
              {faculty || "Selecciona una facultad"}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={24}
              color="#92959f"
              pointerEvents="none"
              style={styles.pickerChevron}
            />
            <Picker
              selectedValue={faculty}
              onValueChange={(itemValue) => handleFacultadChange(itemValue)}
              style={[styles.hiddenPickerOverlay, styles.adaptivePickerInput]}
              itemStyle={styles.adaptivePickerItem}
              enabled={Object.keys(facultiesData).length > 0}
              dropdownIconColor="#92959f"
            >
              <Picker.Item label="Selecciona una facultad" value="" />
              {Object.keys(facultiesData).map((fac) => (
                <Picker.Item key={fac} label={fac} value={fac} />
              ))}
            </Picker>
          </View>

          {/* Dropdown para Carrera */}
          <View
            style={[
              AuthStyle.inputContainer,
              styles.dateInputContainer,
              styles.pickerFieldContainer,
            ]}
          >
            <MaterialCommunityIcons
              name="school-outline" // Ícono para Carrera
              size={24}
              color="#5da5a9" // Color celeste igual al resto
              style={AuthStyle.icon} // Usa el mismo estilo que los otros íconos
            />
            <Text
              allowFontScaling
              numberOfLines={2}
              pointerEvents="none"
              style={[
                AuthStyle.input,
                styles.dateFieldText,
                !career && styles.datePlaceholderText,
              ]}
            >
              {career || "Selecciona una carrera"}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={24}
              color="#92959f"
              pointerEvents="none"
              style={styles.pickerChevron}
            />
            <Picker
              selectedValue={career}
              onValueChange={(itemValue) => {
                if (!faculty) {
                  Alert.alert("Atención", "Primero selecciona una facultad.");
                  return;
                }

                setCareer(itemValue);
              }}
              style={[
                styles.hiddenPickerOverlay,
                styles.adaptivePickerInput,
              ]}
              itemStyle={styles.adaptivePickerItem}
              enabled={true}
              dropdownIconColor="#92959f" // Color de la flecha predeterminada
            >
              <Picker.Item label="Selecciona una carrera" value="" />
              {careersAvailable.map((car) => (
                <Picker.Item key={car} label={car} value={car} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={[AuthStyle.inputContainer, styles.dateInputContainer]} // Aplica los mismos estilos
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                minWidth: 0,
                width: "100%",
              }}
            >
              <MaterialCommunityIcons
                name="calendar-outline"
                size={24}
                style={AuthStyle.icon}
              />
              <Text
                allowFontScaling
                numberOfLines={2}
                style={[
                  AuthStyle.input,
                  styles.dateFieldText,
                  !birthdate && styles.datePlaceholderText,
                ]}
              >
                {birthdate || "Selecciona tu fecha de nacimiento"}
              </Text>
              <MaterialCommunityIcons
                name="chevron-down"
                size={24}
                color="#92959f"
                style={styles.pickerChevron}
              />
            </View>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={birthdate ? new Date(birthdate) : new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "spinner"}
              onChange={handleDateChange}
              maximumDate={new Date()}
              locale="es-ES"
            />
          )}

          <View style={AuthStyle.inputContainer}>
            <MaterialCommunityIcons
              name="phone-outline"
              size={24}
              style={AuthStyle.icon}
            />
            <TextInput
              value={phoneNumber} // Vincular al estado phoneNumber
              onChangeText={handlePhoneNumberChange} // Llamar a la función para actualizar el estado
              placeholder="Número de teléfono"
              placeholderTextColor="#92959f"
              selectionColor="#5da5a9"
              keyboardType="phone-pad" // Cambia el teclado a numérico
              maxLength={13} // Limitar a "+569 XXXXXXXX"
              style={AuthStyle.input}
            />
          </View>

          <View style={AuthStyle.inputContainer}>
            <MaterialCommunityIcons
              name="lock-open-outline"
              size={24}
              style={AuthStyle.icon}
            />
            <TextInput
              onChangeText={handlePasswordChange}
              placeholder="Contraseña"
              placeholderTextColor="#92959f"
              secureTextEntry={!showPassword}
              selectionColor="#5da5a9"
              style={AuthStyle.input}
              value={password}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={AuthStyle.showPasswordButton}
            >
              <MaterialCommunityIcons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#92959f"
              />
            </TouchableOpacity>
          </View>
          {passwordError ? (
            <Text style={AuthStyle.errorText}>{passwordError}</Text>
          ) : null}

          <View style={AuthStyle.inputContainer}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={24}
              style={AuthStyle.icon}
            />
            <TextInput
              onChangeText={handleConfirmPasswordChange}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#92959f"
              secureTextEntry={!showPassword}
              selectionColor="#5da5a9"
              style={AuthStyle.input}
              value={confirmPassword}
            />
            {/*  Botón para mostrar/ocultar contraseña  */}
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={AuthStyle.showPasswordButton}
            >
              <MaterialCommunityIcons
                name={showPassword ? "eye-off-outline" : "eye-outline"} // Cambia el ícono
                size={24}
                color="#92959f"
              />
            </TouchableOpacity>
          </View>

          <AuthButton
            text="Finalizar"
            onPress={() =>
              handleSignUp(
                fullName,
                rut,
                email,
                faculty,
                career,
                birthdate,
                phoneNumber,
                password,
                confirmPassword
              )
            }
          />

          <View style={AuthStyle.changeScreenContainer}>
            <Text style={AuthStyle.changeScreenText}>
              ¿Ya tienes una cuenta?
            </Text>
            <SmallAuthButton
              text="Iniciar sesión"
              onPress={() => navigation.replace("Login")}
            />
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  adaptivePickerInput: {
    backgroundColor: "transparent",
    flex: 1,
    marginLeft: 4,
    minWidth: 0,
    paddingRight: 36,
    right: 0,
    width: "100%",
  },
  adaptivePickerItem: {
    fontSize: 15,
  },
  dateInputContainer: {
    height: "auto",
    minHeight: 60,
  },
  dateFieldText: {
    flex: 1,
    flexShrink: 1,
    lineHeight: 20,
    marginLeft: 10,
    minWidth: 0,
    paddingRight: 8,
    width: "auto",
  },
  datePlaceholderText: {
    color: "#92959f",
  },
  pickerFieldContainer: {
    position: "relative",
  },
  pickerChevron: {
    marginRight: 16,
  },
  hiddenPickerOverlay: {
    bottom: 0,
    color: "transparent",
    height: "100%",
    left: 0,
    opacity: 0,
    position: "absolute",
    right: 0,
    top: 0,
    width: "100%",
    zIndex: 2,
  },
});

export default Register;
