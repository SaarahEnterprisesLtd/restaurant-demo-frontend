import { http } from "./http";

export async function apiGetMenu() {
  console.log("Fetch menu")
  const { data } = await http.get("/menu");
  return data; // { items: [...] } or [...]
}

// Admin
export async function apiCreateMenuItem(payload) {
  const { data } = await http.post("/admin/menu", payload);
  return data;
}

export async function apiUpdateMenuItem(id, payload) {
  const { data } = await http.put(`/admin/menu/${id}`, payload);
  return data;
}

export async function apiDeleteMenuItem(id) {
  const { data } = await http.delete(`/admin/menu/${id}`);
  return data;
}

export async function apiAdminCategories() {
  const { data } = await http.get("/admin/categories");
  return data; // { categories: [...] }
}

export async function apiAdminCreateMenuItem(payload) {
  const { data } = await http.post("/admin/menu", payload);
  return data; // { id }
}


export async function apiAdminDeleteMenuItem(id) {
  console.log("Req to delete")
  const { data } = await http.delete(`/admin/menu/${id}`);
  return data;
}
