import { useState } from "react";

import * as CameraSDK from "expo-camera";
import * as LocationSDK from "expo-location";
import * as SensorsSDK from "expo-sensors";

/***
 * Hook que permite solicitar y obtener los permisos del dispositivo.
 *
 * @returns Objeto con los permisos del dispositivo y funciones para solicitarlos.
 */
const useDevicePermissions = () => {
  // console.log("useDevicePermissions - Cargando hook...");

  const [permissionStatus, setPermissionStatus] = useState({
    camera: false,
    location: false,
    accelerometer: false,
    gyroscope: false
  });

  // Solicitar todos los permisos
  const requestAllPermissionsAsync = async () => {
    console.log("useDevicePermissions/requestAllPermissionsAsync - Pidiendo todos los permisos...");
    try {
      console.log("useDevicePermissions/requestAllPermissionsAsync - Pidiendo permisos de la camara...");
      const cameraStatus = (await CameraSDK.Camera.requestCameraPermissionsAsync()).granted;
      console.log("useDevicePermissions/requestAllPermissionsAsync - Pidiendo permisos del GPS...");
      const locationStatus = (await LocationSDK.requestForegroundPermissionsAsync()).granted;
      console.log("useDevicePermissions/requestAllPermissionsAsync - Pidiendo permisos del acelerometro...");
      const accelerometerStatus = (await SensorsSDK.Accelerometer.requestPermissionsAsync()).granted;
      console.log("useDevicePermissions/requestAllPermissionsAsync - Pidiendo permisos del giroscopio...");
      const gyroscopeStatus = (await SensorsSDK.Gyroscope.requestPermissionsAsync()).granted;
      console.log("useDevicePermissions/requestAllPermissionsAsync - Permisos solicitados, actualizando estado...");
      setPermissionStatus({
        camera: cameraStatus,
        location: locationStatus,
        accelerometer: accelerometerStatus,
        gyroscope: gyroscopeStatus
      });
    } catch (error) {
      console.error("useDevicePermissions/requestAllPermissionsAsync - Error al solicitar los permisos:", error);
    }
  };

  // Obtener los permisos actuales
  const getAllPermissionsAsync = async () => {
    console.log("useDevicePermissions/getAllPermissionsAsync - Obteniendo los permisos actuales...");
    try {
      console.log("useDevicePermissions/getAllPermissionsAsync - Obteniendo permisos de la camara...");
      const cameraStatus = (await CameraSDK.Camera.getCameraPermissionsAsync()).granted;
      console.log("useDevicePermissions/getAllPermissionsAsync - Obteniendo permisos del GPS...");
      const locationStatus = (await LocationSDK.getForegroundPermissionsAsync()).granted;
      console.log("useDevicePermissions/getAllPermissionsAsync - Obteniendo permisos del acelerometro...");
      const accelerometerStatus = (await SensorsSDK.Accelerometer.getPermissionsAsync()).granted;
      console.log("useDevicePermissions/getAllPermissionsAsync - Obteniendo permisos del giroscopio...");
      const gyroscopeStatus = (await SensorsSDK.Gyroscope.getPermissionsAsync()).granted;
      console.log("useDevicePermissions/getAllPermissionsAsync - Permisos obtenidos, actualizando estado...");
      setPermissionStatus({
        camera: cameraStatus,
        location: locationStatus,
        accelerometer: accelerometerStatus,
        gyroscope: gyroscopeStatus
      });
    } catch (error) {
      console.error("useDevicePermissions/getAllPermissionsAsync - Error al obtener los permisos:", error);
    }
  };

  // Si todos los valores del objeto 'permissionStatus' son 'true', entonces retorna 'true'
  const isAllPermissionsGranted = () => {
    return Object.values(permissionStatus).every((value) => value);
  };

  // console.log("useDevicePermissions - Retornando datos...");
  // console.log({
  //   ...permissionStatus,
  //   requestAllPermissionsAsync,
  //   getAllPermissionsAsync,
  //   isAllPermissionsGranted: isAllPermissionsGranted()
  // });
  return {
    ...permissionStatus,
    requestAllPermissionsAsync,
    getAllPermissionsAsync,
    isAllPermissionsGranted: isAllPermissionsGranted()
  };
};

export default useDevicePermissions;
