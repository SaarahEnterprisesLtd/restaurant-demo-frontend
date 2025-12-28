import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import GuestCheckout from "./GuestCheckout";
import { apiSaveGuestCart, apiSyncUserCart } from "../api/cartSync";

function moneyGBP(n) {
  const x = Number(n || 0);
  return `£${x.toFixed(2)}`;
}

export default function Checkout() {
  const { user, login } = useAuth();
  const { items, subtotal } = useCart();

  const [params, setParams] = useSearchParams();
  const guestMode = params.get("guest") === "1";
  const navigate = useNavigate();

  const itemCount = useMemo(() => items.reduce((s, it) => s + it.qty, 0), [items]);

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loginErr, setLoginErr] = useState("");

  // ✅ Sync cart once when checkout opens (no UI message)
  const syncOnceRef = useRef(false);
  useEffect(() => {
    if (syncOnceRef.current) return;
    syncOnceRef.current = true;

    (async () => {
      if (!items || items.length === 0) return;

      const payload = items.map((it) => ({ id: it.id, qty: it.qty }));

      try {
        if (user) {
          await apiSyncUserCart(payload);
        } else {
          await apiSaveGuestCart(payload);
        }
      } catch (e) {
        // silent fail (no message)
        console.warn("Cart sync failed:", e?.userMessage || e?.message || e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginErr("");
    setLoadingLogin(true);
    try {
      await login(email, password);

      // remove guest mode if present
      params.delete("guest");
      setParams(params, { replace: true });

      navigate("/checkout", { replace: true });
    } catch (err) {
      setLoginErr(err?.userMessage || err?.message || "Login failed");
    } finally {
      setLoadingLogin(false);
    }
  }

  function switchToGuest() {
    setParams({ guest: "1" }, { replace: true });
  }

  function switchToLogin() {
    params.delete("guest");
    setParams(params, { replace: true });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* LEFT: Login / Guest / Logged-in */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {user ? (
            <>
              <div className="text-lg font-semibold text-gray-900">You’re logged in</div>
              <div className="mt-1 text-sm text-gray-600">
                Continue to payment when you’re ready.
              </div>

              <button
                onClick={() => navigate("/pay")}
                disabled={items.length === 0}
                className="mt-6 w-full rounded-xl bg-emerald-500 px-4 py-3 font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
              >
                Continue to payment
              </button>

              <button
                type="button"
                onClick={() => navigate("/menu")}
                className="mt-3 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium text-gray-800 hover:bg-gray-100"
              >
                Add more items
              </button>
            </>
          ) : guestMode ? (
            <GuestCheckout onBackToLogin={switchToLogin} />
          ) : (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold text-gray-900">Login</div>
                  <div className="mt-1 text-sm text-gray-600">
                    Login for faster checkout and order history.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={switchToGuest}
                  disabled={items.length === 0}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 disabled:opacity-50"
                >
                  Guest
                </button>
              </div>

              {loginErr ? <div className="mt-3 text-sm text-red-600">{loginErr}</div> : null}

              <form onSubmit={handleLogin} className="mt-4 space-y-3">
                <div>
                  <label className="text-sm text-gray-700">Email</label>
                  <input
                    type="email"
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700">Password</label>
                  <input
                    type="password"
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>

                <button
                  disabled={loadingLogin || items.length === 0}
                  className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
                >
                  {loadingLogin ? "Logging in…" : "Login & Continue"}
                </button>
              </form>

              <button
                type="button"
                onClick={switchToGuest}
                disabled={items.length === 0}
                className="mt-4 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium text-gray-800 hover:bg-gray-100 disabled:opacity-50"
              >
                Continue as guest
              </button>
            </>
          )}
        </div>

        {/* RIGHT: Order Summary */}
        <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm h-fit">
          <div className="text-lg font-semibold text-gray-900">Order Summary</div>
          <div className="mt-2 text-sm text-gray-600">{itemCount} item(s)</div>

          <div className="mt-4 space-y-2">
            {items.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                Your cart is empty.
              </div>
            ) : (
              items.map((it) => (
                <div key={it.id} className="flex items-start justify-between gap-3 text-sm">
                  <div className="text-gray-800">
                    {it.name} <span className="text-gray-500">x{it.qty}</span>
                  </div>
                  <div className="text-gray-900 font-medium">
                    {moneyGBP(Number(it.price) * it.qty)}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4 flex items-center justify-between">
            <span className="text-gray-700">Subtotal</span>
            <span className="font-semibold text-gray-900">{moneyGBP(subtotal)}</span>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            Delivery fees / taxes may be added at the next step.
          </div>
        </aside>
      </div>
    </div>
  );
}
