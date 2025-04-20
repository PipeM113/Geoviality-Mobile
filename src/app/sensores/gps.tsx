import { useState } from "react";
import { View, StyleSheet, Text } from "react-native";

import useGPS from "@src/hooks/sensores/useGPS";

import { contentStyles } from "@src/constants/uiStyles";

import BotonFuncion from "@src/components/usables/BotonFuncion";
import HeaderNew from "@src/components/estructura/HeaderNew";
import ImagenFondo from "@src/components/estructura/ImagenFondo";

export default function GPS() {
  // console.log("=====================================");
  // console.log("GPS - Cargando componente...");

  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(true);

  const gpsHook = useGPS();

  const obtenerDatos = async () => {
    console.log("GPS/ObtenerDatos - Obteniendo datos... Cambiando estado a 'No listo'");
    setMessage("Esperando ubicacion...");
    setReady(false);

    try {
      await gpsHook.getCurrentLocationAsync();
      console.log("GPS/ObtenerDatos - Datos obtenidos. Cambiando estado a 'Listo'");
      setMessage("");
      setReady(true);
    } catch (error) {
      console.log("GPS/ObtenerDatos - Error al obtener datos:", error);
      setMessage("Error al obtener ubicación");
      setReady(true);
    }
  };

  const suscribirse = async () => {
    console.log("GPS/Suscribirse - Suscribiendose a ubicacion...");

    await gpsHook.enableLocationSubscriptionAsync();
  };

  const desuscribirse = async () => {
    console.log("GPS/Desuscribirse - Desuscribiendose de ubicacion...");

    await gpsHook.disableLocationSubscriptionAsync();
  };

  const renderMessage = () => {
    if (message) {
      return <Text style={pageStyles.message}>{message}</Text>;
    } else {
      return null;
    }
  };

  const renderButton = () => {
    if (ready) {
      return <BotonFuncion texto="Obtener Ubicacion" funcionEjecutar={obtenerDatos} icono="download" />;
    } else {
      return null;
    }
  };

  // console.log("GPS - Renderizando...");
  // console.log("=====================================");
  return (
    <>
      <HeaderNew titulo="GPS" goBack />
      <ImagenFondo>
        <View style={[contentStyles.containerCentered, { flex: 1 }]}>
          <Text style={contentStyles.text}>{gpsHook.isSubscribed ? "Suscripcion Activa" : "Suscripcion Inactiva"}</Text>
          <Text style={contentStyles.text}>LATITUD: {gpsHook.locationData.latitude}</Text>
          <Text style={contentStyles.text}>LONGITUD: {gpsHook.locationData.longitude}</Text>
          <Text style={contentStyles.text}>TIME: {gpsHook.locationData.timestamp}</Text>
          <BotonFuncion texto="Suscribirse" funcionEjecutar={suscribirse} icono="map-marker" />
          <BotonFuncion
            texto="Desuscribirse"
            funcionEjecutar={desuscribirse}
            icono="close"
            style={{ backgroundColor: "#aa0000" }}
          />
          {renderButton()}
          {renderMessage()}
        </View>
      </ImagenFondo>
    </>
  );
}

const pageStyles = StyleSheet.create({
  message: {
    ...contentStyles.text,
    marginTop: 20,
    color: "red"
  }
});
