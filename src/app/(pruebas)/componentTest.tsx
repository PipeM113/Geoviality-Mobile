import HeaderNew from "@src/components/estructura/HeaderNew";
import Tarjeta from "@src/components/estructura/Tarjeta";
import ComponentePrueba from "@src/components/pruebas/ComponentePrueba";
import { contentStyles } from "@src/constants/uiStyles";
import { ScrollView, View } from "react-native";
import { Header } from "react-native/Libraries/NewAppScreen";

function componentTest() {
  return (
    <>
      <HeaderNew titulo="Componente de Prueba" goBack />
      <ScrollView>
        <HeaderNew titulo="Componente de Prueba" />
        <HeaderNew titulo="Componente de Prueba" destino={"../"} />
        <HeaderNew titulo="Componente de Prueba" textoBoton="Volver" destino={"../"} />
        <HeaderNew titulo="Componente de Prueba" destino={"../"} goBack />
        <HeaderNew titulo="Componente de Prueba" withLogo />
        <Tarjeta>
          <ComponentePrueba />
        </Tarjeta>
        <Tarjeta>
          <ComponentePrueba />
        </Tarjeta>
        <Tarjeta>
          <ComponentePrueba />
        </Tarjeta>
        <Tarjeta>
          <ComponentePrueba />
        </Tarjeta>
      </ScrollView>
    </>
  );
}

export default componentTest;
