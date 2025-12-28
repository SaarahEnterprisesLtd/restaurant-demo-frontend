import { http } from "./http";

export async function apiCreateOrder(payload) {
  // payload example: { items: [{menuItemId, qty}], notes, address }
  const { data } = await http.post("/orders", payload);
  return data; // { order }
}

export async function apiGetMyOrders() {
  const { data } = await http.get("/orders/me");
  return data; // { orders }
}

export async function apiCreatePaymentIntent(payload) {
  // payload example: { orderId } or cart items
  const { data } = await http.post("/payments/create-intent", payload);
  return data; // { clientSecret }
}
