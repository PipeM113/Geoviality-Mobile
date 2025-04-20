import { ImageBackground } from "react-native";

import { backgroundImage } from "@src/constants/imageRoutes";

type Props = {
  children: React.ReactNode;
};

/***
 * Componente que renderiza una imagen de fondo en la pantalla.
 *
 * @param children - Otros componentes que se renderizan dentro de este componente
 */
const ImagenFondo = (props: Props) => {
  return (
    <>
      <ImageBackground source={backgroundImage} style={{ flex: 1 }} imageStyle={{ resizeMode: "cover", opacity: 0.4 }}>
        {props.children}
      </ImageBackground>
    </>
  );
};

export default ImagenFondo;
