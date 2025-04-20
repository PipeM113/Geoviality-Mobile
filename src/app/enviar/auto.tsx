import { useEffect, useState, useRef } from "react";
import { View, Text, Image, StyleSheet, Dimensions, FlatList, Switch } from "react-native";

import { CameraCapturedPicture } from "expo-camera";
import { useKeepAwake } from "expo-keep-awake";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { contentStyles, errorColor, primaryColor, secondaryColor } from "@src/constants/uiStyles";
import { img_velocimetro } from "@/src/constants/imageRoutes";

import useGPS from "@src/hooks/sensores/useGPS";
import useAPIServer from "@src/hooks/utilidades/useAPIServer";
import useAPIAuth from "@/src/hooks/autenticacion/useAPIAuth";

import BotonFuncion from "@src/components/usables/BotonFuncion";
import HeaderNew from "@src/components/estructura/HeaderNew";
import ImagenFondo from "@src/components/estructura/ImagenFondo";
import VistaCamara, { RefVistaCamara } from "@src/components/camara/VistaCamara";
import VistaPopUp from "@/src/components/estructura/VistaPopUp";
import Tarjeta from "@/src/components/estructura/Tarjeta";

function EnvioDatosAuto() {
  useKeepAwake(); //! La pantalla no se apagará

  const refVistaCamara = useRef<RefVistaCamara>(null);

  const [photoUri, setPhotoUri] = useState("");
  const [readyToSend, setReadyToSend] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [gpsReady, setGPSReady] = useState(false);
  const [subscriptionInterval, setSubscriptionInterval] = useState<NodeJS.Timeout | null>(null);
  const [response, setResponse] = useState<number>();
  const [message, setMessage] = useState("");
  // Max
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfirmacionVisible, setModalConfirmacionVisible] = useState(false);
  const [velocidadValida, setVelocidadValida] = useState(false);

  const astor_deteccionVelocidad = "deteccionvelocidad";
  const [deteccionActivada, setDeteccionActivada] = useState(true);

  //Benja
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const [dontShowAgain, setDontShowAgain] = useState(false);

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
  const apiAuth = useAPIAuth();
  const apiServer = useAPIServer(undefined, apiAuth.apiAuthClient);
  // Benja
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
    checkDontShowAgain();
  }, []);

  // Max
  const velocidadKMH_Maxima = 50;
  const velocidadKMH_Umbral = 5;

  const handlePhotoTaken = async (photo: CameraCapturedPicture) => {
    setPhotoUri(photo.uri);
    const data = {
      ...gpsHook.locationData,
      photoUri: photo.uri,
      modo: "auto"
    };
    setMessage("Enviando datos...");
    const res = await apiServer.sendDataAsync(data);
    setResponse(res);
    setMessage(res === 200 ? "Datos enviados" : "Error al enviar datos");
    if (res !== 200) {
      // handleDisableSubscription();
      setMessage("Error al enviar datos");
    }
  };

  const handleEnableSubscription = async () => {
    await gpsHook.enableLocationSubscriptionAsync();
  };

  const handleDisableSubscription = async () => {
    await gpsHook.disableLocationSubscriptionAsync();
    setGPSReady(false);
  };

  const renderSubscriptionButton = () => {
    if (gpsHook.isSubscribed) {
      return <BotonFuncion texto="Detener Captura" funcionEjecutar={handleDisableSubscription} icono="pause" />;
    } else {
      return <BotonFuncion texto="Iniciar Captura" funcionEjecutar={handleEnableSubscription} icono="play" />;
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

  const renderCoordinates = () => {
    if (gpsHook.locationData.timestamp > 0) {
      return (
        <>
          <Text style={[contentStyles.text, { color: "#ffffff" }]}>
            Lon: {gpsHook.locationData.longitude}, Lat: {gpsHook.locationData.latitude}
          </Text>
        </>
      );
    } else {
      return null;
    }
  };

  const handleCameraStatusChange = (status: boolean) => {
    setCameraReady(status);
  };

  useEffect(() => {
    (async () => {
      console.log("Consiguiendo opcion de detección de velocidad...");
      const value = await AsyncStorage.getItem(astor_deteccionVelocidad);
      console.log("Opcion de detección de velocidad:", value);
      if (value) {
        setDeteccionActivada(JSON.parse(value));
      }
    })();
  }, []);

  useEffect(() => {
    if (readyToSend) {
      const interval = setInterval(async () => {
        setMessage("Sacando Foto...");
        await refVistaCamara.current?.takePictureAsync();
      }, 500);
      setSubscriptionInterval(interval);
    } else {
      if (subscriptionInterval) {
        clearInterval(subscriptionInterval);
      }
    }
    return () => {
      if (subscriptionInterval) {
        clearInterval(subscriptionInterval);
      }
    };
  }, [readyToSend]);

  useEffect(() => {
    if (cameraReady && gpsReady && (velocidadValida || !deteccionActivada)) {
      setReadyToSend(true);
    } else {
      setReadyToSend(false);
    }
  }, [cameraReady, gpsReady, velocidadValida]);

  useEffect(() => {
    if (gpsHook.locationData.timestamp > 0) {
      setGPSReady(true);
    } else {
      setGPSReady(false);
    }
  }, [gpsHook.locationData]);
  // Benja
  const { width, height } = Dimensions.get("window");

  const data = [
    {
      key: "1",
      title: "Instrucciones de captura 1/10",
      description: "No hagas capturas de noche.",
      image: require("../../assets/images/instructions/night.png")
    },
    {
      key: "2",
      title: "Instrucciones de captura 2/10",
      description: "Cuando hay días soleados, la detección es regular.",
      image: require("../../assets/images/instructions/sunny.png")
    },
    {
      key: "3",
      title: "Instrucciones de captura 3/10",
      description: "Los días nublados son los mejores!!!",
      image: require("../../assets/images/instructions/cloudy.png")
    },
    {
      key: "4",
      title: "Instrucciones de captura 4/10",
      description: "Debes colocar el teléfono en cualquiera de estas posiciones, con un SOPORTE",
      image: require("../../assets/images/instructions/phone_ubication.gif")
    },
    {
      key: "5",
      title: "Instrucciones de captura 5/10",
      description: "Asegura que se vea el horizonte encuadre de la cámara.",
      image: require("../../assets/images/instructions/horizont.gif")
    },
    {
      key: "6",
      title: "Instrucciones de captura 6/10",
      description: "Si, no se ve el horizonte, la detección de imágenes no funcionará correctamente.",
      image: require("../../assets/images/instructions/image_angle.png")
    },
    {
      key: "7",
      title: "Instrucciones de captura 7/10",
      description: "Trata de manejar en sectores sin vehículos.",
      image: require("../../assets/images/instructions/optimal_capture.gif")
    },
    {
      key: "8",
      title: "Instrucciones de captura 8/10",
      description: "Si hay tráfico, mantén tu distancia.",
      image: require("../../assets/images/instructions/traffic.gif")
    },
    {
      key: "9",
      title: "Instrucciones de captura 9/10",
      description: "Si no respetas la distancia, la detección de imágenes no funcionará correctamente.",
      image: require("../../assets/images/instructions/vehicle_distance.png")
    },
    {
      key: "10",
      title: "Instrucciones de captura 10/10",
      description: "Por último, no manejes sobre los 50 Km/h, la imágen se distorsiona.",
      image: require("../../assets/images/instructions/speed_warning.gif")
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
      width: 300,
      height: 200,
      borderRadius: 20
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

  // Max
  useEffect(() => {
    if (deteccionActivada) {
      if (gpsHook.actualSpeed_KMH > 0) {
        if (gpsHook.actualSpeed_KMH <= velocidadKMH_Maxima + velocidadKMH_Umbral) {
          setVelocidadValida(true);

          if (modalVisible) {
            setModalVisible(false);
            setModalConfirmacionVisible(false);
          }
        }
        if (gpsHook.actualSpeed_KMH > velocidadKMH_Maxima + velocidadKMH_Umbral) {
          setVelocidadValida(false);

          if (!modalVisible) {
            setModalVisible(true);
            setModalConfirmacionVisible(false);
          }
        }
      } else {
        setVelocidadValida(false);
        if (modalVisible) {
          setModalVisible(false);
          setModalConfirmacionVisible(false);
        }
      }
    }
  }, [gpsHook.actualSpeed_KMH]);

  const renderVelocityMessage = () => {
    if (gpsHook.isSubscribed) {
      if (gpsHook.actualSpeed_KMH > 0) {
        if (gpsHook.actualSpeed_KMH > velocidadKMH_Maxima) {
          return <Text style={[contentStyles.text, { color: "#ffffff" }]}>Velocidad muy alta</Text>;
        } else {
          return null;
        }
      } else {
        return <Text style={[contentStyles.text, { color: "#ffffff" }]}>Esperando movimiento...</Text>;
      }
    } else {
      return null;
    }
  };

  const renderVelocityStatus = () => {
    if (deteccionActivada) {
      return (
        <>
          <Text style={[contentStyles.text, { color: "#ffffff" }]}>Velocidad: {gpsHook.actualSpeed_KMH} Km/h</Text>
          {renderVelocityMessage()}
          {/* <BotonFuncion texto="Mostrar modal" funcionEjecutar={() => setModalVisible(!modalVisible)} /> */}
        </>
      );
    } else {
      return <Text style={[contentStyles.text, { color: "#ffffff" }]}>Detección de velocidad desactivada.</Text>;
    }
  };

  return (
    <>
      <HeaderNew titulo="Envio Automático" goBack />
      <ImagenFondo>
        <View style={{ display: "flex", flex: 1 }}>
          <View style={[contentStyles.containerCentered, pageStyles.containerTop]}>
            {/* <Text style={[contentStyles.text, { color: "#ffffff" }]}>
              CameraReady: {cameraReady ? "True" : "False"}
            </Text>
            <Text style={[contentStyles.text, { color: "#ffffff" }]}>GPSReady: {gpsReady ? "True" : "False"}</Text>
            <Text style={[contentStyles.text, { color: "#ffffff" }]}>
              Velocidad Valida: {velocidadValida ? "True" : "False"}
            </Text>
            <Text style={[contentStyles.text, { color: "#ffffff" }]}>
              ReadyToSend: {readyToSend ? "True" : "False"}
            </Text> */}
            {renderVelocityStatus()}
            {/* <BotonFuncion texto="Mostrar modal" funcionEjecutar={() => setModalVisible(!modalVisible)} /> */}
          </View>
          <VistaCamara
            ref={refVistaCamara}
            noButtons
            onPhotoTaken={handlePhotoTaken}
            onCameraStatusChange={handleCameraStatusChange}
          />
          <View style={[contentStyles.containerCentered, pageStyles.containerBottom]}>
            {/* <Text>Estado GPS: {gpsReady ? "Activo" : "Inactivo"}</Text>
                <Text>Estado Cámara: {cameraReady ? "Activa" : "Inactiva"}</Text>
                <Text>Estado general: {readyToSend ? "Listo" : "No listo"}</Text>
                <Text>Latitud: {gpsHook.locationData.latitude}</Text>
                <Text>Longitud: {gpsHook.locationData.longitude}</Text>
                <Text>Timestamp: {gpsHook.locationData.timestamp}</Text>
                <Text>Uri de la foto: {photoUri}</Text> */}
            {renderSubscriptionButton()}
            {/* <Text>Respuesta del servidor: {response}</Text> */}
            {renderCoordinates()}
            {renderMessage()}
          </View>
        </View>
      </ImagenFondo>

      {/* Max */}
      <VistaPopUp esVisible={modalVisible} onRequestClose={() => {}}>
        <Tarjeta titulo="⚠️ Alerta de velocidad" centrado>
          <Image source={img_velocimetro} style={{ width: "100%", height: 120, resizeMode: "contain" }} />
          <Text style={[contentStyles.text, { color: primaryColor, fontSize: 30 }]}>Captura pausada.</Text>
          <Text style={[contentStyles.text, { fontSize: 30 }]}>Baje la velocidad a</Text>
          <Text style={[contentStyles.text, { fontSize: 30 }]}>{velocidadKMH_Maxima} Km/h</Text>
          <Text style={[contentStyles.text, { fontSize: 30 }]}>para reanudar.</Text>
          <Text style={[contentStyles.text, { color: errorColor, fontSize: 30 }]}>
            Actual: {gpsHook.actualSpeed_KMH} Km/h
          </Text>
          <View style={{ height: 40 }} />
          <Text style={contentStyles.text}>
            Las imagenes en velocidades altas se ven borrosas y la calidad de la detección puede verse disminuida.
          </Text>
          <BotonFuncion
            texto="Detener captura"
            style={{ backgroundColor: errorColor, width: "100%", height: 100, maxHeight: 100 }}
            icono="stop"
            funcionEjecutar={() => {
              setModalConfirmacionVisible(true);
            }}
          />
        </Tarjeta>
      </VistaPopUp>

      <VistaPopUp
        esVisible={modalConfirmacionVisible}
        onRequestClose={() => {
          setModalConfirmacionVisible(false);
        }}
      >
        <Tarjeta titulo="Detener captura" centrado>
          <Text style={contentStyles.text}>Está a punto de detener la captura de datos.</Text>
          <BotonFuncion
            texto="Cancelar"
            style={{ backgroundColor: primaryColor, width: "100%", height: 100, maxHeight: 100 }}
            funcionEjecutar={() => setModalConfirmacionVisible(false)}
          />
          <BotonFuncion
            texto="Detener"
            style={{ backgroundColor: errorColor, width: "100%", height: 100, maxHeight: 100 }}
            icono="stop"
            funcionEjecutar={async () => {
              await handleDisableSubscription();
              setVelocidadValida(false);
              setReadyToSend(false);
              setModalVisible(false);
              setModalConfirmacionVisible(false);
            }}
          />
        </Tarjeta>
      </VistaPopUp>

      {/* Benja */}
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

export default EnvioDatosAuto;

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
