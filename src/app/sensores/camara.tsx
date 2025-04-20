import { useState, useRef } from "react";
import { Text, View, Image } from "react-native";

import * as CameraSDK from "expo-camera";

import { contentStyles } from "@src/constants/uiStyles";

import BotonFuncion from "@src/components/usables/BotonFuncion";
import HeaderNew from "@src/components/estructura/HeaderNew";
import ImagenFondo from "@src/components/estructura/ImagenFondo";
import VistaCamara, { RefVistaCamara } from "@src/components/camara/VistaCamara";

function PaginaCamara() {
  // console.log("=====================================");
  // console.log("PaginaCamara - Cargando componente...");

  const refVistaCamara = useRef<RefVistaCamara>(null);

  const [cameraStatus, setCameraStatus] = useState(false);
  const [fileUri, setFileUri] = useState<string | null>(null);

  const handleCameraPosition = () => {
    console.log("PaginaCamara/handleCameraPosition - Cambiando camara...");
    refVistaCamara.current?.toggleCameraPosition();
  };

  const handleCaptureAsync = async () => {
    console.log("PaginaCamara/handleCapture - Capturando imagen...");
    await refVistaCamara.current?.takePictureAsync();
  };

  const handleCameraStatusChange = (status: boolean) => {
    console.log("PaginaCamara/handleCameraStatusChange - Cambio de estado de la camara a:", status);
    setCameraStatus(status);
  };

  const handlePhotoTaken = (photo: CameraSDK.CameraCapturedPicture) => {
    console.log("PaginaCamara/handlePhotoTaken - Foto tomada: ", photo);
    setFileUri(photo.uri);
  };

  const renderImageTaken = () => {
    if (!fileUri) {
      return null;
    }

    return <Image source={{ uri: fileUri }} style={{ flex: 1 }} />;
  };

  // console.log("PaginaCamara - Renderizando...");
  // console.log("=====================================");
  return (
    <>
      <HeaderNew titulo="Cámara" goBack />
      <ImagenFondo>
        <View style={[contentStyles.containerCentered, { height: 150 }]}>
          <Text style={contentStyles.text}>Estado de la camara: {cameraStatus ? "Listo" : "No listo"}</Text>
          <BotonFuncion texto="Cambiar camara" funcionEjecutar={handleCameraPosition} />
          <BotonFuncion texto="Capturar" funcionEjecutar={handleCaptureAsync} />
        </View>
        <VistaCamara
          ref={refVistaCamara}
          onCameraStatusChange={handleCameraStatusChange}
          onPhotoTaken={handlePhotoTaken}
          noButtons
        />
        {renderImageTaken()}
      </ImagenFondo>
    </>
  );
}

export default PaginaCamara;
