const CLEAR_TEXT_PLUGIN_PATH = "./plugins/withCleartextTraffic";

const hasPlugin = (plugins = [], pluginName) =>
  plugins.some((plugin) =>
    Array.isArray(plugin) ? plugin[0] === pluginName : plugin === pluginName
  );

const normalizeBaseUrl = (value) =>
  value ? value.trim().replace(/\/+$/, "") : value;

const normalizeApiUrl = (value) => {
  if (!value) {
    return value;
  }

  return value.trim().replace(/\/+$/, "");
};

export default ({ config }) => {
  const existingPlugins = config.plugins || [];
  const existingPermissions = config.android?.permissions || [];
  const apiUrl = normalizeApiUrl(process.env.API_URL);
  const baseUrl = normalizeBaseUrl(process.env.BASE_URL);
  const allowCleartextTraffic =
    process.env.ALLOW_CLEARTEXT_TRAFFIC === "true" ||
    /^http:\/\//i.test(apiUrl || "") ||
    /^http:\/\//i.test(baseUrl || "");

  const plugins = [...existingPlugins];

  if (!hasPlugin(plugins, "expo-build-properties")) {
    plugins.push([
      "expo-build-properties",
      {
        android: {
          usesCleartextTraffic: allowCleartextTraffic,
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
      usesCleartextTraffic: allowCleartextTraffic,
      permissions: Array.from(new Set([...existingPermissions, "INTERNET"])),
    },
    plugins,
    extra: {
      ...config.extra,
      API_URL: apiUrl,
      BASE_URL: baseUrl,
    },
  };
};
