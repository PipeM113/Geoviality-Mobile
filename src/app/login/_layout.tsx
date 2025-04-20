import { useEffect } from "react";

import { Slot, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";

import { primaryColor } from "@src/constants/uiStyles";
import { fontAlata } from "@src/constants/resourceRoutes";

import VistaAreaSegura from "@src/components/estructura/VistaAreaSegura";
import { Text } from "react-native";

export default function LoginLayout() {
  return (
    <VistaAreaSegura>
      <Slot />
      {/* <Text>Login Layout</Text> */}
    </VistaAreaSegura>
  );
}
