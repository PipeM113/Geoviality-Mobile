import { useEffect, useState } from "react";
import { StyleSheet, Text, Image, ScrollView, View } from "react-native";

import { Href, router } from "expo-router";

import { gv_logo_full_back_white, gv_logo_text_mono_white } from "@src/constants/imageRoutes";
import { contentStyles, primaryColor, secondaryColor } from "@src/constants/uiStyles";

import useAPIServer from "@src/hooks/utilidades/useAPIServer";
import useCacheManager from "@src/hooks/utilidades/useCacheManager";
import useAPIAuth from "@src/hooks/autenticacion/useAPIAuth";

import BotonFuncion from "@src/components/usables/BotonFuncion";
import BotonNavegacion from "@src/components/usables/BotonNavegacion";
import HeaderNew from "@src/components/estructura/HeaderNew";
import ImagenFondo from "@src/components/estructura/ImagenFondo";
import Tarjeta from "@src/components/estructura/Tarjeta";
import IconoCargando from "../components/usables/IconoCargando";
import useDevicePermissions from "../hooks/permisos/useDevicePermissions";

function TestingScreen() {
  // console.log("=====================================");
  // console.log("TestingScreen - Cargando componente...");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Conectando...");
  const [thereIsError, setThereIsError] = useState(false);
  const [test, setTest] = useState(0);

  const apiAuth = useAPIAuth(false);

  useEffect(() => {
    console.log("TestingScreen - EFECTO 1 [test]: Verificando autenticacion...");
    setLoading(true);
    setThereIsError(false);

    (async () => {
      await testConexion();
    })();
  }, [test]);

  const testConexion = async () => {
    setMessage("Conectando con el servidor...");
    try {
      const loggedIn = await apiAuth.verificarSesionAsync();
      if (loggedIn) {
        console.log("TestingScreen - EFECTO 1 [test]: Autenticado.");
        setMessage("Autenticado.");
        setTimeout(() => {
          console.log("TestingScreen - EFECTO 1 [test]: Redirigiendo a /home...");
          router.replace("/home");
        }, 1000);
      } else {
        console.log("TestingScreen - EFECTO 1 [test]: No autenticado.");
        setMessage("No autenticado.");
        setTimeout(() => {
          console.log("TestingScreen - EFECTO 1 [test]: Redirigiendo a /login...");
          router.replace("/login");
        }, 1000);
      }
    } catch (error) {
      console.log("TestingScreen - EFECTO 1 [test]: Error:", error);
      setMessage("Error: " + error);
      setLoading(false);
      setThereIsError(true);
    }
  };

  const renderMessage = () => {
    if (message) {
      return <Text style={pageStyles.text}>{message}</Text>;
    } else {
      return null;
    }
  };

  const renderLoading = () => {
    if (loading) {
      return (
        <>
          <Text style={pageStyles.text}>Conectando con el servidor...</Text>
          <IconoCargando size={50} />
        </>
      );
    } else {
      return null;
    }
  };

  const renderButton = () => {
    if (thereIsError) {
      return (
        <BotonFuncion
          texto="Reintentar"
          icono="refresh"
          funcionEjecutar={() => setTest(test + 1)}
          style={{ backgroundColor: secondaryColor }}
          textStyle={{ color: "#000000" }}
          iconStyle={{ color: "#000000" }}
        />
      );
    } else {
      return null;
    }
  };

  // console.log("TestingScreen - Renderizando...");
  // console.log("=====================================");
  return (
    <>
      <View style={pageStyles.container}>
        <Image source={gv_logo_text_mono_white} style={[pageStyles.logo]} />
        {renderLoading()}
        {renderButton()}
      </View>
      <View style={pageStyles.container}>{renderMessage()}</View>
      {/* <BotonNavegacion texto="Ir a Login" destino="/home" /> */}
    </>
  );
}

const pageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: primaryColor,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    ...contentStyles.text,
    color: "white"
  },
  message: {
    ...contentStyles.text,
    backgroundColor: "#ff000033",
    color: "red"
  },
  logo: {
    // backgroundColor: "#00ff0066", //? TestStyle
    width: "50%",
    height: 100,
    resizeMode: "contain"
  }
});

export default TestingScreen;
