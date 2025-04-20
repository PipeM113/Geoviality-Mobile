import { useEffect } from "react";
import { BackHandler } from "react-native";

/***
 * Hook para desactivar el boton atras del dispositivo. Al ser llamado, el boton
 * atras no tendra ninguna accion en la pantalla mostrada.
 */
const useDisableBackButton = () => {
  const preventBackNavigation = () => {
    console.log("useDisableBackButtton - Boton atras desactivado!");
    return true; // Retornar true para desactivar el boton atras
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", preventBackNavigation);

    return () => {
      backHandler.remove();
    };
  }, []);
};

export default useDisableBackButton;
