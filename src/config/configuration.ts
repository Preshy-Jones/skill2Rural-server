export default () => ({
  port: parseInt(process.env.PORT),
  env: {
    isProduction: process.env.API_ENV === "production",
    isDevelopment: process.env.API_ENV === "development",
    isStaging: process.env.API_ENV === "staging",
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION,
  },
});
