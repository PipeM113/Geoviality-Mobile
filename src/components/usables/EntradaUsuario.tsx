import React, { ForwardedRef, forwardRef, useState } from "react";
import { TextInput, View, StyleSheet } from "react-native";

import { inputStyles, primaryColor } from "@src/constants/uiStyles";

type Props = {
  placeholder: string;
  valor: string;
  onChangeText: (text: string) => void;
  esContrasena?: boolean;
  despuesDeEnviar?: () => void;
};

type RefEntradaUsuario = TextInput;

// TODO: Documentar esto
/**
 * Componente de entrada de texto para el usuario.
 *
 * @param placeholder - Texto de ayuda para el usuario.
 * @param valor - Valor actual del texto.
 * @param onChangeText - Funcion para actualizar el valor del texto.
 * @param esContrasena - (Opcional) Si es `true` oculta el texto.
 * @param despuesDeEnviar - (Opcional) Funcion a ejecutar despues de enviar el texto.
 */
const EntradaUsuario = forwardRef<RefEntradaUsuario, Props>((props, ref) => {
  const [isInputFocused, setInputFocus] = useState(false);

  return (
    <TextInput
      style={[
        inputStyles.textInput,
        isInputFocused ? inputStyles.textInputFocus : inputStyles.textInputUnfocus,
        props.esContrasena ? componentStyles.passwordStyle : {}
      ]}
      placeholder={props.placeholder}
      value={props.valor}
      onChangeText={props.onChangeText}
      onFocus={() => setInputFocus(true)}
      onBlur={() => setInputFocus(false)}
      secureTextEntry={props.esContrasena}
      onSubmitEditing={props.despuesDeEnviar}
      ref={ref}
    />
  );
});

const componentStyles = StyleSheet.create({
  passwordStyle: {
    fontFamily: "monospace",
    fontSize: 18
  }
});

export default EntradaUsuario;
