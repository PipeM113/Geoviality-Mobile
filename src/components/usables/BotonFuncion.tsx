import { Text, TouchableOpacity, ViewStyle, TextStyle } from "react-native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { buttonStyles, disabledColor } from "@src/constants/uiStyles";

import IconoCargando from "@src/components/usables/IconoCargando";

type Props = {
  texto: string;
  funcionEjecutar: () => void;
  style?: ViewStyle | ViewStyle[];
  icono?: string;
  iconStyle?: TextStyle;
  textStyle?: TextStyle;
  noText?: boolean;
  disabled?: boolean;
  loading?: boolean;
  blocked?: boolean;
};

// TODO: Documentar disabled, loading y blocked
/**
 * Boton que ejecuta una funcion al ser presionado.
 *
 * @param texto - Texto del boton.
 * @param funcionEjecutar - Funcion que se ejecuta al presionar el boton.
 * @param style - Estilos adicionales del boton.
 * @param icono - (Opcional) Icono del boton.
 * @param iconStyle - (Opcional) Estilos adicionales del icono.
 * @param textStyle - (Opcional) Estilos adicionales del texto.
 * @param noText - (Opcional) Si es `true` no muestra el texto del boton.
 * @param disabled - (Opcional) Si es `true` deshabilita el boton (cambiando el color).
 * @param loading - (Opcional) Si es `true` muestra un icono de carga.
 * @param blocked - (Opcional) Si es `true` bloquea el boton (no se puede presionar).
 */
function BotonFuncion(props: Props) {
  // Estilos del boton, dependiendo si esta deshabilitado o no
  const buttonDisabledStyle = props.disabled ? { backgroundColor: disabledColor } : {};

  const buttonFunctionHandler = () => {
    if (!props.disabled && !props.blocked) {
      props.funcionEjecutar();
    }
  };

  const textDisabledStyle = props.disabled ? { color: "#333333" } : {};

  const renderIcon = () => {
    if (props.loading) {
      return <IconoCargando color={textDisabledStyle.color} />;
    }
    if (props.icono) {
      return <Icon name={props.icono} style={[buttonStyles.icon, props.iconStyle, textDisabledStyle]} />;
    } else {
      return null;
    }
  };
  // Fin estilos de boton

  // Renderizado del boton
  const renderButton = () => {
    // Si se especifica un icono, entonces se muestra unicamente el icono
    if (props.icono || props.loading) {
      if (props.noText) {
        // Solo Icono
        return (
          <TouchableOpacity
            onPress={buttonFunctionHandler}
            style={[buttonStyles.container, props.style, buttonDisabledStyle]}
          >
            {renderIcon()}
          </TouchableOpacity>
        );
      } else {
        // Icono + Texto
        return (
          <TouchableOpacity
            onPress={buttonFunctionHandler}
            style={[buttonStyles.container, props.style, buttonDisabledStyle]}
          >
            {renderIcon()}
            <Text style={[buttonStyles.text, props.textStyle, textDisabledStyle]}>{props.texto}</Text>
          </TouchableOpacity>
        );
      }
    } else {
      // Solo Texto
      return (
        <TouchableOpacity
          onPress={buttonFunctionHandler}
          style={[buttonStyles.container, props.style, buttonDisabledStyle]}
        >
          <Text style={[buttonStyles.text, props.textStyle, textDisabledStyle]}>{props.texto}</Text>
        </TouchableOpacity>
      );
    }
  };
  // Fin del renderizado

  return renderButton();
}

export default BotonFuncion;
