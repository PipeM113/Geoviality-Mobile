import { View, Text, Image, StyleSheet } from "react-native";

import { Href } from "expo-router";

import { headerStyles } from "@src/constants/uiStyles";
import { gv_logo_text_color_white } from "@src/constants/imageRoutes";

import BotonNavegacion from "@src/components/usables/BotonNavegacion";

type Props = {
  titulo: string;
  destino?: Href;
  textoBoton?: string;
  goBack?: boolean;
  withLogo?: boolean;
};

// TODO: Documentar withLogo
/***
 * Componente que muestra un header con un titulo y un boton de navegacion.
 *
 * @param titulo - Titulo del header.
 * @param destino - (Opcional) Nombre de la direccion a la que se quiere navegar.
 * @param textoBoton - (Opcional) Texto del boton de navegacion.
 * @param goBack - (Opcional) Si es `true` navega a la pagina anterior.
 * @param withLogo - (Opcional) Si es `true` muestra el logo de la aplicacion.
 */
function HeaderNew(props: Props) {
  // Si se especifica goBack, se muestra el boton de regresar
  if (props.goBack) {
    return (
      <View style={headerStyles.container}>
        <View style={headerStyles.buttonContainer}>
          <BotonNavegacion
            texto="Atras"
            icono="arrow-left"
            goBack
            noText
            style={componentStyles.buttonContainer}
            iconStyle={componentStyles.buttonIcon}
          />
        </View>
        <View style={headerStyles.titleContainer}>
          <Text style={headerStyles.text}>{props.titulo}</Text>
        </View>
      </View>
    );
  }
  // Si se especifica destino, se muestra el boton de navegacion
  if (props.destino) {
    // Si se especifica un texto para el botón, se muestra. Si no, se muestra un boton vacio
    if (props.textoBoton) {
      // Boton con texto + Destino
      return (
        <View style={headerStyles.container}>
          <View style={headerStyles.buttonContainer}>
            <BotonNavegacion texto={props.textoBoton} destino={props.destino} />
          </View>
          <View style={headerStyles.titleContainer}>
            <Text style={headerStyles.text}>{props.titulo}</Text>
          </View>
        </View>
      );
    } else {
      // Boton Con '---' + Destino
      return (
        <View style={headerStyles.container}>
          <View style={headerStyles.buttonContainer}>
            <BotonNavegacion texto="---" destino={props.destino} />
          </View>
          <View style={headerStyles.titleContainer}>
            <Text style={headerStyles.text}>{props.titulo}</Text>
          </View>
        </View>
      );
    }
  } else {
    // Sin destino (Solo titulo)

    if (props.withLogo) {
      return (
        <View style={headerStyles.container}>
          <View style={headerStyles.logoContainer}>
            <Image source={gv_logo_text_color_white} style={componentStyles.headerLogo} />
          </View>
          <View style={headerStyles.spacer} />
          <View style={headerStyles.buttonContainer}>
            <BotonNavegacion
              texto="Ajustes"
              destino={"/ajustes"}
              icono="cog"
              noText
              style={componentStyles.buttonContainer}
            />
          </View>
        </View>
      );
    } else {
      return (
        <View style={headerStyles.container}>
          <View style={headerStyles.titleContainer}>
            <Text style={headerStyles.text}>{props.titulo}</Text>
          </View>
        </View>
      );
    }
  }
}

const componentStyles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "#00000033",
    elevation: 0,
    width: "100%",
    height: "100%",
    borderRadius: 0
  },
  headerLogo: {
    // backgroundColor: "#ff000066", //? TestStyle
    // borderColor: "#ff0000", //? TestStyle
    // borderWidth: 0.5, //? TestStyle

    width: "100%",
    height: "100%",

    resizeMode: "contain"
  },
  buttonIcon: {
    color: "#ffffff",
    fontSize: 35
  }
});

export default HeaderNew;
