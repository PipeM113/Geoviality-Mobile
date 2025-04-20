import { useEffect, useState, useRef } from "react";
import { View, Text } from "react-native";

import { CameraCapturedPicture } from "expo-camera";
import { useLocalSearchParams } from "expo-router";

import { contentStyles } from "@src/constants/uiStyles";

import useGPS from "@src/hooks/sensores/useGPS";
import useAPIServer from "@src/hooks/utilidades/useAPIServer";
import useAPIAuth from "@/src/hooks/autenticacion/useAPIAuth";

import BotonFuncion from "@src/components/usables/BotonFuncion";
import HeaderNew from "@src/components/estructura/HeaderNew";
import ImagenFondo from "@src/components/estructura/ImagenFondo";
import VistaCamara, { RefVistaCamara } from "@src/components/camara/VistaCamara";

function EnvioVereda() {
  // console.log("=====================================");
  // console.log("EnvioDatos - Cargando componente...");

  const { tipoReporte } = useLocalSearchParams();
  const tipoTitulo = tipoReporte.toString().charAt(0).toUpperCase() + tipoReporte.toString().slice(1);

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
          modo: "manual",
          tipo: tipoReporte as string //! OOPS
        };

        console.log("EnvioDatos - EFECTO 1 [readyToSend]: Datos a enviar:", data);

        const res = await apiServer.sendDataVeredaAsync(data);
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
    setMessage("Tomando foto...");
    await handleCaptureAsync();
    setMessage("Obteniendo ubicación...");
    await handleGetLocation();
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
      <HeaderNew titulo={"Reporte: " + tipoTitulo} goBack />
      <ImagenFondo>
        <View style={{ display: "flex", flex: 1 }}>
          <VistaCamara ref={refVistaCamara} noButtons onPhotoTaken={handlePhotoTaken} />
          <View
            style={[
              contentStyles.containerCentered,
              {
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                marginHorizontal: 0,
                marginVertical: 0,
                backgroundColor: "#00000088"
              }
            ]}
          >
            {renderSendButton()}
            {renderMessage()}
          </View>
        </View>
      </ImagenFondo>
    </>
  );
}

export default EnvioVereda;
