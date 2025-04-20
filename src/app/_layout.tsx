import { useEffect } from "react";

import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";

import { primaryColor } from "@src/constants/uiStyles";
import { fontAlata } from "@src/constants/resourceRoutes";

import VistaAreaSegura from "@src/components/estructura/VistaAreaSegura";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Cargar fuentes antes de mostrar la aplicación
  const [loaded, error] = useFonts({
    Alata: fontAlata
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  // Una vez cargadas las fuentes, se muestra la aplicación

  const screenOptions = {
    headerShown: false
  };

  return (
    <VistaAreaSegura>
      <StatusBar backgroundColor={primaryColor} />
      <Stack screenOptions={screenOptions} />
    </VistaAreaSegura>
  );
}
