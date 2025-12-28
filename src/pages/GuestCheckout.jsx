import React, { useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
const GUEST_KEY = "saareats_guest_checkout_v1";

function moneyGBP(n) {
  const x = Number(n || 0);
  return `£${x.toFixed(2)}`;
}

export default function GuestCheckout({ onBackToLogin }) {
  const { items, subtotal } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address1: "",
    city: "",
    postcode: "",
    notes: "",
  });

  const itemCount = useMemo(() => items.reduce((s, it) => s + it.qty, 0), [items]);

  function setField(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function handleContinue(e) {
    e.preventDefault();
  
    if (!form.name || !form.email || !form.address1 || !form.postcode) {
      alert("Please fill name, email, address, and postcode.");
      return;
    }
  
    // ✅ Save guest details for Payment page
    localStorage.setItem(GUEST_KEY, JSON.stringify(form));
  
    // go to payment as guest
    window.location.href = "/pay?guest=1";
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Guest Checkout</h2>
          <p className="mt-1 text-sm text-gray-600">
            You’re checking out as a guest. You won’t see order history unless you create an account.
          </p>
        </div>

        {onBackToLogin ? (
          <button
            type="button"
            onClick={onBackToLogin}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
          >
            Login instead
          </button>
        ) : null}
      </div>

      {/* Order summary */}
      <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center justify-between text-sm text-gray-700">
          <span>{itemCount} item(s)</span>
          <span className="font-semibold text-gray-900">{moneyGBP(subtotal)}</span>
        </div>
      </div>

      <form onSubmit={handleContinue} className="mt-5 grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-sm text-gray-700">Full name *</label>
            <input
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              autoComplete="name"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Email *</label>
            <input
              type="email"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Phone</label>
            <input
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
              autoComplete="tel"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-700">Address line 1 *</label>
          <input
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
            value={form.address1}
            onChange={(e) => setField("address1", e.target.value)}
            autoComplete="address-line1"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-sm text-gray-700">City</label>
            <input
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
              value={form.city}
              onChange={(e) => setField("city", e.target.value)}
              autoComplete="address-level2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">Postcode *</label>
            <input
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
              value={form.postcode}
              onChange={(e) => setField("postcode", e.target.value)}
              autoComplete="postal-code"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-700">Notes</label>
          <textarea
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
            rows={3}
            value={form.notes}
            onChange={(e) => setField("notes", e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={items.length === 0}
          className="mt-2 w-full rounded-xl bg-emerald-500 px-4 py-3 font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
        >
          Continue to payment
        </button>
      </form>
    </div>
  );
}
