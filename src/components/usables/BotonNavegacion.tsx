import { Text, TouchableOpacity, ViewStyle, TextStyle } from "react-native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Href, router } from "expo-router";

import { buttonStyles } from "@src/constants/uiStyles";

interface Props {
  texto: string;
  destino?: Href;
  goBack?: boolean;
  icono?: string;
  style?: ViewStyle | ViewStyle[];
  iconStyle?: TextStyle;
  textStyle?: TextStyle;
  noText?: boolean;
}

/**
 * Boton que permite ir a una URL especifica o regresar a la pagina anterior.
 *
 * @param texto - Texto del boton.
 * @param destino - (Opcional) Nombre de la direccion a la que se quiere navegar.
 * @param goBack - (Opcional) Si es `true` navega a la pagina anterior.
 * @param icono - (Opcional) Icono del boton.
 * @param style - (Opcional) Estilos adicionales del boton.
 * @param iconStyle - (Opcional) Estilos adicionales del icono.
 * @param textStyle - (Opcional) Estilos adicionales del texto.
 * @param noText - (Opcional) Si es `true` no muestra el texto del boton.
 */
function BotonNavegacion(props: Props) {
  const handleNavigation = () => {
    if (!props.destino || props.goBack) {
      console.log("BotonNavegacion - Navegando atras");
      router.back();
    } else {
      console.log("BotonNavegacion - Navegando a: ", props.destino);
      router.navigate(props.destino);
    }
  };

  const renderButton = () => {
    // Si se especifica un icono, entonces se muestra unicamente el icono
    if (props.icono) {
      if (props.noText) {
        // Solo Icono
        return (
          <TouchableOpacity onPress={handleNavigation} style={[buttonStyles.container, props.style]}>
            <Icon name={props.icono} style={[buttonStyles.icon, props.iconStyle]} />
          </TouchableOpacity>
        );
      } else {
        // Icono + Texto
        return (
          <TouchableOpacity onPress={handleNavigation} style={[buttonStyles.container, props.style]}>
            <Icon name={props.icono} style={[buttonStyles.icon, props.iconStyle]} />
            <Text style={[buttonStyles.text, props.textStyle]}>{props.texto}</Text>
          </TouchableOpacity>
        );
      }
    } else {
      // Solo Texto
      return (
        <TouchableOpacity onPress={handleNavigation} style={[buttonStyles.container, props.style]}>
          <Text style={[buttonStyles.text, props.textStyle]}>{props.texto}</Text>
        </TouchableOpacity>
      );
    }
  };

  return renderButton();
}

export default BotonNavegacion;
