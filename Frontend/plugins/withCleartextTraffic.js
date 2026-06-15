const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withCleartextTraffic(config) {
  const apiUrl = config.extra?.API_URL || "";
  const baseUrl = config.extra?.BASE_URL || "";
  const allowCleartextTraffic =
    process.env.ALLOW_CLEARTEXT_TRAFFIC === "true" ||
    /^http:\/\//i.test(apiUrl) ||
    /^http:\/\//i.test(baseUrl);

  return withAndroidManifest(config, (config) => {
    const application = config.modResults.manifest.application?.[0];

    if (application) {
      application.$["android:usesCleartextTraffic"] = allowCleartextTraffic
        ? "true"
        : "false";
    }

    return config;
  });
};
