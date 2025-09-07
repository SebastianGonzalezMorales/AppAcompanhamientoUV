export default ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      API_URL: "https://f8d95141e172.ngrok-free.app/api/v1",
      BASE_URL: "https://f8d95141e172.ngrok-free.app",
    },
  };
};
