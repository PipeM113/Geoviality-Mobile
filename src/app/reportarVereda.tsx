import { useEffect, useState, useRef } from "react";
import { View, Text } from "react-native";

import { CameraCapturedPicture } from "expo-camera";

import { contentStyles } from "@src/constants/uiStyles";

import useGPS from "@src/hooks/sensores/useGPS";
import useAPIServer from "@src/hooks/utilidades/useAPIServer";
import useAPIAuth from "@/src/hooks/autenticacion/useAPIAuth";

import BotonFuncion from "@src/components/usables/BotonFuncion";
import HeaderNew from "@src/components/estructura/HeaderNew";
import ImagenFondo from "@src/components/estructura/ImagenFondo";
import VistaCamara, { RefVistaCamara } from "@src/components/camara/VistaCamara";
import Tarjeta from "@/src/components/estructura/Tarjeta";
import BotonNavegacion from "../components/usables/BotonNavegacion";

function ReportarVereda() {
  // console.log("=====================================");
  // console.log("EnvioDatos - Cargando componente...");

  const refVistaCamara = useRef<RefVistaCamara>(null);

  const [photoUri, setPhotoUri] = useState("");
  const [readyToSend, setReadyToSend] = useState(false);
  const [response, setResponse] = useState<number>();
  const [message, setMessage] = useState("");
  const [capturing, setCapturing] = useState(false);

  const gpsHook = useGPS();
  const useAuth = useAPIAuth();
  const apiServer = useAPIServer(undefined, useAuth.apiAuthClient);

  useEffect(() => {
    // console.log("EnvioDatos - EFECTO 1 [readyToSend]: revisando si esta listo para enviar...");
    (async () => {
      if (readyToSend) {
        // console.log("EnvioDatos - EFECTO 1 [readyToSend]: Enviando datos...");

        const data = {
          ...gpsHook.locationData,
          photoUri,
          modo: "manual"
        };

        console.log("EnvioDatos - EFECTO 1 [readyToSend]: Datos a enviar:", data);

        const res = await apiServer.sendDataAsync(data);
        setReadyToSend(false);
        setResponse(res);
        setMessage(res === 200 ? "Datos enviados" : "Error al enviar datos");
        setCapturing(false);
      } else {
        // console.log("EnvioDatos - EFECTO 1 [readyToSend]: No listo para enviar...");
      }
    })();
  }, [readyToSend]);

  const handlePhotoTaken = (capturedPicture: CameraCapturedPicture) => {
    // console.log("EnvioDatos/HandlePhotoTaken - Foto tomada:", photoUri);
    setPhotoUri(capturedPicture.uri);
  };

  const handleGetLocation = async () => {
    console.log("EnvioDatos/GetLocation - Solicitando ubicacion...");
    try {
      await gpsHook.getCurrentLocationAsync();
      // console.log("EnvioDatos/GetLocation - Ubicacion obtenida:", gpsHook.locationData);
    } catch (error) {
      console.log("EnvioDatos/GetLocation - Error al obtener ubicacion:", error);
    }
  };

  const handleCaptureAsync = async () => {
    console.log("EnvioDatos/TakePicture - Solicitando foto...");
    try {
      await refVistaCamara.current?.takePictureAsync();
    } catch (error) {
      console.log("EnvioDatos/TakePicture - Error al tomar foto:", error);
    }
  };

  const handleCapturingDataAsync = async () => {
    setCapturing(true);
    setMessage("Obteniendo ubicación...");
    await handleGetLocation();
    setMessage("Tomando foto...");
    await handleCaptureAsync();
    setMessage("Enviando datos...");
    setReadyToSend(true);
  };

  const renderSendButton = () => {
    if (!capturing) {
      return <BotonFuncion texto="Enviar Datos" funcionEjecutar={handleCapturingDataAsync} icono="send" />;
    } else {
      return (
        <BotonFuncion texto="Enviar Datos" funcionEjecutar={handleCapturingDataAsync} icono="send" disabled loading />
      );
    }
  };

  const renderMessage = () => {
    if (message) {
      return (
        <>
          <Text style={[contentStyles.text, { color: "#ffffff" }]}>{message}</Text>
        </>
      );
    } else {
      return null;
    }
  };

  // console.log("EnvioDatos - Renderizando...");
  // console.log("=====================================");
  return (
    <>
      <HeaderNew titulo="Reporte en vía peatonal" goBack />
      <ImagenFondo>
        <Tarjeta centrado titulo="¿Que está ocurriendo?">
          <BotonNavegacion
            texto="Acera en mal estado"
            destino="/enviar/vereda/acera"
            icono="image-broken-variant"
            style={{ maxHeight: 150, width: "100%" }}
          />
          <BotonNavegacion
            texto="Poste de luz caído"
            destino="/enviar/vereda/poste"
            icono="outdoor-lamp"
            style={{ maxHeight: 150, width: "100%" }}
          />
          <BotonNavegacion
            texto="Ciclovia en mal estado"
            destino="/enviar/vereda/ciclovia"
            icono="bicycle"
            style={{ maxHeight: 150, width: "100%" }}
          />
          <BotonNavegacion
            texto="Cableado expuesto/colgando"
            destino="/enviar/vereda/cableado"
            icono="lightning-bolt-circle"
            style={{ maxHeight: 150, width: "100%" }}
          />
          <BotonNavegacion
            texto="Basura acumulada"
            destino="/enviar/vereda/basura"
            icono="trash-can"
            style={{ maxHeight: 150, width: "100%" }}
          />
          <BotonNavegacion
            texto="Otro"
            destino="/enviar/vereda/otro"
            icono="shield-alert"
            style={{ maxHeight: 150, width: "100%" }}
          />
        </Tarjeta>
      </ImagenFondo>
    </>
  );
}

export default ReportarVereda;
