import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: React.ReactNode;
};

/***
 * Componente que envuelve a la vista principal de la aplicación
 * para asegurar que no se salga de los límites de la pantalla
 *
 * @param children - Otros componentes que se renderizan dentro de este componente
 */
const VistaAreaSegura = (props: Props) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ height: "100%", width: "100%" }}>{props.children}</SafeAreaView>
    </SafeAreaProvider>
  );
};

export default VistaAreaSegura;
