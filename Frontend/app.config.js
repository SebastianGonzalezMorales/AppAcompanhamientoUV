export default ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      API_URL: "https://7485e0d24aca.ngrok-free.app/api/v1",
      BASE_URL: "https://7485e0d24aca.ngrok-free.app",
    },
  };
};
