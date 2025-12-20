import { useEffect, useState } from "react";
import api from "../api";

export default function Menu() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/api/menu").then(res => setItems(res.data));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Menu</h2>
      {items.map(i => (
        <div key={i.id} style={{ marginBottom: 12 }}>
          <strong>{i.name}</strong> — ₹{i.price_paise / 100}
          <p>{i.description}</p>
        </div>
      ))}
    </div>
  );
}
