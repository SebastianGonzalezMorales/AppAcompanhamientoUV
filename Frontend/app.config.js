const CLEAR_TEXT_PLUGIN_PATH = "./plugins/withCleartextTraffic";

const hasPlugin = (plugins = [], pluginName) =>
  plugins.some((plugin) =>
    Array.isArray(plugin) ? plugin[0] === pluginName : plugin === pluginName
  );

export default ({ config }) => {
  const existingPlugins = config.plugins || [];
  const existingPermissions = config.android?.permissions || [];

  const plugins = [...existingPlugins];

  if (!hasPlugin(plugins, "expo-build-properties")) {
    plugins.push([
      "expo-build-properties",
      {
        android: {
          usesCleartextTraffic: true,
        },
      },
    ]);
  }

  if (!hasPlugin(plugins, CLEAR_TEXT_PLUGIN_PATH)) {
    plugins.push(CLEAR_TEXT_PLUGIN_PATH);
  }

  return {
    ...config,
    android: {
      ...config.android,
      usesCleartextTraffic: true,
      permissions: Array.from(new Set([...existingPermissions, "INTERNET"])),
    },
    plugins,
    extra: {
      ...config.extra,
      API_URL: process.env.API_URL,
      BASE_URL: process.env.BASE_URL,
      BUILD_DIAGNOSTIC_ID: new Date().toISOString(),
    },
  };
};
