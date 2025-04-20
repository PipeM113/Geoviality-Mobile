import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type Props = {
  icono?: string;
  size?: number;
  color?: string;
  vel?: number;
};

// TODO: Documentar esto
/**
 * Renderiza un ícono de carga que rota continuamente.
 *
 * @component
 * @param {string} [icono="loading"] - El nombre del ícono a mostrar.
 * @param {number} [size=25] - El tamaño del ícono.
 * @param {string} [color="#ffffff"] - El color del ícono.
 * @param {number} [vel=500] - La duración de la animación de rotación en milisegundos.
 */
function IconoCargando({ icono = "loading", size = 25, color = "#ffffff", vel = 500 }: Props) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: vel,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  }, []);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"]
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }]
  };

  return (
    <Animated.View style={animatedStyle}>
      <Icon name={icono} size={size} color={color} />
    </Animated.View>
  );
}

export default IconoCargando;
