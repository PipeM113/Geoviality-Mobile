import { useEffect, useState } from "react";
import { StyleSheet, Text, Image, ScrollView, View, Alert, Modal, TouchableOpacity, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { gv_logo_full_back_white } from "@src/constants/imageRoutes";
import { buttonStyles, contentStyles, errorColor, secondaryColor } from "@src/constants/uiStyles";

import useAPIServer from "@src/hooks/utilidades/useAPIServer";
import useCacheManager from "@src/hooks/utilidades/useCacheManager";
import useAPIAuth from "@src/hooks/autenticacion/useAPIAuth";

import BotonFuncion from "@src/components/usables/BotonFuncion";
import BotonNavegacion from "@src/components/usables/BotonNavegacion";
import HeaderNew from "@src/components/estructura/HeaderNew";
import ImagenFondo from "@src/components/estructura/ImagenFondo";
import Tarjeta from "@src/components/estructura/Tarjeta";
import VistaPopUp from "@src/components/estructura/VistaPopUp";
import { router } from "expo-router";

function Home() {
  // console.log("=====================================");
  // console.log("Index - Cargando componente...");

  const [username, setUsername] = useState("...");
  const [nombre, setNombre] = useState("...");
  const [apellido, setApellido] = useState("...");
  const [email, setEmail] = useState("...");

  const [message, setMessage] = useState<string>("");

  const apiAuth = useAPIAuth();
  const apiServer = useAPIServer(undefined, apiAuth.apiAuthClient);
  const cacheManager = useCacheManager();

  const [isModalVisible, setModalVisible] = useState(false);

  const astor_deteccionVelocidad = "deteccionvelocidad";
  const [opcionDeteccionVelocidad, setDeteccionVelocidad] = useState<boolean>(true);

  const astor_avisosDeteccion = "avisosDeteccion";
  const [opcionAvisosDeteccion, setAvisosDeteccion] = useState<boolean>(true);

  const [popupVisible, setPopupVisible] = useState(false);

  const confirmarLogout = () => {
    // Alert.alert(
    //   "Confirmación",
    //   "¿Estás seguro de que deseas cerrar sesión?",
    //   [
    //     {
    //       text: "Cancelar",
    //       style: "cancel"
    //     },
    //     {
    //       text: "Cerrar Sesión",
    //       onPress: handleLogout,
    //       style: "destructive"
    //     }
    //   ],
    //   { cancelable: true }
    // );

    setModalVisible(true);
  };

  const handleLogout = async () => {
    setModalVisible(false);
    await apiAuth.cerrarSesionAsync();
    router.navigate("/login");
  };

  const handleCacheClear = async () => {
    await cacheManager.borrarCache();
    setMessage("Cache Limpiada");
  };

  const renderMessage = () => {
    if (message) {
      return (
        <View style={pageStyles.messageContainer}>
          <Text style={pageStyles.messageText}> {message}</Text>
        </View>
      );
    } else {
      return null;
    }
  };

  const switch_deteccionVelocidad = async (valor: boolean) => {
    const newValue = valor;
    setDeteccionVelocidad(newValue);
    await AsyncStorage.setItem(astor_deteccionVelocidad, JSON.stringify(newValue));
    console.log("Opcion de detección de velocidad guardada:", newValue);
  };

  const switch_avisosDeteccion = async (valor: boolean) => {
    const newValue = valor;
    setAvisosDeteccion(newValue);
    await AsyncStorage.setItem(astor_avisosDeteccion, JSON.stringify(newValue));
    console.log("Opcion de avisos de detección guardada:", newValue);
  };

  const handleReactivatePopup = async () => {
    await AsyncStorage.removeItem("dontShowAgain");
    setPopupVisible(true);
    setMessage("Instrucciones reactivadas");
  };

  useEffect(() => {
    (async () => {
      const data = await apiAuth.getUserData();

      setUsername(data?.username);
      setNombre(data?.nombre);
      setApellido(data?.apellido);
      setEmail(data?.email);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      console.log("Consiguiendo opcion de detección de velocidad...");
      const valorDeteccionVelocidad = await AsyncStorage.getItem(astor_deteccionVelocidad);
      console.log("Opcion de detección de velocidad:", valorDeteccionVelocidad);
      if (valorDeteccionVelocidad) {
        setDeteccionVelocidad(JSON.parse(valorDeteccionVelocidad));
      }

      console.log("Consiguiendo opcion de avisos de detección...");
      const valorAvisosDeteccion = await AsyncStorage.getItem(astor_avisosDeteccion);
      console.log("Opcion de avisos de detección:", valorAvisosDeteccion);
      if (valorAvisosDeteccion) {
        setAvisosDeteccion(JSON.parse(valorAvisosDeteccion));
      }
    })();
  }, []);

  useEffect(() => {
    const checkDontShowAgain = async () => {
      try {
        const value = await AsyncStorage.getItem("dontShowAgain");
        if (value !== "true") {
          setPopupVisible(true);
        }
      } catch (error) {
        console.error("Error reading AsyncStorage:", error);
      }
    };
    checkDontShowAgain();
  }, []);

  // console.log("Index - Renderizando...");
  // console.log("=====================================");
  return (
    <>
      <ImagenFondo>
        <HeaderNew titulo="Ajustes" goBack />
        {renderMessage()}

        <ScrollView>
          <Tarjeta centrado titulo="Acerca de">
            <Image source={gv_logo_full_back_white} style={[pageStyles.logo]} />
            <Text style={contentStyles.text}>Version: {process.env.EXPO_PUBLIC_VERSION} - GroundTech</Text>
          </Tarjeta>

          <Tarjeta centrado titulo="Opciones">
            {/* <BotonFuncion
              texto="Get User Data"
              funcionEjecutar={() => {
                console.log(apiAuth.getUserData());
              }}
              icono="redo"
              style={{ backgroundColor: "#319917" }}
            /> */}
            <BotonNavegacion
              texto="Verificar Permisos"
              destino="/ajustes/verificarPermisos"
              icono="cog"
              style={{ backgroundColor: secondaryColor }}
              textStyle={{ color: "#000000" }}
              iconStyle={{ color: "#000000" }}
            />
            <BotonFuncion
              texto="Limpiar Cache"
              funcionEjecutar={handleCacheClear}
              icono="delete"
              style={{ backgroundColor: errorColor }}
            />
            <BotonFuncion
              texto="Reactivar instrucciones"
              funcionEjecutar={handleReactivatePopup}
              icono="refresh"
              style={{ backgroundColor: secondaryColor }}
              textStyle={{ color: "#000000" }}
              iconStyle={{ color: "#000000" }}
            />
            <View style={pageStyles.switchContainer}>
              <Text style={contentStyles.text}>Limite de Velocidad</Text>
              <Switch onValueChange={switch_deteccionVelocidad} value={opcionDeteccionVelocidad} />
            </View>
            <View style={pageStyles.switchContainer}>
              <Text style={contentStyles.text}>Avisos de detección</Text>
              <Switch onValueChange={switch_avisosDeteccion} value={opcionAvisosDeteccion} />
            </View>
          </Tarjeta>

          <Tarjeta titulo="Sesión actual">
            <Text style={contentStyles.text}>Usuario: {username}</Text>
            <Text style={contentStyles.text}>Nombre: {nombre}</Text>
            <Text style={contentStyles.text}>Apellido: {apellido}</Text>
            <Text style={contentStyles.text}>Email: {email}</Text>

            <View style={{ alignItems: "center" }}>
              <BotonFuncion
                texto="Cerrar Sesion"
                funcionEjecutar={confirmarLogout}
                icono="logout-variant"
                style={{ backgroundColor: errorColor }}
              />
            </View>
          </Tarjeta>
        </ScrollView>
      </ImagenFondo>

      <VistaPopUp esVisible={isModalVisible} onRequestClose={() => setModalVisible(!isModalVisible)}>
        <Tarjeta titulo="⚠️ Cerrando sesión" centrado>
          <Text style={contentStyles.text}>Estas a punto de cerrar sesión.</Text>
          <BotonFuncion texto="Cancelar" funcionEjecutar={() => setModalVisible(!isModalVisible)} />
          <BotonFuncion
            texto="Cerrar Sesion"
            funcionEjecutar={handleLogout}
            icono="logout-variant"
            style={{ backgroundColor: errorColor }}
          />
        </Tarjeta>
      </VistaPopUp>
    </>
  );
}

const pageStyles = StyleSheet.create({
  messageContainer: {
    ...contentStyles.containerCentered,
    backgroundColor: "#000000bb",
    padding: 10,
    marginVertical: 0
  },
  messageText: {
    ...contentStyles.text,
    color: "white"
  },
  logo: {
    // backgroundColor: "#00ff0066", //? TestStyle
    width: "100%",
    height: 100,
    resizeMode: "contain"
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5
  }
});

export default Home;
