import { http } from "./http";

export async function apiSyncUserCart(items) {
  // items: [{ id, qty }]
  const { data } = await http.post("/cart/sync", { items });
  return data;
}

export async function apiSaveGuestCart(items) {
  // items: [{ id, qty }]
  const { data } = await http.post("/guest-cart", { items });
  return data;
}
