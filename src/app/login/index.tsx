import { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, Image, View, TextInput, Alert } from "react-native";

import { router } from "expo-router";

import { gv_logo_full_back_white } from "@src/constants/imageRoutes";
import { contentStyles, primaryColor } from "@src/constants/uiStyles";

import useAPIAuth from "@/src/hooks/autenticacion/useAPIAuth";
import useDisableBackButton from "@/src/hooks/utilidades/useDisableBackButton";

import BotonFuncion from "@src/components/usables/BotonFuncion";
import Tarjeta from "@src/components/estructura/Tarjeta";
import EntradaUsuario from "@src/components/usables/EntradaUsuario";
import BotonNavegacion from "@/src/components/usables/BotonNavegacion";
import VistaPopUp from "@/src/components/estructura/VistaPopUp";

function Login() {
  // console.log("=====================================");
  // console.log("Login - Cargando componente...");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const apiAuth = useAPIAuth(false);
  useDisableBackButton();

  useEffect(() => {
    console.log("Login - EFECTO 1 []: Verificando autenticacion...");
    (async () => {
      setLoading(true);
      try {
        const loggedIn = await apiAuth.verificarSesionAsync();
        if (loggedIn) {
          console.log("Login - EFECTO 1 []: Autenticado.");
          setLoading(false);
          router.navigate("/");
        } else {
          console.log("Login - EFECTO 1 []: No autenticado.");
          setLoading(false);
        }
      } catch (error: Error | any) {
        setMessage(error.message);
        setLoading(false);
      }
      usernameRef.current?.focus();
    })();
  }, []);

  const usernameRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    if (username === "" || password === "") {
      alert("Por favor, complete todos los campos.");
      usernameRef.current?.focus();
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const loggedIn = await apiAuth.iniciarSesionAsync(username, password);

      if (loggedIn) {
        console.log("Login - Inicio de sesion correcto.");
        setLoading(false);
        router.navigate("/");
      } else {
        console.log("Login - Inicio de sesion incorrecto.");
        setLoading(false);
        setMessage("Usuario o contraseña incorrectos.");
      }
    } catch (error: Error | any) {
      console.log("Login - Error al iniciar sesion:", error);
      setLoading(false);
      setMessage(error.message);
      usernameRef.current?.focus();
    }
  };

  function renderButton() {
    if (loading) {
      return <BotonFuncion texto="Iniciar sesion" icono="key" funcionEjecutar={handleLogin} disabled loading />;
    } else {
      return <BotonFuncion texto="Iniciar sesion" icono="key" funcionEjecutar={handleLogin} />;
    }
  }

  function renderMessage() {
    if (message) {
      return <Text style={pageStyles.message}>{message}</Text>;
    } else {
      return null;
    }
  }

  // console.log("Login - Renderizando...");
  // console.log("=====================================");
  return (
    <>
      <View style={pageStyles.rootContainer}>
        <View style={{ flex: 7, justifyContent: "center" }}>
          <Tarjeta centrado>
            <Image source={gv_logo_full_back_white} style={[pageStyles.logo]} />
            <Text style={contentStyles.text}>Version: {process.env.EXPO_PUBLIC_VERSION} - GroundTech</Text>
          </Tarjeta>
          <Tarjeta titulo="Iniciar sesion" centrado>
            {renderMessage()}
            <EntradaUsuario
              placeholder="Usuario"
              valor={username}
              onChangeText={setUsername}
              ref={usernameRef}
              despuesDeEnviar={() => passwordRef.current?.focus()}
            />
            <EntradaUsuario
              placeholder="Contraseña"
              valor={password}
              onChangeText={setPassword}
              esContrasena
              ref={passwordRef}
              despuesDeEnviar={handleLogin}
            />
            {renderButton()}
          </Tarjeta>
        </View>
        {/* <BotonNavegacion texto="home" destino="/home" /> */}
      </View>
    </>
  );
}

const pageStyles = StyleSheet.create({
  rootContainer: {
    backgroundColor: primaryColor,
    height: "100%",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"
  },
  message: {
    ...contentStyles.text,
    backgroundColor: "#ff000033",
    color: "red"
  },
  logo: {
    // backgroundColor: "#00ff0066", //? TestStyle
    width: "100%",
    height: 100,
    resizeMode: "contain"
  }
});

export default Login;
