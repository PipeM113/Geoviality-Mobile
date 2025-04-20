import { ExpoConfig, ConfigContext } from "expo/config";

// Variables. Modificar estos valores según sea necesario
const app_name = "Geoviality";
const app_slug = "geoviality";
const app_version = process.env.EXPO_PUBLIC_VERSION || "1.0.0";
const app_root_folder = "./src";

const app_icon_path = `${app_root_folder}/assets/images/application/app-icon.png`;
const app_splash_path = `${app_root_folder}/assets/images/application/splash.png`;
const app_adaptive_path = `${app_root_folder}/assets/images/application/adaptive-icon.png`;
const app_favicon_path = `${app_root_folder}/assets/images/application/favicon.png`;

// Configuracion exportada
// Los valores como ...config son los valores por defecto que se encuentran en el archivo app.json
const app_config = ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: app_name,
    slug: app_slug,
    version: app_version,
    icon: app_icon_path,
    splash: {
      ...config.splash,
      image: app_splash_path
    },
    web: {
      ...config.web,
      favicon: app_favicon_path
    },
    android: {
      ...config.android,
      adaptiveIcon: {
        ...config.android?.adaptiveIcon,
        foregroundImage: app_adaptive_path
      }
    }
  };
};

export default app_config;
