import axios from "axios";

const baseURL =
  import.meta.env.MODE === "development"
    ? "/api" // dev -> Vite proxy
    : import.meta.env.VITE_API_URL; // prod -> must be https://api.your-domain.com

export const http = axios.create({
  baseURL,
  withCredentials: true,
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Request failed";
    err.userMessage = msg;
    return Promise.reject(err);
  }
);

