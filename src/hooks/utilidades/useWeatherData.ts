import { useEffect, useState } from "react";

import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

type WeatherData = {
  hora_actual: DateObject;
  es_dia: number;
  codigoClima: number;
  hora_amanecer: DateObject;
  hora_atardecer: DateObject;
  porc_nubosidad: number;
  porc_prob_precipitacion: number;
  metros_visibilidad: number;
};

type DateObject = {
  anio: number;
  mes: number;
  dia: number;
  hora: number;
  minutos: number;
};

type WeatherDataResponse = WeatherData & { optimalidad: number };

function useWeatherData(latitude: number = -33.4569, longitude: number = -70.6483) {
  // console.log("useWeatherData - Cargando hook...");

  const [weatherData, setWeatherData] = useState<WeatherDataResponse | null>(null);

  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,weather_code,cloud_cover&hourly=temperature_2m,weather_code,cloud_cover,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max&timezone=America%2FSantiago&forecast_days=1`;

  //MARK: Funciones de utilidad
  const parseWeatherData = (data: any) => {
    const hora_actual: DateObject = parseDateString(data.current.time);

    const es_dia: number = data.current.is_day;
    const codigoClima: number = data.current.weather_code;
    const hora_amanecer: DateObject = parseDateString(data.daily.sunrise[0]);
    const hora_atardecer: DateObject = parseDateString(data.daily.sunset[0]);
    const porc_nubosidad: number = data.current.cloud_cover;
    const metros_visibilidad: number = data.hourly.visibility[aproximarHora(hora_actual.hora, hora_actual.minutos)];
    const porc_prob_precipitacion: number = data.daily.precipitation_probability_max[0];

    return {
      hora_actual,
      es_dia,
      codigoClima,
      hora_amanecer,
      hora_atardecer,
      porc_nubosidad,
      porc_prob_precipitacion,
      metros_visibilidad
    } as WeatherData;
  };

  const parseDateString = (fecha: string) => {
    const [parte_fecha, parte_hora] = fecha.split("T");
    const [anio, mes, dia] = parte_fecha.split("-");
    const [hora, minutos] = parte_hora.split(":");

    return {
      anio: parseInt(anio),
      mes: parseInt(mes),
      dia: parseInt(dia),
      hora: parseInt(hora),
      minutos: parseInt(minutos)
    } as DateObject;
  };

  // Aproxima la hora a la hora más cercana
  const aproximarHora = (hora: number, minutos: number) => {
    // Ejemplo:
    // 20:00 -> 20
    // 20:15 -> 20
    // 20:30 -> 21
    // 20:45 -> 21
    // 21:00 -> 21
    // 23:30 -> 0

    if (minutos < 30) {
      return hora;
    } else {
      if (hora === 23) {
        return 0;
      }
      return hora + 1;
    }
  };

  const evaluarClima = (weatherData: WeatherData) => {
    if (weatherData.es_dia === 0) {
      return 4; // NO OPTIMO: Es de noche
    }

    if (
      !(
        weatherData.hora_actual.hora >= weatherData.hora_amanecer.hora + 2 &&
        weatherData.hora_actual.hora <= weatherData.hora_atardecer.hora - 2
      )
    ) {
      return 3; // NO OPTIMO: Poca luz
    }

    if (weatherData.codigoClima === 2 || weatherData.codigoClima === 3) {
      // Dia nublado
      if (weatherData.porc_prob_precipitacion <= 45) {
        return 0; // OPTIMO
      }
      return 2; // MODERADO: Dia nublado con probabilidad de lluvia
    }

    if (weatherData.codigoClima === 0 || weatherData.codigoClima === 1) {
      // Dia despejado
      // Si la hora actual esta entre las 12 y las 17
      if (weatherData.hora_actual.hora >= 12 && weatherData.hora_actual.hora <= 17) {
        return 1; // MODERADO: Dia despejado con probabilidad de sombras largas
      }
      return 0; // OPTIMO
    }

    return 5; // NO OPTIMO: Otro tipo de clima
  };
  //======================

  const getWeatherData = async () => {
    const requestConfig: AxiosRequestConfig = {
      method: "get",
      url: apiUrl,
      maxBodyLength: Infinity,
      headers: {}
    };

    // console.log("useWeatherData/sendTestData - Enviando petiticon...");
    try {
      const res = await axios(requestConfig);
      // console.log("useWeatherData/sendTestData - Respuesta del servidor:", res.data);

      const datos_clima = parseWeatherData(res.data);
      const optimalidad = evaluarClima(datos_clima);
      const objeto_respuesta = { ...datos_clima, optimalidad };

      setWeatherData(objeto_respuesta);
      return objeto_respuesta;
    } catch (error) {
      console.error("useWeatherData/sendTestData - Error:", error);
      return null;
    }
  };

  const getFechaActualString = (soloHora: boolean = false) => {
    if (weatherData) {
      const horaString =
        weatherData.hora_actual.hora < 10 ? `0${weatherData.hora_actual.hora}` : `${weatherData.hora_actual.hora}`;
      const minutosString =
        weatherData.hora_actual.minutos < 10
          ? `0${weatherData.hora_actual.minutos}`
          : `${weatherData.hora_actual.minutos}`;

      if (soloHora) return `${horaString}:${minutosString}`;

      return `${weatherData.hora_actual.dia}/${weatherData.hora_actual.mes}/${weatherData.hora_actual.anio} ${horaString}:${minutosString}`;
    }
    return "Sin datos";
  };

  const getAmanecerString = () => {
    if (weatherData) {
      return `${weatherData.hora_amanecer.hora}:${weatherData.hora_amanecer.minutos}`;
    }
    return "Sin datos";
  };

  const getAtardecerString = () => {
    if (weatherData) {
      return `${weatherData.hora_atardecer.hora}:${weatherData.hora_atardecer.minutos}`;
    }
    return "Sin datos";
  };

  const getClimaString = () => {
    if (weatherData) {
      switch (weatherData.codigoClima) {
        case 0:
          return "☀️ Despejado";
        case 1:
          return "☀️ Despejado";
        case 2:
          return "⛅ Parc. nublado";
        case 3:
          return "☁️ Nublado";
        case 45:
        case 48:
          return "🌫️ Niebla";
        case 51:
        case 53:
        case 55:
        case 56:
        case 57:
          return "🌦️ Llovizna";
        case 61:
        case 63:
        case 65:
        case 66:
        case 67:
          return "🌧️ Lluvia";
        case 71:
        case 73:
        case 75:
          return "❄️ Nieve";
        case 77:
          return "🌨️ Granizo";
        case 80:
        case 81:
        case 82:
          return "🌧️ Lluvia";
        case 85:
        case 86:
          return "❄️ Nieve";
        default:
          return "❓ Desc.";
      }
    }
    return "Sin datos";
  };

  const getOptimalidadString = () => {
    if (weatherData) {
      switch (weatherData.optimalidad) {
        case 0:
          return "Optimo";
        case 1:
          return "Moderado: Sombras largas";
        case 2:
          return "Moderado: Prob. de lluvia";
        case 3:
          return "No Optimo: Poca Luz";
        case 4:
          return "No Optimo: Es de noche";
        case 5:
          return "No Optimo: Clima adverso";
        default:
          return "Sin datos";
      }
    }
    return "Sin datos";
  };

  const getEsDeDiaString = () => {
    if (weatherData) {
      return weatherData.es_dia === 1 ? "☀️ Si" : "🌙 No";
    }
    return "Sin datos";
  };

  return {
    getWeatherData,
    weatherData,
    getFechaActualString,
    getAmanecerString,
    getAtardecerString,
    getClimaString,
    getOptimalidadString,
    getEsDeDiaString
  };
}

export default useWeatherData;
