import { useEffect, useState } from "react";
import api from "../api";
import { io } from "socket.io-client";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/api/orders/my").then(res => setOrders(res.data));
  }, []);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL, { withCredentials: true });
    orders.forEach(o => socket.emit("joinOrder", o.id));
    socket.on("orderStatusUpdated", () => {
      api.get("/api/orders/my").then(res => setOrders(res.data));
    });
    return () => socket.disconnect();
  }, [orders]);

  return (
    <div style={{ padding: 24 }}>
      <h2>My Orders</h2>
      {orders.map(o => (
        <div key={o.id}>
          Order #{o.id} — {o.status}
        </div>
      ))}
    </div>
  );
}
