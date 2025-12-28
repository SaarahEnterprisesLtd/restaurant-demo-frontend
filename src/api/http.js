import axios from "axios";

const isDev = import.meta.env.MODE === "development";


const baseURL = isDev
  ? "/api"
  : (import.meta.env.VITE_API_URL || "https://saarah-eats-9gof7.ondigitalocean.app");

export const http = axios.create({
  baseURL,
  withCredentials: true,
});

