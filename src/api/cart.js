import { http } from "./http";

export async function apiGetCart() {
  const { data } = await http.get("/cart");
  return data; // { cartId, items }
}

export async function apiAddCartItem(menuItemId, qty = 1) {
  const { data } = await http.post("/cart/items", { menuItemId, qty });
  return data;
}

export async function apiSetCartItemQty(menuItemId, qty) {
  const { data } = await http.patch(`/cart/items/${menuItemId}`, { qty });
  return data;
}

export async function apiRemoveCartItem(menuItemId) {
  const { data } = await http.delete(`/cart/items/${menuItemId}`);
  return data;
}
