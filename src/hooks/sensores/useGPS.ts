import { useState, useEffect, useRef } from "react";

import * as LocationSDK from "expo-location";

/**
 * Hook personalizado para gestionar la funcionalidad del GPS.
 *
 * @returns Un objeto que contiene las siguientes propiedades y funciones:
 *   - `getCurrentLocationAsync`: Una función para actualizar la ubicación actual a demanda.
 *   - `enableLocationSubscriptionAsync`: Una función para habilitar la suscripción a la ubicación del GPS.
 *   - `disableLocationSubscriptionAsync`: Una función para deshabilitar la suscripción a la ubicación del GPS.
 *   - `locationData`: Un objeto que representa los datos de ubicación actuales, con propiedades `latitude`, `longitude` y `timestamp`.
 *   - `isSubscribed`: Un booleano que indica si la suscripción a la ubicación del GPS está habilitada.
 */
function useGPS() {
  // console.log("useGPS - Cargando hook...");

  const locationSubscription = useRef<LocationSDK.LocationSubscription | null>(null);

  const [locationData, setLocationData] = useState({ latitude: 0, longitude: 0, timestamp: 0 });
  const [actualSpeed, setActualSpeed] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const resetLocationData = () => {
    setLocationData({ latitude: 0, longitude: 0, timestamp: 0 });
    setActualSpeed(0);
  };

  const requestLocationPermissionsAsync = async () => {
    // console.log("useGPS/requestLocationPermissions - Solicitando permisos de ubicación...");
    const { status } = await LocationSDK.requestForegroundPermissionsAsync();
    if (status !== LocationSDK.PermissionStatus.GRANTED) {
      throw new Error("No se han otorgado permisos de ubicación.");
    }
  };

  const enableLocationSubscriptionAsync = async () => {
    console.log("useGPS/enableLocationSubscription - Reiniciando datos de ubicación...");
    resetLocationData();

    console.log("useGPS/enableLocationSubscription - Habilitando suscripción...");
    await requestLocationPermissionsAsync();

    if (isSubscribed) {
      console.log("useGPS/enableLocationSubscription - Ya está suscrito. Ignorando...");
    } else {
      // console.log("useGPS/enableLocationSubscription - Suscribiendo al GPS...");

      const subscription = await LocationSDK.watchPositionAsync(
        {
          accuracy: LocationSDK.Accuracy.Highest,
          timeInterval: 5000,
          distanceInterval: 1
        },
        (currentLocation) => {
          // Empaquetar datos de ubicación
          const newLocationData = {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            timestamp: currentLocation.timestamp
          };

          console.log("useGPS/enableLocationSubscription - Nueva ubicación... (cambiando estado)");
          setLocationData(newLocationData);
          setActualSpeed(currentLocation.coords.speed || 0);
        }
      );

      setIsSubscribed(true);
      locationSubscription.current = subscription;
      console.log("useGPS/enableLocationSubscription - GPS suscrito. (Cambiando estado)");
    }
  };

  const disableLocationSubscriptionAsync = async () => {
    console.log("useGPS/disableLocationSubscription - Deshabilitando suscripción...");

    if (locationSubscription.current) {
      // console.log("useGPS/disableLocationSubscription - Desuscribiendo GPS...");
      locationSubscription.current.remove();
      setIsSubscribed(false);
      locationSubscription.current = null;
      console.log("useGPS/disableLocationSubscription - GPS desuscrito. (cambiando estado)");
    } else {
      console.log("useGPS/disableLocationSubscription - No está suscrito. Ignorando...");
    }
  };

  const getCurrentLocationAsync = async () => {
    console.log("useGPS/getCurrentLocationAsync - Obteniendo ubicación...");

    // Solicitar permisos de ubicación
    await requestLocationPermissionsAsync();

    // Obtener ubicación actual
    const currentLocation = await LocationSDK.getCurrentPositionAsync({
      accuracy: LocationSDK.Accuracy.High
    });

    // Empaquetar datos de ubicación
    const newLocationData = {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      timestamp: currentLocation.timestamp
    };

    console.log("useGPS/getCurrentLocationAsync - Actualizando datos de ubicación... (cambiando estado)");
    setLocationData(newLocationData);
    setActualSpeed(currentLocation.coords.speed || 0);
  };

  useEffect(() => {
    return () => {
      // console.log("useGPS - EFECTO 1 [] (return): Limpiando hook...");
      if (locationSubscription.current) {
        console.log("useGPS - EFECTO 1 [] (return): Desuscribiendo GPS...");
        locationSubscription.current.remove();
        locationSubscription.current = null;
        setIsSubscribed(false);
        // console.log("useGPS - EFECTO 1 [] (return): Listo.");
      } else {
        // console.log("useGPS - EFECTO 1 [] (return): No está suscrito. Ignorando...");
      }
    };
  }, []);

  // console.log("useGPS - Retornando datos.");
  return {
    actualSpeed_MS: Math.trunc(actualSpeed),
    actualSpeed_KMH: Math.trunc(actualSpeed * 3.6),
    getCurrentLocationAsync,
    enableLocationSubscriptionAsync,
    disableLocationSubscriptionAsync,
    locationData,
    isSubscribed
  };
}

export default useGPS;
