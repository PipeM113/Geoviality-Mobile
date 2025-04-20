import { useEffect, useState, useRef } from "react";
import { View, Text, Image, StyleSheet, Dimensions, FlatList, Switch } from "react-native";

import { CameraCapturedPicture } from "expo-camera";
import { useKeepAwake } from "expo-keep-awake";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EventSource from "react-native-sse";

import { contentStyles, errorColor, secondaryColor } from "@src/constants/uiStyles";

import useGPS from "@src/hooks/sensores/useGPS";
import useAPIServer from "@src/hooks/utilidades/useAPIServer";
import useAPIAuth from "@/src/hooks/autenticacion/useAPIAuth";

import BotonFuncion from "@src/components/usables/BotonFuncion";
import HeaderNew from "@src/components/estructura/HeaderNew";
import ImagenFondo from "@src/components/estructura/ImagenFondo";
import VistaCamara, { RefVistaCamara } from "@src/components/camara/VistaCamara";
import VistaPopUp from "@/src/components/estructura/VistaPopUp";
import Tarjeta from "@/src/components/estructura/Tarjeta";

function EnvioDatos() {
  // console.log("=====================================");
  // console.log("EnvioDatos - Cargando componente...");

  useKeepAwake(); //! La pantalla no se apagará

  const refVistaCamara = useRef<RefVistaCamara>(null);
  const refUsername = useRef("");

  const [photoUri, setPhotoUri] = useState("");
  const [readyToSend, setReadyToSend] = useState(false);
  const [response, setResponse] = useState<number>();
  const [message, setMessage] = useState("");
  const [detectionMessage, setDetectionMessage] = useState("");
  const [capturing, setCapturing] = useState(false);

  const [popupVisible, setPopupVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const astor_avisosDeteccion = "avisosDeteccion";
  const [avisosActivados, setAvisosActivados] = useState<boolean>(true);

  const handleNext = async () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      if (dontShowAgain) {
        try {
          await AsyncStorage.setItem("dontShowAgain", "true");
          console.log("AsyncStorage set to true"); // Log para verificar que se guarda correctamente
        } catch (error) {
          console.error("Error writing to AsyncStorage:", error);
        }
      }
      setPopupVisible(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  const gpsHook = useGPS();
  const useAuth = useAPIAuth();
  const apiServer = useAPIServer(undefined, useAuth.apiAuthClient);

  useEffect(() => {
    const checkDontShowAgain = async () => {
      try {
        const value = await AsyncStorage.getItem("dontShowAgain");
        console.log("AsyncStorage value:", value); // Log para verificar el valor
        if (value !== "true") {
          setPopupVisible(true);
        }
      } catch (error) {
        console.error("Error reading AsyncStorage:", error);
      }
    };

    const loadUsername = async () => {
      const username = await AsyncStorage.getItem("username");
      if (username) {
        refUsername.current = username;
      } else {
        refUsername.current = "";
      }
    };

    const cargarOpciones = async () => {
      console.log("Consiguiendo opcion de avisos de detección...");
      const value = await AsyncStorage.getItem(astor_avisosDeteccion);
      console.log("Opcion de avisos de detección:", value);
      if (value) {
        setAvisosActivados(JSON.parse(value));
      }
    };

    checkDontShowAgain();
    loadUsername();
    cargarOpciones();
  }, []);

  useEffect(() => {
    const direccion_api_eventos = "https://shark-quick-loon.ngrok-free.app/data/events/last_point/movil";
    const fuente_evento = new EventSource(direccion_api_eventos);
    console.log("EnvioDatos/Eventos - Escuchando por eventos en:", direccion_api_eventos);

    fuente_evento.addEventListener("open", () => {
      console.log("EnvioDatos/Eventos - Conexión establecida con la fuente de eventos.");
    });

    fuente_evento.addEventListener("message", (evento) => {
      console.log("EnvioDatos/Eventos - Evento recibido:", evento);
      if (evento.data) {
        console.log("EnvioDatos/Eventos - Evento recibido:", evento.data);
        const json_data = JSON.parse(evento.data);
        console.log("EnvioDatos/Eventos - Datos del evento en JSON:", json_data);

        if (json_data.properties.user === refUsername.current) {
          console.log("EnvioDatos/Eventos - El evento es para este usuario!");
          console.log("EnvioDatos/Eventos - Detecciones:", JSON.stringify(json_data.properties.type));

          const tipos_deteccion = JSON.stringify(json_data.properties.type);
          const fecha_deteccion = new Date(json_data.properties.last_update);
          const hora_deteccion = fecha_deteccion.getHours() + ":" + fecha_deteccion.getMinutes();

          setDetectionMessage(`${tipos_deteccion} a las ${hora_deteccion}`);
        } else {
          console.log("EnvioDatos/Eventos - El evento no es para este usuario.");
        }
      } else {
        console.log("EnvioDatos/Eventos - Evento sin datos.");
      }
    });

    fuente_evento.addEventListener("error", (error) => {
      console.error("EnvioDatos/Eventos - Error en la fuente de eventos:", error);
    });

    return () => {
      console.log("EnvioDatos/Eventos - Cerrando fuente de eventos...");
      fuente_evento.close();
    };
  }, []);

  useEffect(() => {
    // console.log("EnvioDatos - EFECTO 1 [readyToSend]: revisando si esta listo para enviar...");
    (async () => {
      if (readyToSend) {
        // console.log("EnvioDatos - EFECTO 1 [readyToSend]: Enviando datos...");

        const data = {
          ...gpsHook.locationData,
          photoUri,
          modo: "manual"
        };

        console.log("EnvioDatos - EFECTO 1 [readyToSend]: Datos a enviar:", data);

        const res = await apiServer.sendDataAsync(data);
        setReadyToSend(false);
        setResponse(res);
        setMessage(res === 200 ? "Datos enviados" : "Error al enviar datos");
        setCapturing(false);
      } else {
        // console.log("EnvioDatos - EFECTO 1 [readyToSend]: No listo para enviar...");
      }
    })();
  }, [readyToSend]);

  const handlePhotoTaken = (capturedPicture: CameraCapturedPicture) => {
    // console.log("EnvioDatos/HandlePhotoTaken - Foto tomada:", photoUri);
    setPhotoUri(capturedPicture.uri);
  };

  const handleGetLocation = async () => {
    console.log("EnvioDatos/GetLocation - Solicitando ubicacion...");
    try {
      await gpsHook.getCurrentLocationAsync();
      // console.log("EnvioDatos/GetLocation - Ubicacion obtenida:", gpsHook.locationData);
    } catch (error) {
      console.log("EnvioDatos/GetLocation - Error al obtener ubicacion:", error);
    }
  };

  const handleCaptureAsync = async () => {
    console.log("EnvioDatos/TakePicture - Solicitando foto...");
    try {
      await refVistaCamara.current?.takePictureAsync();
    } catch (error) {
      console.log("EnvioDatos/TakePicture - Error al tomar foto:", error);
    }
  };

  const handleCapturingDataAsync = async () => {
    setCapturing(true);
    setMessage("Tomando foto...");
    await handleCaptureAsync();
    setMessage("Obteniendo ubicación...");
    await handleGetLocation();
    setMessage("Enviando datos...");
    setReadyToSend(true);
  };

  const renderSendButton = () => {
    if (!capturing) {
      return <BotonFuncion texto="Enviar Datos" funcionEjecutar={handleCapturingDataAsync} icono="send" />;
    } else {
      return (
        <BotonFuncion texto="Enviar Datos" funcionEjecutar={handleCapturingDataAsync} icono="send" disabled loading />
      );
    }
  };

  const renderMessage = () => {
    if (message) {
      return (
        <>
          <Text style={[contentStyles.text, { color: "#ffffff" }]}>{message}</Text>
        </>
      );
    } else {
      return null;
    }
  };

  const renderDetectionStatus = () => {
    if (avisosActivados) {
      if (detectionMessage) {
        return (
          <>
            <Text style={[contentStyles.text, { color: "#ffffff" }]}>Ultima detección:</Text>
            <Text style={[contentStyles.text, { color: "#ffffff" }]}>{detectionMessage}</Text>
          </>
        );
      } else {
        return null;
      }
    } else {
      return <Text style={[contentStyles.text, { color: "#ffffff" }]}>Avisos de detección desactivados.</Text>;
    }
  };

  const { width, height } = Dimensions.get("window");

  const data = [
    {
      key: "1",
      title: "Instrucciones de captura 1/8",
      description: "No hagas capturas de noche.",
      image: require("../../assets/images/instructions/night.png")
    },
    {
      key: "2",
      title: "Instrucciones de captura 2/8",
      description: "Cuando hay días soleados ten cuidado con las sombras.",
      image: require("../../assets/images/instructions/sunny.png")
    },
    {
      key: "3",
      title: "Instrucciones de captura 3/8",
      description: "Asegúrate de que NO hayan sombras en las imperfecciones.",
      image: require("../../assets/images/instructions/instruction_manual_bad.png")
    },
    {
      key: "4",
      title: "Instrucciones de captura 4/8",
      description: "Los días nublados son los mejores!!!",
      image: require("../../assets/images/instructions/cloudy.png")
    },
    {
      key: "5",
      title: "Instrucciones de captura 5/8",
      description: "Asegura que la irregularidad esté dentro del encuadre de la cámara.",
      image: require("../../assets/images/instructions/image_focus.gif")
    },
    {
      key: "6",
      title: "Instrucciones de captura 6/8",
      description: "La imágen no debe estar borrosa.",
      image: require("../../assets/images/instructions/image_blured.png")
    },
    {
      key: "7",
      title: "Instrucciones de captura 7/8",
      description: "Asegúrate de que en la foto se vean las imperfecciones.",
      image: require("../../assets/images/instructions/image_not_focused.png")
    },
    {
      key: "8",
      title: "Instrucciones de captura 8/8",
      description: "La imperfección debe ser el centro de la imágen, también debe verse el horizonte.",
      image: require("../../assets/images/instructions/image_good.png")
    }
  ];

  const styles = StyleSheet.create({
    cardContainer: {
      width: width,
      justifyContent: "center",
      alignItems: "center"
    },
    text_title: {
      fontSize: 24,
      color: "black",
      fontWeight: "bold",
      textAlign: "center",
      margin: 10
    },
    text_paraph: {
      fontSize: 18,
      color: "black",
      textAlign: "center",
      margin: 10
    },
    imageContainer: {
      justifyContent: "center",
      alignItems: "center"
    },
    image: {
      width: 250,
      height: 200,
      borderRadius: 20,
      resizeMode: "contain"
    },
    switchContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 20
    },
    switchText: {
      fontSize: 18,
      color: "black",
      marginRight: 10,
      marginLeft: 30
    }
  });
  // console.log("EnvioDatos - Renderizando...");
  // console.log("=====================================");
  return (
    <>
      <HeaderNew titulo="Envio Manual" goBack />
      <ImagenFondo>
        <View style={{ display: "flex", flex: 1 }}>
          <View style={[contentStyles.containerCentered, pageStyles.containerTop]}>{renderDetectionStatus()}</View>
          <VistaCamara ref={refVistaCamara} noButtons onPhotoTaken={handlePhotoTaken} />
          <View
            style={[
              contentStyles.containerCentered,
              {
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                marginHorizontal: 0,
                marginVertical: 0,
                backgroundColor: "#00000088"
              }
            ]}
          >
            {/* <Text>Latitud: {gpsHook.locationData.latitude}</Text>
                <Text>Longitud: {gpsHook.locationData.longitude}</Text>
                <Text>Timestamp: {gpsHook.locationData.timestamp}</Text>
                <Text>Uri de la foto: {photoUri}</Text>
                <Text>Estado general: {readyToSend ? "Listo" : "No listo"}</Text>
                <Text>Respuesta del servidor: {response}</Text> */}
            {/* <BotonFuncion texto="Obtener Ubicacion" funcionEjecutar={handleGetLocation} icono="map-marker" /> */}
            {/* <BotonFuncion texto="Tomar Foto" funcionEjecutar={handleCaptureAsync} icono="camera" /> */}
            {renderSendButton()}
            {renderMessage()}
          </View>
        </View>
      </ImagenFondo>

      <VistaPopUp esVisible={popupVisible} onRequestClose={() => setPopupVisible(!popupVisible)}>
        <FlatList
          ref={flatListRef}
          data={data}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <View style={styles.cardContainer}>
              <Tarjeta titulo={item.title} centrado style={{ width: "100%" }}>
                <Text style={contentStyles.text}>{item.description}</Text>
                <Image source={item.image} style={styles.image} />
                {index === data.length - 1 && (
                  <View style={styles.switchContainer}>
                    <Text style={contentStyles.text}>No mostrar nuevamente</Text>
                    <Switch value={dontShowAgain} onValueChange={(value) => setDontShowAgain(value)} />
                  </View>
                )}
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}>
                  {index !== 0 ? (
                    <BotonFuncion
                      texto="Atrás"
                      funcionEjecutar={handlePrev}
                      noText
                      icono="arrow-left"
                      style={{ width: 80 }}
                    />
                  ) : (
                    <BotonFuncion
                      texto="Cerrar"
                      funcionEjecutar={() => setPopupVisible(false)}
                      icono="close"
                      noText
                      style={{ backgroundColor: errorColor, width: 80 }}
                    />
                  )}
                  {index !== data.length - 1 ? (
                    <BotonFuncion
                      texto="Saltar"
                      funcionEjecutar={() => {
                        setCurrentIndex(data.length - 1);
                        flatListRef.current?.scrollToIndex({ index: data.length - 1 });
                      }}
                      noText
                      icono="fast-forward"
                      style={{ backgroundColor: secondaryColor, width: 80 }}
                    />
                  ) : (
                    <BotonFuncion
                      texto="Saltar"
                      funcionEjecutar={() => {
                        setCurrentIndex(data.length - 1);
                        flatListRef.current?.scrollToIndex({ index: data.length - 1 });
                      }}
                      noText
                      icono="fast-forward"
                      style={{ backgroundColor: secondaryColor, width: 80 }}
                      disabled
                    />
                  )}
                  {index === data.length - 1 ? (
                    <BotonFuncion
                      texto="Cerrar"
                      funcionEjecutar={handleNext}
                      icono="close"
                      noText
                      style={{ backgroundColor: errorColor, width: 80 }}
                    />
                  ) : (
                    <BotonFuncion
                      texto="Siguiente"
                      funcionEjecutar={handleNext}
                      noText
                      icono="arrow-right"
                      style={{ width: 80 }}
                    />
                  )}
                </View>
              </Tarjeta>
            </View>
          )}
          keyExtractor={(item) => item.key}
        />
      </VistaPopUp>
    </>
  );
}

export default EnvioDatos;

const pageStyles = StyleSheet.create({
  containerTop: {
    backgroundColor: "#00000088",

    position: "absolute",
    left: 0,
    right: 0,
    top: 0,

    marginHorizontal: 0,
    marginVertical: 0,

    zIndex: 5
  },
  containerBottom: {
    backgroundColor: "#00000088",

    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,

    marginHorizontal: 0,
    marginVertical: 0,

    zIndex: 5
  }
});
