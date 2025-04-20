import { StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native";

// MARK: Colores

export const primaryColor = "#1084e9";
export const secondaryColor = "#FFBB00";
export const errorColor = "#e01515";
export const disabledColor = "#8b8b8b";

// MARK: Comun

const commonStyles: { container: ViewStyle; text: TextStyle } = {
  container: {
    // backgroundColor: "#ff00ff22", //? TestStyle
    // borderColor: "#ff00ff", //? TestStyle
    // borderWidth: 1, //? TestStyle

    marginVertical: 5,

    display: "flex",
    flexDirection: "column"
  },
  text: {
    // backgroundColor: "#ff000088", //? TestStyle
    // borderColor: "#78d9ff", //? TestStyle
    // borderWidth: 1.0, //? TestStyle

    fontFamily: "Alata",
    top: -1.5
  }
};

// MARK: Contenido

export const contentStyles = StyleSheet.create({
  container: {
    ...commonStyles.container
  },
  containerCentered: {
    ...commonStyles.container,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    ...commonStyles.text,
    fontSize: 20
  }
});

// MARK: Header

const headerHeight = 70;

export const headerStyles = StyleSheet.create({
  container: {
    // borderColor: "#a200ff", //? TestStyle
    // borderWidth: 3, //? TestStyle
    // borderStyle: "dashed", //? TestStyle

    backgroundColor: primaryColor,

    display: "flex",
    flexDirection: "row",

    height: headerHeight, // Usar variable

    zIndex: 10,
    elevation: 10
  },
  spacer: {
    // backgroundColor: "#ff00007a", //? TestStyle
    // borderColor: "#ff00ff", //? TestStyle
    // borderWidth: 0.5, //? TestStyle

    flex: 1
  },
  buttonContainer: {
    // backgroundColor: "#00FF0055", //? TestStyle
    // borderColor: "#00FF00", //? TestStyle
    // borderWidth: 0.5, //? TestStyle

    width: headerHeight, // Usar variable

    justifyContent: "center",
    alignItems: "center"
  },
  logoContainer: {
    // backgroundColor: "#ffff0055", //? TestStyle
    // borderColor: "#ffff00", //? TestStyle
    // borderWidth: 1, //? TestStyle

    width: headerHeight * 3, // Usar variable
    padding: 10,

    marginLeft: 5,

    alignContent: "center",
    justifyContent: "center"
  },
  titleContainer: {
    // backgroundColor: "#aaFF5588", //? TestStyle
    // borderColor: "#ff00ff", //? TestStyle
    // borderWidth: 1.5, //? TestStyle

    flex: 1,
    paddingLeft: 10,

    marginLeft: 5,

    justifyContent: "center"
  },
  text: {
    ...commonStyles.text,
    color: "#ffffff",
    width: "98%",
    fontSize: 25
  }
});

// MARK: Botones

const button_borderRadius = 30;

export const buttonStyles = StyleSheet.create({
  container: {
    // borderColor: "#ff8800", //? TestStyle
    // borderWidth: 3, //? TestStyle
    // borderStyle: "dotted", //? TestStyle

    backgroundColor: primaryColor,

    display: "flex",
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    padding: 15,
    marginVertical: 5,

    height: "auto",
    minHeight: button_borderRadius * 2, // Usar variable
    maxHeight: 80,

    width: 230,
    maxWidth: "100%",

    borderRadius: button_borderRadius, // Usar variable

    elevation: 3
  },
  text: {
    ...commonStyles.text,
    fontSize: 20,
    color: "#ffffff",
    textAlign: "center",
    paddingHorizontal: 10
  },
  icon: {
    // backgroundColor: "#ff00d4ff", //? TestStyle

    color: "#ffffff",
    fontSize: 25
  }
});

// MARK: Tarjetas

export const cardStyles = StyleSheet.create({
  container: {
    // borderColor: "#000000", //? TestStyle
    // borderWidth: 1.5, //? TestStyle

    backgroundColor: "#ffffff",

    display: "flex",
    flexDirection: "column",

    paddingHorizontal: 10,
    paddingVertical: 5,

    marginHorizontal: 10,
    marginVertical: 5,

    borderRadius: 20,

    elevation: 5
  },
  titleText: {
    ...commonStyles.text,

    fontSize: 25
  }
});

// MARK: Entradas

export const inputStyles = StyleSheet.create({
  container: {},
  textInput: {
    backgroundColor: "#ffffff",

    borderColor: primaryColor,
    borderWidth: 2,
    borderRadius: 20,

    paddingHorizontal: 20,
    marginVertical: 5,

    height: 60,
    width: "100%",

    fontSize: 20,
    color: "#000000",

    elevation: 3
  },
  // Estos estilos se aplican cuando el input esta en focus o no
  textInputFocus: {
    borderWidth: 5,
    elevation: 20,
    zIndex: 20,
    borderRadius: 30
  },
  textInputUnfocus: {}
  // ==============
});

// MARK: Modales

export const popupStyles = StyleSheet.create({
  container: {
    // borderColor: "#ff00ff", //? TestStyle
    // borderWidth: 5, //? TestStyle
    // borderStyle: "dotted", //? TestStyle

    backgroundColor: "#000000c0",

    display: "flex",
    flexDirection: "column",
    flex: 1,

    justifyContent: "center",
    alignItems: "stretch"
  }
});
