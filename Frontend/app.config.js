export default ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      API_URL: "https://5c0226b493a2.ngrok-free.app/api/v1",
      BASE_URL: "https://5c0226b493a2.ngrok-free.app"
    },
  };
};
