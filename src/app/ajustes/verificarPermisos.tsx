import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";

import * as CameraSDK from "expo-camera";

import { contentStyles } from "@src/constants/uiStyles";

import useDisableBackButton from "@src/hooks/utilidades/useDisableBackButton";
import useDevicePermissions from "@src/hooks/permisos/useDevicePermissions";

import BotonFuncion from "@src/components/usables/BotonFuncion";
import BotonNavegacion from "@src/components/usables/BotonNavegacion";
import HeaderNew from "@src/components/estructura/HeaderNew";
import ImagenFondo from "@src/components/estructura/ImagenFondo";
import Tarjeta from "@src/components/estructura/Tarjeta";

function VerificarPermisos() {
  // console.log("=====================================");
  // console.log("VerificarPermisos - Cargando componente...");

  useDisableBackButton();
  const devicePermissions = useDevicePermissions();

  useEffect(() => {
    console.log("VerificarPermisos - EFECTO 1 []: ejecutando... Obteniendo permisos...");
    devicePermissions.getAllPermissionsAsync();

    return () => {
      console.log("VerificarPermisos - EFECTO 1 []: limpiando...");
    };
  }, []);

  // Si no se han otorgado todos los permisos aun, se muestra un boton para solicitarlos
  // Si ya se otorgaron todos los permisos, se muestra un boton para continuar a la pantalla principal
  const renderActionButton = () => {
    if (!devicePermissions.isAllPermissionsGranted) {
      return (
        <>
          <BotonFuncion
            texto="Solicitar Permisos"
            funcionEjecutar={devicePermissions.requestAllPermissionsAsync}
            style={{ maxHeight: 1000, height: 100, width: "100%", backgroundColor: "orange" }}
            icono="cog"
          />
        </>
      );
    } else {
      return (
        <>
          <BotonNavegacion
            texto="Continuar"
            goBack
            style={{ maxHeight: 1000, height: 100, width: "100%", backgroundColor: "green" }}
            icono="check"
          />
        </>
      );
    }
  };

  // console.log("VerificarPermisos - Renderizando componente...");
  // console.log("=====================================");
  return (
    <>
      <ImagenFondo>
        <HeaderNew titulo="Verificar Permisos" />
        <Tarjeta>
          <Text style={[contentStyles.text, { marginBottom: 30 }]}>
            Se requieren permisos para el buen funcionamiento de la aplicación.
          </Text>
          <Text style={contentStyles.text}>Estado de los permisos:</Text>
          <Text
            style={[
              contentStyles.text,
              devicePermissions.camera ? pageStyles.permissionsGranted : pageStyles.permissionsDenied
            ]}
          >
            Camara: {devicePermissions.camera ? "Listo" : "Sin permisos"}
          </Text>
          <Text
            style={[
              contentStyles.text,
              devicePermissions.location ? pageStyles.permissionsGranted : pageStyles.permissionsDenied
            ]}
          >
            GPS: {devicePermissions.location ? "Listo" : "Sin permisos"}
          </Text>
          <Text
            style={[
              contentStyles.text,
              devicePermissions.accelerometer ? pageStyles.permissionsGranted : pageStyles.permissionsDenied
            ]}
          >
            Acelerometro: {devicePermissions.accelerometer ? "Listo" : "Sin permisos"}
          </Text>
          <Text
            style={[
              contentStyles.text,
              devicePermissions.gyroscope ? pageStyles.permissionsGranted : pageStyles.permissionsDenied
            ]}
          >
            Giroscopio: {devicePermissions.gyroscope ? "Listo" : "Sin permisos"}
          </Text>
          <Text
            style={[
              contentStyles.text,
              devicePermissions.isAllPermissionsGranted ? pageStyles.permissionsGranted : pageStyles.permissionsDenied
            ]}
          >
            Todos los permisos: {devicePermissions.isAllPermissionsGranted ? "Listo" : "No Listo"}
          </Text>
          <CameraSDK.CameraView style={{ width: 100, height: 100 }} />
          {renderActionButton()}
        </Tarjeta>
      </ImagenFondo>
    </>
  );
}

const pageStyles = StyleSheet.create({
  permissionsGranted: {
    color: "green"
  },
  permissionsDenied: {
    color: "red"
  }
});

export default VerificarPermisos;
