import { useEffect, useState } from "react";

// Aunque el el hook no sea invocado, el módulo se carga porque se importa en otro componente.
console.log("usePrueba/0 - Modulo cargado.");

// HOOK: Función que devuelve valores, y no renderiza un componente. Es decir, no retorna JSX.
const usePrueba = () => {
  // Cuando se requiere renderizar un componente que usa este hook, se ejecuta la función
  console.log("usePrueba/1 - Cargando hook...");

  // ESTADOS: Variables que al cambiar valor provocan que se vuelva a renderizar el componente que usa este hook.
  const [timer, setContador] = useState(0);

  // Los 'useEffect' se ejecutan despues de renderizar el componente que usa este hook
  // *** El 'useEffect' de los hooks se ejecuta antes de los 'useEffect' del componente

  // EFECTO 1: Se ejecuta una sola vez (array de dependencias vacío) [montado/desmontado]
  useEffect(() => {
    console.log("usePrueba/2 - Efecto 1 []: montando... (Efecto se ejecutara una sola vez)");

    // Incrementar contador cada 2 segundos
    const interval = setInterval(() => {
      console.log("usePrueba/3 - Efecto 1 []: incrementando timer... (estado cambio)");
      // Actualizar el estado provocará que se vuelva a renderizar el componente
      setContador((prev) => prev + 1);
    }, 2000);

    // Se ejecuta una sola vez antes de desmontar el componente (limpieza)
    return () => {
      console.log("usePrueba/4 - Efecto 1 []: desmontando... (Efecto se ejecutara una sola vez)");
      clearInterval(interval);
    };
  }, []); // Array de dependencias vacío: se ejecuta una sola vez

  // EFECTO 2: Se ejecuta cada vez que el estado del componente cambia (no hay array de dependencias)
  useEffect(() => {
    console.log("usePrueba/5 - Efecto 2: ejecutando...");

    // Se ejecuta antes de volver a ejecutar este efecto (limpieza) o antes de desmontar el componente
    return () => {
      console.log("usePrueba/6 - Efecto 2: haciendo algo antes de volver a ejecutar...");
    };
  }); // No hay array de dependencias: se ejecuta cada vez que el componente cambia, siempre

  // Al llegar a este punto el hook retorna los valores que se deseen
  console.log("usePrueba/7 - Retornando datos");
  return { timer };
};

export default usePrueba;
