# Documentacion hooks para no olvidarme xdxdd

En la carpeta `/hooks` estan los hooks.

En la carpeta `/constants` estan los objetos estaticos que se utilizan en los componentes. Por ejemplo, estilos o rutas de imagenes.

> Para una idea general de como funcionan los componentes y su ciclo de vida, vease `/components/pruebas/ComponentePrueba.tsx` y `/hooks/pruebas/usePrueba.tsx`.

## `/hooks/utilidades/`

### useDisableBackButton

El componente que llame a este hook no permitira que el usuario navegue hacia atras.

```tsx
import useDisableBackButton from "@/hooks/utilidades/useDisableBackButton";

useDisableBackButton();
```

### useAPIServer

- Parametros:
  - `apiDomain`: Dominio del servidor remoto al que se le enviaran los datos. Por defecto es `https://${process.env.EXPO_PUBLIC_NGROK_DOMAIN}`.
- Retornos:
  - `sendDataAsync`: Funcion para enviar datos al servidor. Recibe un objeto con los datos a enviar (`{timestamp: number, latitude: number, longitude: number, photoUri: string, modo: string}`).

Hook para enviar datos al servidor. La funcion `sendDataAsync` envia los datos al servidor y retorna la respuesta. El `timestamp` es una fecha en formato UNIX, la funcion se encarga de transformar la fecha a formato YYYY-MM-DDTHH:MM. Si al cargar el hook no se especifica el dominio del servidor, se utilizara el dominio de Ngrok definido en las variables de entorno (archivo `.env`).

El modo representa la forma en la que se envian los datos. Puede ser `manual` o `auto`.

```tsx
import useAPIServer from "@/hooks/utilidades/useAPIServer";

const apiServer = useAPIServer();

(async () => {
  apiServer.sendDataAsync({
    timestamp: Date.now(),
    latitude: 0,
    longitude: 0,
    modo: "manual",
    photoUri: "https://example.com/photo.jpg"
  });
})();
```

## `/hooks/permisos/`

### useDevicePermissions

- Retornos:
  - `camera`: Si se tienen permisos para la camara.
  - `location`: Si se tienen permisos para la ubicacion.
  - `accelerometer`: Si se tienen permisos para el acelerometro.
  - `gyroscope`: Si se tienen permisos para el giroscopio.
  - `requestAllPermissionsAsync`: Funcion para solicitar todos los permisos.
  - `getAllPermissionsAsync`: Funcion para obtener el estado actual de todos los permisos.
  - `isAllPermissionsGranted`: Si se tienen todos los permisos.

Hook para obtener y solicitar permisos del dispositivo. La funcion `getAllPermissionsAsync` simplemente obtiene el estado actual de los permisos. Para solicitar los permisos, se debe invocar la funcion `requestAllPermissionsAsync`. El valor de `isAllPermissionsGranted` se vuelve `true` si se tienen todos los permisos.

```tsx
import useDevicePermissions from "@/hooks/permisos/useDevicePermissions";

const devicePermissions = useDevicePermissions();

(async () => {
  await devicePermissions.getAllPermissionsAsync();

  if (!devicePermissions.isAllPermissionsGranted) {
    await devicePermissions.requestAllPermissionsAsync();
  }
})();
```

## `/hooks/sensores/`

### useGPS

- Retornos:
  - `getCurrentLocationAsync`: Una función para actualizar la ubicación actual a demanda.
  - `enableLocationSubscriptionAsync`: Una función para habilitar la suscripción a la ubicación del GPS.
  - `disableLocationSubscriptionAsync`: Una función para deshabilitar la suscripción a la ubicación del GPS.
  - `locationData`: Un objeto que representa los datos de ubicación actuales, con propiedades `latitude`, `longitude` y `timestamp`.
  - `isSubscribed`: Un booleano que indica si la suscripción a la ubicación del GPS está habilitada.

Hook para obtener la ubicacion actual del dispositivo. Al llamar a `getCurrentLocationAsync`, se obtiene un objeto con la latitud y longitud del dispositivo en ese momento. Para obtener la ubicacion en tiempo real, se debe habilitar la suscripcion con `enableLocationSubscriptionAsync`. Para deshabilitar la suscripcion, se debe llamar a `disableLocationSubscriptionAsync`.

Los datos de ubicacion actuales se encuentran en `locationData`. Cada vez que se actualiza la ubicacion, ya sea por `getCurrentLocationAsync` o por la suscripcion, se actualiza el objeto `locationData` y causara un re-renderizado del componente que llame a este hook.

El hook desuscribe la ubicacion automaticamente cuando el componente que lo llama se desmonta.

```tsx
import useGPS from "@/hooks/sensores/useGPS";

const gpsHook = useGPS();

const obtenerUbicacion = async () => {
  await gpsHook.getCurrentLocationAsync();
};

const suscribirGPS = async () => {
  await gpsHook.enableLocationSubscriptionAsync();
};

const desuscribirGPS = async () => {
  await gpsHook.disableLocationSubscriptionAsync();
};

<Text>{gpsHook.isSubscribed ? "Suscripcion Activada" : "Suscripcion Desactivada"}</Text>;
<Text>{gpsHook.locationData.latitude}</Text>;
<Text>{gpsHook.locationData.longitude}</Text>;
<Text>{gpsHook.locationData.timestamp}</Text>;
```
