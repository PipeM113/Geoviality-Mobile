import { useEffect } from "react";

import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import mime from "mime";

interface SendingData {
  timestamp: number;
  latitude: number;
  longitude: number;
  photoUri: string;
  modo: string;
}

interface SendingDataVereda extends SendingData {
  tipo: string;
}

/**
 * Hook para enviar datos a un servidor remoto.
 *
 * @param apiDomain Dominio del servidor remoto. Si no se especifica, se usará el dominio de ngrok definido en las variables de entorno.
 * @returns Función asíncrona que envía los datos a un servidor remoto.
 */
function useAPIServer(
  apiDomain: string = `https://${process.env.EXPO_PUBLIC_NGROK_DOMAIN}`,
  axios_apiAuthClient: AxiosInstance = axios
) {
  // console.log("useApiServer - Cargando hook...");

  useEffect(() => {
    console.log("useApiServer - Usando dominio:", apiDomain);
  }, []);

  const timestampToDateString = (timestamp: number) => {
    const dateObj = new Date(timestamp);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const seconds = String(dateObj.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const testSendFileAsync = async (fileUri: string) => {
    const apiUrl = `${apiDomain}/upload/image`;

    console.log("useApiServer/sendTestData - Enviando datos de prueba...");
    const fileName = fileUri.split("/").pop();
    const fileType = mime.getType(fileUri);

    const lat = 37.7749;
    const lon = -122.4194;
    const modo = "manual";

    const dateObj = new Date();
    const date = timestampToDateString(dateObj.getTime());

    console.log(
      `useApiServer/sendDataAsync - Resumen de lo que se enviara:
      - URI: ${fileUri}
      - Filename: ${fileName},
      - Type: ${fileType}

      - longitude: ${lon}
      - latitude: ${lat},

      - timestamp: ${dateObj.getTime()}
      - date: ${date}

      - Modo: ${modo}

      - Hacia URL: ${apiUrl}`
    );

    console.log("useApiServer/sendTestData - Creando FormData...");
    const formData = new FormData();
    console.log("useApiServer/sendTestData - Agregando longitud...");
    formData.append("longitude", lon.toString());
    console.log("useApiServer/sendTestData - Agregando latitud...");
    formData.append("latitude", lat.toString());
    console.log("useApiServer/sendTestData - Agregando fecha...");
    formData.append("date", date);
    console.log("useApiServer/sendTestData - Agregando modo...");
    formData.append("modo", modo);
    console.log("useApiServer/sendTestData - Agregando imagen...");
    formData.append("image", {
      uri: fileUri,
      name: fileName,
      type: fileType
    } as any);

    const requestConfig: AxiosRequestConfig = {
      method: "post",
      url: apiUrl,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        "ngrok-skip-browser-warning": "true"
      }
    };

    console.log("useApiServer/sendTestData - Enviando datos...");
    try {
      const res = await axios_apiAuthClient(requestConfig);
      console.log("useApiServer/sendTestData - Respuesta del servidor:", res.data);
      return res.status;
      // Alert.alert("File uploaded successfully", `Server response: ${res.status}`);
    } catch (error) {
      console.error("useApiServer/sendTestData - Error:", error);
      return 0;
      // Alert.alert("Error uploading file", `Error: ${error}`);
    }
  };

  const sendDataAsync = async (data: SendingData) => {
    // console.log("useApiServer/sendDataAsync - Preparando datos para enviar...");

    const apiUrl = `${apiDomain}/upload/image`;

    const fileUri = data.photoUri;
    const fileName = fileUri.split("/").pop();
    const fileType = mime.getType(fileUri);

    const lat = data.latitude.toString();
    const lon = data.longitude.toString();
    const modo = data.modo;

    const timestamp = new Date().getTime();
    const date = timestampToDateString(timestamp);

    const formData = new FormData();
    formData.append("longitude", lon);
    formData.append("latitude", lat);
    formData.append("date", date);
    formData.append("modo", modo);
    formData.append("image", {
      uri: fileUri,
      name: fileName,
      type: fileType
    } as any);

    const requestConfig: AxiosRequestConfig = {
      method: "post",
      url: apiUrl,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        "ngrok-skip-browser-warning": "true"
      }
    };

    console.log("useApiServer/sendDataAsync - Intentando enviar datos...");
    try {
      const res = await axios_apiAuthClient(requestConfig);
      console.log("useApiServer/sendDataAsync - Respuesta del servidor:", res.data);
      return res.status;
      // Alert.alert("File uploaded successfully", `Server response: ${res.status}`);
    } catch (error) {
      console.error("useApiServer/sendDataAsync - Error:", error);
      return 0;
      // Alert.alert("Error uploading file", `Error: ${error}`);
    }
  };

  const sendDataVeredaAsync = async (data: SendingDataVereda) => {
    // console.log("useApiServer/sendDataVeredaAsync - Preparando datos para enviar...");

    const apiUrl = `${apiDomain}/upload/sidewalks`;

    const fileUri = data.photoUri;
    const fileName = fileUri.split("/").pop();
    const fileType = mime.getType(fileUri);

    const lat = data.latitude.toString();
    const lon = data.longitude.toString();
    const modo = data.modo;
    const tipo = data.tipo;

    const timestamp = new Date().getTime();
    const date = timestampToDateString(timestamp);

    const formData = new FormData();
    formData.append("longitude", lon);
    formData.append("latitude", lat);
    formData.append("date", date);
    formData.append("modo", modo);
    formData.append("tipo", tipo);
    formData.append("image", {
      uri: fileUri,
      name: fileName,
      type: fileType
    } as any);

    const requestConfig: AxiosRequestConfig = {
      method: "post",
      url: apiUrl,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        "ngrok-skip-browser-warning": "true"
      }
    };

    console.log("useApiServer/sendDataVeredaAsync - Intentando enviar datos...");
    try {
      const res = await axios_apiAuthClient(requestConfig);
      console.log("useApiServer/sendDataVeredaAsync - Respuesta del servidor:", res.data);
      return res.status;
      // Alert.alert("File uploaded successfully", `Server response: ${res.status}`);
    } catch (error) {
      console.error("useApiServer/sendDataVeredaAsync - Error:", error);
      return 0;
      // Alert.alert("Error uploading file", `Error: ${error}`);
    }
  };

  // const getDataAsync = async () => {
  //   console.log("useApiServer/getDataAsync - Obteniendo datos...");
  //   const apiUrl = `${apiDomain}/data/processed_info`;

  //   console.log("useApiServer/getDataAsync - Intentando obtener datos...");
  //   try {
  //     const res = await axios.get(apiUrl);

  //     let coordenadas: number[][] = [];

  //     res.data.forEach((element: any) => {
  //       coordenadas.push([element.latitude, element.longitude]);
  //     });

  //     console.log("useApiServer/getDataAsync - Arreglo:", coordenadas);
  //   } catch (error) {
  //     console.error("useApiServer/getDataAsync - Error:", error);
  //     Alert.alert("Error getting data", `Error: ${error}`);
  //     return null;
  //   }
  // };

  // console.log("useApiServer - Retornando datos...");
  return { sendDataAsync, testSendFileAsync, sendDataVeredaAsync };
}

export default useAPIServer;

/*
Cementerio:

// Extraer datos de la foto
    const uri = data.photoUri;
    const fileName = uri.split("/").pop();
    const lat = data.latitude.toString();
    const lon = data.longitude.toString();

    // Convertir UNIX timestamp a fecha YYYY-MM-DDTHH:MM
    const timestamp = data.timestamp;
    const dateObj = new Date(timestamp);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const date = `${year}-${month}-${day}T${hours}:${minutes}`;

    console.log(
      `useApiServer/sendDataAsync - Resumen de lo que se enviara:
      > URI: ${uri}
      - Filename: ${fileName},
      > longitude: ${lon}
      > latitude: ${lat},
      - timestamp: ${timestamp}
      > date: ${date}
      !!! Hacia URL: ${urlPost}`
    );

    const formData = new FormData();
    formData.append("image", {});
    formData.append("longitude", lon);
    formData.append("latitude", lat);
    formData.append("date", date);

    console.log("useApiServer/sendDataAsync - Intentando enviar datos...");
    try {
      const res = await axios.post(urlPost, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      console.log("useApiServer/sendDataAsync - Respuesta del servidor:", res);
    } catch (error) {
      console.error("useApiServer/sendDataAsync - Error:", error);
      Alert.alert("Error uploading file");
    }
  };
*/
