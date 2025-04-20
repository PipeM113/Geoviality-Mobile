import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, Image, ScrollView, View, Switch } from "react-native";
import { Href, router } from "expo-router";

import { gv_logo_full_back_white } from "@src/constants/imageRoutes";
import { contentStyles, errorColor, secondaryColor } from "@src/constants/uiStyles";

import useAPIServer from "@src/hooks/utilidades/useAPIServer";
import useCacheManager from "@src/hooks/utilidades/useCacheManager";
import useAPIAuth from "@src/hooks/autenticacion/useAPIAuth";
import useWeatherData from "../hooks/utilidades/useWeatherData";

import BotonFuncion from "@src/components/usables/BotonFuncion";
import BotonNavegacion from "@src/components/usables/BotonNavegacion";
import HeaderNew from "@src/components/estructura/HeaderNew";
import ImagenFondo from "@src/components/estructura/ImagenFondo";
import Tarjeta from "@src/components/estructura/Tarjeta";
import IconoCargando from "@src/components/usables/IconoCargando";
import VistaPopUp from "@src/components/estructura/VistaPopUp";

function Home() {
  // console.log("=====================================");
  // console.log("Home - Cargando componente...");

  const [message, setMessage] = useState("");
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [noMostrarModal, setNoMostrarModal] = useState(false);

  const modalHref = useRef<Href>("/home");

  const apiAuth = useAPIAuth();
  const apiServer = useAPIServer(undefined, apiAuth.apiAuthClient);
  const cacheManager = useCacheManager();
  const weatherClient = useWeatherData();

  const renderMessage = () => {
    if (message) {
      return <Text style={pageStyles.message}>Mensaje: {message}</Text>;
    } else {
      return null;
    }
  };

  const renderOptimalidad = (weatherData: any) => {
    const tamano = 25;

    if (weatherData) {
      if (weatherData.optimalidad === 0) {
        return <Text style={[pageStyles.weatherText, { fontSize: tamano, color: "green" }]}>🟢 Condición: Buena</Text>;
      } else if (weatherData.optimalidad === 1 || weatherData.optimalidad === 2) {
        return (
          <Text style={[pageStyles.weatherText, { fontSize: tamano, color: "#dd7d00" }]}>🟡 Condición: Moderada</Text>
        );
      } else if (weatherData.optimalidad >= 3) {
        return <Text style={[pageStyles.weatherText, { fontSize: tamano, color: "red" }]}>🔴 Condición: Mala</Text>;
      }
    } else {
      return <Text style={[pageStyles.weatherText, { fontSize: tamano }]}>⚫ Condición: ...</Text>;
    }
  };

  const renderLoadingIcon = () => {
    if (loadingWeather) {
      return (
        <View style={pageStyles.weatherLoadingIcon}>
          <IconoCargando color="black" size={pageStyles.weatherLoadingIcon.width} />
        </View>
      );
    } else {
      return null;
    }
  };

  const handleLoadWeatherData = async () => {
    setLoadingWeather(true);
    const respuesta = await weatherClient.getWeatherData();
    setLoadingWeather(false);
    console.log("Home - Clima:", respuesta);
  };

  const handleBeforeNavigate = () => {
    if (!noMostrarModal && weatherClient.weatherData) {
      if (weatherClient.weatherData.optimalidad !== 0) {
        setModalVisible(true);
      } else {
        router.navigate(modalHref.current);
      }
    } else {
      router.navigate(modalHref.current);
    }
  };

  const handleNavigate = () => {
    setModalVisible(false);
    router.navigate(modalHref.current);
  };

  useEffect(() => {
    handleLoadWeatherData();
  }, []);

  // console.log("Home - Renderizando...");
  // console.log("=====================================");
  return (
    <>
      <ImagenFondo>
        <HeaderNew titulo="Inicio" withLogo />

        <ScrollView>
          {renderMessage()}
          {/* <Tarjeta centrado>
            <Image source={gv_logo_full_back_white} style={[pageStyles.logo]} />
            <Text style={contentStyles.text}>Version: {process.env.EXPO_PUBLIC_VERSION} - GroundTech</Text>
          </Tarjeta> */}
          <Tarjeta titulo="Clima">
            <View style={pageStyles.weatherTextContainer}>
              <Text style={pageStyles.weatherText}>
                Hora: {weatherClient.weatherData ? weatherClient.getFechaActualString(true) : "..."}
              </Text>
              <Text style={pageStyles.weatherText}>
                Amanecer: ☀️ {weatherClient.weatherData ? weatherClient.getAmanecerString() : "..."}
              </Text>
            </View>
            <View style={pageStyles.weatherTextContainer}>
              <Text style={pageStyles.weatherText}>
                Clima: {weatherClient.weatherData ? weatherClient.getClimaString() : "..."}
              </Text>
              <Text style={pageStyles.weatherText}>
                Atardecer: 🌙 {weatherClient.weatherData ? weatherClient.getAtardecerString() : "..."}
              </Text>
            </View>
            <View style={[pageStyles.weatherTextContainer, { justifyContent: "center" }]}>
              {renderOptimalidad(weatherClient.weatherData)}
            </View>
            <BotonFuncion
              texto="Actualizar Clima"
              funcionEjecutar={handleLoadWeatherData}
              icono="refresh"
              style={[
                pageStyles.weatherButton,
                { position: "absolute", top: -45, right: 130, backgroundColor: secondaryColor }
              ]}
              iconStyle={{ position: "absolute", top: 7, left: 7, color: "#000000" }}
            />
            <BotonNavegacion
              texto="Mas info"
              destino="/clima"
              icono="information"
              style={[pageStyles.weatherButton, { position: "absolute", top: -45, right: -4, width: 120 }]}
              iconStyle={{ position: "absolute", top: 7, left: 7 }}
              textStyle={{ position: "absolute", top: 2, left: 25 }}
            />
            {renderLoadingIcon()}
          </Tarjeta>

          <Tarjeta centrado titulo="Seleccione una opción">
            <BotonFuncion
              texto="Envio Manual"
              funcionEjecutar={() => {
                modalHref.current = "/enviar/manual";
                handleBeforeNavigate();
              }}
              icono="camera"
              style={{ maxHeight: 150, height: 150, width: "100%" }}
            />
            <BotonFuncion
              texto="Envio Automático"
              funcionEjecutar={() => {
                modalHref.current = "/enviar/auto";
                handleBeforeNavigate();
              }}
              icono="car"
              style={{ maxHeight: 150, height: 150, width: "100%" }}
            />
            <BotonFuncion
              texto="Reporte en vía peatonal"
              funcionEjecutar={() => {
                modalHref.current = "/reportarVereda";
                handleBeforeNavigate();
              }}
              icono="shield-alert"
              style={{ maxHeight: 150, width: "100%", backgroundColor: secondaryColor }}
              textStyle={{ color: "#000000" }}
              iconStyle={{ color: "#000000" }}
            />

            {/* <BotonNavegacion texto="Cámara" destino="/sensores/camara" icono="camera" />
            <BotonNavegacion texto="GPS" destino="/sensores/gps" icono="map-marker" />

            <BotonNavegacion texto="Component Testing" destino="/componentTest" icono="test-tube" /> */}

            {/* <BotonFuncion
              texto="Probar Conexion"
              funcionEjecutar={async () => {
                setMessage("Enviando datos de prueba...");
                const respuesta = await apiServer.testSendFileAsync("https://i.imgur.com/2nCt3Sbl.jpg");
                setMessage(respuesta.toString());
              }}
              icono="wifi"
              style={{ backgroundColor: secondaryColor }}
              textStyle={{ color: "#000000" }}
              iconStyle={{ color: "#000000" }}
            /> */}
          </Tarjeta>
        </ScrollView>
      </ImagenFondo>

      <VistaPopUp esVisible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <Tarjeta centrado titulo="⚠️ Advertencia">
          <Text style={contentStyles.text}>Las condiciones del clima no son óptimas para capturar imágenes.</Text>
          <View style={{ height: 20 }} />
          <Text style={[contentStyles.text, { color: errorColor }]}>
            La calidad de la captura puede verse afectada negativamente.
          </Text>
          <View style={{ height: 20 }} />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text style={contentStyles.text}>No volver a mostrar</Text>
            <Switch
              value={noMostrarModal}
              onValueChange={(value) => {
                setNoMostrarModal(value);
              }}
            />
          </View>
          <BotonFuncion
            texto="Mas detalles"
            funcionEjecutar={() => {
              modalHref.current = "/clima";
              handleNavigate();
            }}
            icono="information"
            style={{ backgroundColor: secondaryColor, width: "100%" }}
            textStyle={{ color: "#000000" }}
            iconStyle={{ color: "#000000" }}
          />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%"
            }}
          >
            <BotonFuncion texto="Cancelar" funcionEjecutar={() => setModalVisible(false)} style={{ width: "48%" }} />
            <BotonFuncion
              texto="Continuar"
              funcionEjecutar={handleNavigate}
              icono="skip-next"
              style={{ width: "48%" }}
            />
          </View>
        </Tarjeta>
      </VistaPopUp>
    </>
  );
}

const pageStyles = StyleSheet.create({
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
  },
  weatherTextContainer: {
    // backgroundColor: "#00000033", //? TestStyle

    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },
  weatherText: {
    ...contentStyles.text,
    fontSize: 18
  },
  weatherButton: {
    width: 40,
    minWidth: 40,

    height: 40,
    minHeight: 40
  },
  weatherLoadingIcon: {
    // backgroundColor: "#ff00ff44", //? TestStyle

    position: "absolute",
    bottom: -5,
    right: -5,

    width: 40,
    height: 40
  }
});

export default Home;
