
export default ({ config }) => {
    // Aquí, process.env.API_URL vendrá de EAS si estás haciendo un eas build
    config.extra = {
        ...config.extra, // esto conserva projectId y lo que haya
      API_URL: process.env.API_URL,
      BASE_URL: process.env.BASE_URL,

    };
    return config;
  };
  