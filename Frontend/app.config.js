export default ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      API_URL: "https://7b2e31bc37af.ngrok-free.app/api/v1",
      BASE_URL: "https://7b2e31bc37af.ngrok-free.app",
    },
  };
};
