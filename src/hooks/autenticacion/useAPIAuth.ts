import { useState, useEffect } from "react";

import axios, { AxiosError, AxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

// TODO: Documentar esto
function useAPIAuth(
  verificarSesion: boolean = true,
  apiDomain: string = `https://${process.env.EXPO_PUBLIC_NGROK_DOMAIN}`
) {
  // console.log("useApiAuth - Cargando hook...");

  // MARK: Variables de configuración
  const apiCheckTokenUrl = apiDomain + "/users/me/"; //? Esto es cambiable
  const apiLoginUrl = apiDomain + "/auth/login"; //? Esto es cambiable
  const clientKey = "algo"; //? Esto es cambiable
  const astor_tokenName = "accessToken";
  const astor_username = "username";
  // Fin Variables de configuración

  useEffect(() => {
    console.log("useAPIAuth - Usando dominio:", apiDomain);

    (async () => {
      if (verificarSesion) {
        const sesionValida = await verificarSesionAsync();
        if (!sesionValida) {
          router.navigate("/login");
        }
      }
    })();
  }, []);

  // ==================

  // MARK: verificarTokenAPIAsync
  // Verifica si el token almacenado en el estado del hook es válido
  const verificarSesionAsync = async () => {
    console.log("useAPIAuth/verificarSesionAsync - Obteniendo token...");
    const token = await AsyncStorage.getItem(astor_tokenName);

    console.log("useAPIAuth/verificarSesionAsync - Verificando token:", token);
    const requestConfig: AxiosRequestConfig = {
      method: "get",
      url: apiCheckTokenUrl,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "ngrok-skip-browser-warning": "true",
        "Authorization": `Bearer ${token}`
      }
    };
    try {
      const response = await axios(requestConfig);

      if (!response.data.disabled) {
        //? response.data. es cambiable

        console.log("useAPIAuth/verificarSesionAsync - Token válido.");
        return true;
      } else {
        console.log("useAPIAuth/verificarSesionAsync - Token inválido. Cerrando sesión.");
        await cerrarSesionAsync();
        return false;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log("useAPIAuth/verificarSesionAsync - Error:", error.response.status);
        if (error.response.status === 401) {
          console.log("useAPIAuth/verificarSesionAsync - Token inválido. Cerrando sesión.");
          await cerrarSesionAsync();
          return false;
        } else {
          console.log("useAPIAuth/verificarSesionAsync - Error:", error);
          throw new Error("useAPIAuth/verificarSesionAsync - Error: " + error);
        }
      } else {
        console.log("useAPIAuth/verificarSesionAsync - Error desconocido: " + error);
        throw new Error("useAPIAuth/verificarSesionAsync - Error desconocido: " + error);
      }
    }
  };

  // MARK: getUserData
  const getUserData = async () => {
    console.log("useAPIAuth/getUserData - Obteniendo datos de usuario...");
    const token = await AsyncStorage.getItem(astor_tokenName);

    if (!token) {
      console.log("useAPIAuth/getUserData - No hay token almacenado.");
      return null;
    }

    const requestConfig: AxiosRequestConfig = {
      method: "get",
      url: apiCheckTokenUrl,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "ngrok-skip-browser-warning": "true",
        "Authorization": `Bearer ${token}`
      }
    };

    try {
      const response = await axios(requestConfig);
      console.log("useAPIAuth/getUserData - Datos de usuario:", response.data);
      return response.data;
    } catch (error) {
      console.log("useAPIAuth/getUserData - Error al obtener datos de usuario:", error);
      throw new Error("useAPIAuth/getUserData - Error al obtener datos de usuario: " + error);
    }
  };

  // MARK: iniciarSesion
  const iniciarSesionAsync = async (username: string, password: string) => {
    console.log("useAPIAuth/iniciarSesion - Iniciando sesión...");

    // Si no hay token, se inicia sesión
    const requestConfig: AxiosRequestConfig = {
      method: "post",
      url: apiLoginUrl,
      data: {
        username: username,
        password: password,
        secret_key: clientKey,
        tipo: 0
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "ngrok-skip-browser-warning": "true"
      }
    };

    try {
      const response = await axios(requestConfig);

      // Se supone que la API responde con un token de sesión. Se guarda en AsyncStorage y en el estado
      const newToken = response.data.access_token; //? response.data. es cambiable
      console.log("useAPIAuth/iniciarSesion - SESION INICIADA. Guardando token de sesión:", newToken);

      await AsyncStorage.setItem(astor_tokenName, newToken);
      await AsyncStorage.setItem(astor_username, username);
      return true;
    } catch (error) {
      console.log("useAPIAuth/iniciarSesion - Error al iniciar sesión:", error);
      throw new Error("useAPIAuth/iniciarSesion - Error al iniciar sesión: " + error);
    }
  };

  // MARK: cerrarSesion
  const cerrarSesionAsync = async () => {
    console.log("useAPIAuth/cerrarSesion - Cerrando sesión... Borrando token de AsyncStorage.");

    await AsyncStorage.removeItem(astor_tokenName);
    await AsyncStorage.removeItem(astor_username);
  };

  // MARK: apiClient
  const apiAuthClient = axios.create();

  apiAuthClient.interceptors.request.use(async (config) => {
    const storedToken = await AsyncStorage.getItem("accessToken");
    if (storedToken) {
      config.headers.Authorization = `Bearer ${storedToken}`;
    }
    return config;
  });

  // console.log("useApiAuth - Retornando datos...");
  return { getUserData, verificarSesionAsync, iniciarSesionAsync, cerrarSesionAsync, apiAuthClient };
}

export default useAPIAuth;
