import { http } from "./http";
import axios from "axios";

export async function apiLogin(email, password) {
  const { data } = await http.post("/auth/login", { email, password });
  return data; // ideally returns { user }
}

export async function apiRegister(payload) {
  const { data } = await http.post("/auth/register", payload);
  return data;
}

export async function apiMe() {
  const { data } = await http.get("/auth/me");
  return data; // { user }
}

export async function apiLogout() {
  const { data } = await http.post("/auth/logout");
  return data;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});


