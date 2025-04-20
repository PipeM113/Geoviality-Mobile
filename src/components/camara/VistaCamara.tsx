import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { View, Text, StyleSheet } from "react-native";

import * as CameraSDK from "expo-camera/legacy";
import * as FileSystem from "expo-file-system";

import { contentStyles } from "@src/constants/uiStyles";

import BotonFuncion from "@src/components/usables/BotonFuncion";

interface Props {
  noButtons?: boolean;
  onCameraStatusChange?: (status: boolean) => void;
  onPhotoTaken?: (photo: CameraSDK.CameraCapturedPicture) => void;
}

export interface RefVistaCamara {
  toggleCameraPosition: () => void;
  takePictureAsync: () => Promise<void>;
}

/**
 * Componente que muestra la vista de la camara y permite tomar fotos.
 *
 * @param noButtons - Si es `true`, entonces no se muestran los botones de captura y cambio de camara.
 * @param onCameraStatusChange - Funcion que se ejecuta cuando el estado de la camara cambia. Recibe un booleano que indica si la camara esta lista.
 * @param onPhotoTaken - Funcion que se ejecuta cuando se toma una foto. Recibe el objeto foto como parametro.
 * @method toggleCameraPosition - Cambia la posicion de la camara.
 * @method takePictureAsync - Toma una foto con la camara.
 */
const VistaCamara = forwardRef<RefVistaCamara, Props>((props, ref) => {
  // console.log("=====================================");
  // console.log("VistaCamara - Cargando componente...");

  const refCameraView = useRef<CameraSDK.Camera>(null);
  const refCameraResolution = useRef<string>("");

  const [cameraPosition, setCameraPosition] = useState<CameraSDK.CameraType>(CameraSDK.CameraType.back);
  const [isCameraReady, setCameraReady] = useState(false);

  const [cameraPermission, requestCameraPermission] = CameraSDK.Camera.useCameraPermissions();

  useImperativeHandle(ref, () => ({
    toggleCameraPosition: handleCameraPosition,
    takePictureAsync: handleCaptureAsync
  }));

  // useEffect(() => {
  //   // console.log("VistaCamara - EFECTO 1 []: montando...");
  //   return () => {
  //     // console.log("VistaCamara - EFECTO 1 []: limpiando...");
  //   };
  // }, []);

  useEffect(() => {
    // Se ajusta la resolucion de la camara a 1920x1440 solo una vez
    if (isCameraReady && refCameraResolution.current === "") {
      (async () => {
        await configureResolutionAsync(1920, 1440);
      })();
    }

    // console.log("VistaCamara - EFECTO 2 [isCameraReady]: el estado la camara cambió a:", isCameraReady);
    if (props.onCameraStatusChange) {
      props.onCameraStatusChange(isCameraReady);
    }
  }, [isCameraReady]);

  // MARK: Permisos de camara
  if (!cameraPermission) {
    return <View />;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={[contentStyles.containerCentered, { flex: 1 }]}>
        <Text style={contentStyles.text}>Se necesitan permisos de camara.</Text>
        <BotonFuncion texto="Solicitar permiso" funcionEjecutar={requestCameraPermission} icono="cog" />
      </View>
    );
  }

  // Una vez que se tienen los permisos continua desde aqui

  // MARK: Posicion de camara
  function handleCameraPosition() {
    const newPosition =
      cameraPosition === CameraSDK.CameraType.back ? CameraSDK.CameraType.front : CameraSDK.CameraType.back;
    console.log("VistaCamara/handleCameraPosition - Cambiando camara a: ", newPosition);
    setCameraPosition(newPosition);
  }

  // MARK: Ajustar resolucion
  async function configureResolutionAsync(w: number = 1920, h: number = 1440) {
    console.log(`VistaCamara/configureResolution - Ajustando resolucion. Target: ${w}x${h}...`);
    if (refCameraView.current) {
      // Arreglo con todas las resoluciones disponibles
      const availablePictureSizes = await refCameraView.current.getAvailablePictureSizesAsync("4:3");

      // Se filtran las resoluciones para incluir unicamente las que sean menores o iguales a 1920x1440
      const filteredResolutions = availablePictureSizes.filter((resolution) => {
        const [width, height] = resolution.split("x");
        return parseInt(width) <= w && parseInt(height) <= h;
      });

      // Se selecciona la ultima resolucion de la lista, que deberia ser la mas cercana a 1920x1440
      const selectedResolution = filteredResolutions[filteredResolutions.length - 1];
      console.log("VistaCamara/configureResolutionAsync - Resoluciones disponibles:", filteredResolutions);
      console.log("VistaCamara/configureResolutionAsync - Resolucion final:", selectedResolution);
      refCameraResolution.current = selectedResolution;
    } else {
      console.log("VistaCamara/configureResolutionAsync - Camara no lista, no se puede obtener resoluciones.");
    }
  }

  // MARK: Captura de foto
  const captureOptions = {
    quality: 0.5
  };

  async function handleCaptureAsync() {
    // console.log("VistaCamara/handleCapture - Verificando estado...");

    if (refCameraView.current && isCameraReady) {
      // console.log("VistaCamara/handleCapture - Tomando foto... (cambiando estado a no listo)");
      setCameraReady(false);
      try {
        const photo = await refCameraView.current.takePictureAsync(captureOptions);

        if (photo) {
          console.log("VistaCamara/handleCapture - Foto tomada: ", photo.uri);
          console.log("VistaCamara/handleCapture - Dimensiones: ", photo.width, "x", photo.height);

          // Get the file size
          const fileInfo = await FileSystem.getInfoAsync(photo.uri);
          if (fileInfo.exists) {
            console.log("VistaCamara/handleCapture - Tamaño del archivo: ", fileInfo.size / (1024 * 1024), "MB");
          }

          if (props.onPhotoTaken) {
            props.onPhotoTaken(photo);
          }
        }
      } catch (error) {
        console.error("VistaCamara/handleCapture - Error al tomar foto: ", error);
      }
      // console.log("VistaCamara/handleCapture - Cambiando estado de camara a lista...");
      setCameraReady(true);
    } else {
      console.log("VistaCamara/handleCapture - Camara no lista, no se puede tomar foto.");
    }
  }

  // MARK: Camara lista
  function handleCameraReady() {
    // console.log("VistaCamara/onCameraReady - Cambiando estado de camara a lista...");
    setCameraReady(true);
  }

  function renderBotonCaptura() {
    if (isCameraReady) {
      return (
        <BotonFuncion
          texto={"Capturar Foto"}
          funcionEjecutar={handleCaptureAsync}
          noText
          icono="camera"
          style={{ width: 100 }}
        />
      );
    } else {
      return (
        <BotonFuncion texto={"Cargando..."} loading noText disabled funcionEjecutar={() => {}} style={{ width: 100 }} />
      );
    }
  }

  function renderBotones() {
    if (!props.noButtons) {
      return (
        <>
          <View style={{ flex: 1 }}></View>
          <View style={componentStyles.buttonsArea}>
            {renderBotonCaptura()}
            <BotonFuncion
              texto="Cambiar camara"
              funcionEjecutar={handleCameraPosition}
              noText
              icono="orbit-variant"
              style={{ width: 100 }}
            />
          </View>
        </>
      );
    } else {
      return null;
    }
  }

  // console.log("VistaCamara - Renderizando...");
  // console.log("=====================================");
  return (
    <>
      <CameraSDK.Camera
        ref={refCameraView}
        onCameraReady={handleCameraReady}
        style={{ display: "flex", flex: 1, width: "100%" }}
        pictureSize={refCameraResolution.current}
        type={cameraPosition}
      >
        {renderBotones()}
      </CameraSDK.Camera>
    </>
  );
});

const componentStyles = StyleSheet.create({
  buttonsArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00000088"
  }
});

export default VistaCamara;
