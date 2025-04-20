import React, { useEffect, useState } from "react";
import BotonFuncion from "@src/components/usables/BotonFuncion";
import { Text } from "react-native";
import usePrueba from "@src/hooks/pruebas/usePrueba";
import { contentStyles } from "@src/constants/uiStyles";

// Aunque el componente no sea renderizado, el módulo se carga porque se importa en otro componente.
console.log("ComponentePrueba/0 - Modulo cargado.");

// COMPONENTE: Función que devuelve un componente de React. Se ejecuta al renderizar el componente.
const ComponentePrueba = () => {
  // Cuando se requiere renderizar el componente, se ejecuta la función
  console.log("===============================");
  console.log("ComponentePrueba/1 - Cargando componente...");

  // ESTADOS: Variables que al cambiar valor provocan que se vuelva a renderizar el componente.
  const [contador, setContador] = useState(0);
  const [mostrar, setMostrar] = useState(true);

  // HOOKS: Funciones que se ejecutan antes de renderizar el componente
  const cosa = usePrueba();

  // Los 'useEffect' se ejecutan despues de renderizar el componente
  // *** El 'useEffect' de los hooks se ejecuta antes de los 'useEffect' del componente
  // *** Los 'useEffect' se ejecutan al menos una vez, después de renderizar el componente por primera vez

  // EFECTO 1: Se ejecuta una sola vez (array de dependencias vacío) [montado/desmontado]
  useEffect(() => {
    console.log("ComponentePrueba/2 - Efecto 1 []: montando... (Efecto se ejecutara una sola vez)");

    // Se ejecuta una sola vez antes de desmontar el componente (limpieza)
    return () => {
      console.log("ComponentePrueba/3 - Efecto 1 []: desmontando... (Efecto se ejecutara una sola vez)");
    };
  }, []); // Array de dependencias vacío: se ejecuta una sola vez

  // EFECTO 2: Se ejecuta cada vez que el estado del componente cambia (no hay array de dependencias)
  useEffect(() => {
    console.log("ComponentePrueba/4 - Efecto 2: ejecutando...");

    if (mostrar) {
      console.log("         El componente está mostrado");
    } else {
      console.log("         El componente está oculto");
    }

    // Se ejecuta antes de volver a ejecutar este efecto (limpieza) o antes de desmontar el componente
    return () => {
      console.log("ComponentePrueba/5 - Efecto 2: haciendo algo antes de volver a ejecutar...");
    };
  }); // No hay array de dependencias: se ejecuta cada vez que el componente cambia, siempre

  // EFECTO 3: Se ejecuta una vez (primer renderizado) y luego cada vez que el estado 'mostrar' cambia (array de dependencias)
  useEffect(() => {
    console.log("ComponentePrueba/6 - Efecto 3 [mostrar]: ejecutando...");

    if (contador % 2 === 0) {
      console.log("         El contador es par");
    } else {
      console.log("         El contador es impar");
    }

    // Se ejecuta antes de volver a ejecutar este efecto (limpieza) o antes de desmontar el componente
    return () => {
      console.log("ComponentePrueba/7 - Efecto 3 [mostrar]: haciendo algo antes de volver a ejecutar...");
    };
  }, [mostrar]); // Array de dependencias: se ejecuta una vez (primer renderizado) y luego cuando el estado 'mostrar' cambia

  // HANDLERS: Funciones que se ejecutan al hacer alguna accion.
  const handleIncrementar = () => {
    console.log("ComponentePrueba/8 - Boton 1: click realizado. Contador (estado cambio)");

    // Actualizar el estado provocará que se vuelva a renderizar el componente
    setContador(contador + 1);
  };

  const handleComponente = () => {
    console.log("ComponentePrueba/9 - Boton 2: click realizado. Mostrar (estado cambio)");

    // Actualizar el estado provocará que se vuelva a renderizar el componente
    setMostrar(!mostrar);
  };

  // RENDERS: Funciones que devuelven elementos JSX. Se ejecutan al renderizar el componente
  const renderTexto = () => {
    if (mostrar) {
      return <Text>Componente mostrado</Text>;
    } else {
      return null;
    }
  };

  // Al llegar a este punto se renderiza el componente
  console.log("ComponentePrueba/10 - Renderizando componente");
  console.log("===============================");
  return (
    <>
      <Text style={contentStyles.text}>Contador: {contador}</Text>
      <BotonFuncion texto="Incrementar contador" funcionEjecutar={handleIncrementar} icono="plus" />
      <BotonFuncion texto="Ocultar componente" funcionEjecutar={handleComponente} icono="eye" />
      {renderTexto()}
      <Text>Timer hook: {cosa.timer}</Text>
    </>
  );
};

export default ComponentePrueba;
