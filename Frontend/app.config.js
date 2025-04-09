export default ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      API_URL: process.env.API_URL,
      BASE_URL: process.env.BASE_URL,
    },
  };
};
