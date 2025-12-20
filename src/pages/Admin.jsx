import { useEffect, useState } from "react";
import api from "../api";

export default function Admin() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/api/admin/orders").then(res => setOrders(res.data));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Admin Orders</h2>
      {orders.map(o => (
        <div key={o.id}>
          #{o.id} — {o.status} — {o.customer_email}
        </div>
      ))}
    </div>
  );
}
