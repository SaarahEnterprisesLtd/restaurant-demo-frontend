import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "saareats_cart_v1";

function safeParse(json) {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  // Load once from localStorage
  const [items, setItems] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? safeParse(raw) : [];
  });

  // Persist on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function add(item) {
    setItems((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found) return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + 1 } : p));
      return [...prev, { ...item, qty: 1 }];
    });
  }

  function remove(id) {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  function setQty(id, qty) {
    const nextQty = Number(qty);
    setItems((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: nextQty } : p))
        .filter((p) => p.qty > 0)
    );
  }

  function clear() {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  // ✅ Must be defined BEFORE value useMemo references it
  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + Number(it.price) * it.qty, 0),
    [items]
  );

  // ✅ New helpers for auth merge/sync
  function replace(nextItems) {
    setItems(Array.isArray(nextItems) ? nextItems : []);
  }

  function toPayload() {
    return items.map((it) => ({ menuItemId: it.id, qty: it.qty }));
  }

  const value = useMemo(
    () => ({ items, add, remove, setQty, clear, subtotal, replace, toPayload }),
    [items, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
