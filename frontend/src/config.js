const productionApiUrl =
  "https://brogetbuilder-production.up.railway.app/api";

const rawApiUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5000/api"
    : productionApiUrl);

export const API_URL = rawApiUrl.replace(/\/$/, "");
