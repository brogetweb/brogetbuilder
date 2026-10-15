import { defineRailway, github, preserve, project, service } from "railway/iac";

export default defineRailway(() => {
  const api = service("backend", {
    source: github("brogetweb/brogetbuilder", {
      rootDirectory: "backend",
    }),
    start: "npm start",
    healthcheck: "/health",
    healthcheckTimeout: 100,
    env: {
      MONGO_URI: preserve(),
      JWT_SECRET: preserve(),
      CORS_ORIGIN: preserve(),
      CLOUDINARY_CLOUD_NAME: preserve(),
      CLOUDINARY_API_KEY: preserve(),
      CLOUDINARY_API_SECRET: preserve(),
      VAPI_PRIVATE_KEY: preserve(),
      VAPI_ASSISTANT_ID: preserve(),
      VAPI_PHONE_NUMBER_ID: preserve(),
    },
  });

  return project("brogetbuilder", {
    resources: [api],
  });
});
