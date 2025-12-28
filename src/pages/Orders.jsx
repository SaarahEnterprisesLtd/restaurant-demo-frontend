import React, { useEffect, useMemo, useState } from "react";
import { apiGetMyOrders } from "../api/orders";
import { useSocket } from "../hooks/useSocket";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const data = await apiGetMyOrders();
      setOrders(data.orders ?? data ?? []);
    } catch (e) {
      setErr(e.userMessage || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const byId = useMemo(() => new Map(orders.map((o) => [o.id, o])), [orders]);

  useSocket({
    enabled: true,
    onOrderUpdate: (payload) => {
      // expected payload: { orderId, status, updatedAt }
      const existing = byId.get(payload.orderId);
      if (!existing) return;
      setOrders((prev) =>
        prev.map((o) => (o.id === payload.orderId ? { ...o, status: payload.status } : o))
      );
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">My Orders</h1>

      {loading && <div className="mt-4 opacity-70">Loading…</div>}
      {err && <div className="mt-4 text-red-400 text-sm">{err}</div>}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {orders.map((o) => (
          <div key={o.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Order #{o.id}</div>
              <div className="text-sm rounded-lg bg-white/10 px-2 py-1">{o.status ?? "pending"}</div>
            </div>
            <div className="mt-2 text-sm opacity-75">
              Total: £{Number(o.total ?? 0).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
