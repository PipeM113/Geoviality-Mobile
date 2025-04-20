import { useEffect, useState } from "react";
import { StyleSheet, Text, Image, ScrollView, View } from "react-native";

import { gv_logo_full_back_white } from "@src/constants/imageRoutes";
import { contentStyles, secondaryColor } from "@src/constants/uiStyles";

import useAPIServer from "@src/hooks/utilidades/useAPIServer";
import useCacheManager from "@src/hooks/utilidades/useCacheManager";
import useAPIAuth from "@src/hooks/autenticacion/useAPIAuth";
import useWeatherData from "../hooks/utilidades/useWeatherData";

import BotonFuncion from "@src/components/usables/BotonFuncion";
import BotonNavegacion from "@src/components/usables/BotonNavegacion";
import HeaderNew from "@src/components/estructura/HeaderNew";
import ImagenFondo from "@src/components/estructura/ImagenFondo";
import Tarjeta from "@src/components/estructura/Tarjeta";
import IconoCargando from "@src/components/usables/IconoCargando";

function Home() {
  // console.log("=====================================");
  // console.log("Home - Cargando componente...");

  const [message, setMessage] = useState("");
  const [loadingWeather, setLoadingWeather] = useState(false);

  const weatherClient = useWeatherData();

  const renderMessage = () => {
    if (message) {
      return <Text style={pageStyles.message}>Mensaje: {message}</Text>;
    } else {
      return null;
    }
  };

  const renderOptimalidad = (weatherData: any) => {
    const tamano = 27;

    if (weatherData) {
      if (weatherData.optimalidad === 0) {
        return (
          <Text style={[pageStyles.weatherText, { fontSize: tamano, color: "green" }]}>
            🟢 Condición: Buena ({weatherData.optimalidad})
          </Text>
        );
      } else if (weatherData.optimalidad === 1 || weatherData.optimalidad === 2) {
        return (
          <Text style={[pageStyles.weatherText, { fontSize: tamano, color: "#dd7d00" }]}>
            🟡 Condición: Moderada ({weatherData.optimalidad})
          </Text>
        );
      } else if (weatherData.optimalidad >= 3) {
        return (
          <Text style={[pageStyles.weatherText, { fontSize: tamano, color: "red" }]}>
            🔴 Condición: Mala ({weatherData.optimalidad})
          </Text>
        );
      }
    } else {
      return <Text style={[pageStyles.weatherText, { fontSize: tamano }]}>⚫ Condición: ...</Text>;
    }
  };

  const renderLoadingIcon = () => {
    if (loadingWeather) {
      return (
        <View style={pageStyles.weatherLoadingIcon}>
          <IconoCargando color="black" size={pageStyles.weatherLoadingIcon.width} />
        </View>
      );
    } else {
      return null;
    }
  };

  const insightText = () => {
    const optimalidad = weatherClient.weatherData ? weatherClient.weatherData.optimalidad : -1;

    if (optimalidad === 0) {
      return [
        "El clima se considera optimo para realizar capturas en la calzada.",
        "Un clima nublado o soleado antes del atardecer es ideal para capturas en la calzada. Ya que la luz del sol no es tan intensa, es probable que no hayan sombras fuertes que puedan interferir con la detección de objetos en la calzada."
      ];
    } else if (optimalidad === 1) {
      return [
        "El clima se considera moderado para realizar capturas en la calzada.",
        "Un clima muy soleado y sin nubes puede generar sombras muy marcadas. Esto puede interferir con la detección de objetos en la calzada."
      ];
    } else if (optimalidad === 2) {
      return [
        "El clima se considera moderado para realizar capturas en la calzada.",
        "Se recomienda tener precaucíon ya que se preveen lluvias en el dia. La lluvia puede afectar la calidad de las capturas en la calzada."
      ];
    } else if (optimalidad === 3) {
      return [
        "La hora no es optima para realizar capturas en la calzada.",
        "A esta hora del día, la cantidad de luz es muy baja. Esto puede afectar la calidad de las capturas en la calzada."
      ];
    } else if (optimalidad === 4) {
      return [
        "La hora no es optima para realizar capturas en la calzada.",
        "Es de noche y no hay luz suficiente para realizar capturas en la calzada. Las imágenes pueden salir muy oscuras y distorcionadas. Puede que la detección se vea considerablemente afectada."
      ];
    } else if (optimalidad === 5) {
      return [
        "El clima no se considera optimo para realizar capturas en la calzada.",
        "El clima actual es muy adverso para realizar capturas en la calzada. Se recomienda esperar a que las condiciones climaticas mejoren."
      ];
    } else {
      return ["No se ha determinado las condiciones del clima.", "Espere a que se carguen los datos del clima."];
    }
  };

  const handleLoadWeatherData = async () => {
    setLoadingWeather(true);
    const respuesta = await weatherClient.getWeatherData();
    setLoadingWeather(false);
    console.log("Home - Clima:", respuesta);
  };

  useEffect(() => {
    handleLoadWeatherData();
  }, []);

  // console.log("Home - Renderizando...");
  // console.log("=====================================");
  return (
    <>
      <ImagenFondo>
        <HeaderNew titulo="Condición de captura" goBack />

        <ScrollView>
          {renderMessage()}
          {/* <Tarjeta centrado>
            <Image source={gv_logo_full_back_white} style={[pageStyles.logo]} />
            <Text style={contentStyles.text}>Version: {process.env.EXPO_PUBLIC_VERSION} - GroundTech</Text>
          </Tarjeta> */}

          <Tarjeta titulo="Tiempo actual">
            <Text style={pageStyles.weatherText}>
              ▪️Hora: {weatherClient.weatherData ? weatherClient.getFechaActualString(true) : "..."}
            </Text>
            <Text style={pageStyles.weatherText}>
              ▪️Es de día: {weatherClient.weatherData ? weatherClient.getEsDeDiaString() : "..."}
            </Text>
            <Text style={pageStyles.weatherText}>
              ▪️Clima: {weatherClient.weatherData ? weatherClient.getClimaString() : "..."}
            </Text>
            <Text style={pageStyles.weatherText}>
              ▪️Amanecer: 🌇 {weatherClient.weatherData ? weatherClient.getAmanecerString() : "..."}
            </Text>
            <Text style={pageStyles.weatherText}>
              ▪️Atardecer: 🌆 {weatherClient.weatherData ? weatherClient.getAtardecerString() : "..."}
            </Text>
            <Text style={pageStyles.weatherText}>
              ▪️Nubosidad: ☁️ {weatherClient.weatherData ? weatherClient.weatherData.porc_nubosidad : "..."}%
            </Text>
            <Text style={pageStyles.weatherText}>
              ▪️Prob. lluvia: ☔ {weatherClient.weatherData ? weatherClient.weatherData.porc_prob_precipitacion : "..."}
              %
            </Text>
            <View style={[pageStyles.weatherTextContainer, { justifyContent: "center" }]}>
              {renderOptimalidad(weatherClient.weatherData)}
            </View>
            <BotonFuncion
              texto="Actualizar"
              funcionEjecutar={handleLoadWeatherData}
              icono="refresh"
              style={[
                pageStyles.weatherButton,
                { position: "absolute", top: -45, right: -4, backgroundColor: secondaryColor }
              ]}
              iconStyle={{ position: "absolute", top: 7, left: 7, color: "#000000" }}
              textStyle={{ position: "absolute", top: 2, left: 25, color: "#000000" }}
            />
            {renderLoadingIcon()}
          </Tarjeta>

          <Tarjeta titulo="💡 Perspectiva">
            <Text style={contentStyles.text}>{insightText()[0]}</Text>
            <View style={{ height: 20 }} />
            <Text style={contentStyles.text}>{insightText()[1]}</Text>
          </Tarjeta>

          <Tarjeta>
            <Text style={[contentStyles.text, { fontSize: 15 }]}>ℹ️ Datos proporcionados por Open-Meteo</Text>
          </Tarjeta>
        </ScrollView>
      </ImagenFondo>
    </>
  );
}

const pageStyles = StyleSheet.create({
  message: {
    ...contentStyles.text,
    backgroundColor: "#ff000033",
    color: "red"
  },
  logo: {
    // backgroundColor: "#00ff0066", //? TestStyle
    width: "100%",
    height: 100,
    resizeMode: "contain"
  },
  weatherTextContainer: {
    // backgroundColor: "#00000033", //? TestStyle

    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },
  weatherText: {
    ...contentStyles.text
  },
  weatherButton: {
    width: 130,
    minWidth: 40,

    height: 40,
    minHeight: 40
  },
  weatherLoadingIcon: {
    // backgroundColor: "#ff00ff44", //? TestStyle

    position: "absolute",
    bottom: -5,
    right: -5,

    width: 40,
    height: 40
  }
});

export default Home;
