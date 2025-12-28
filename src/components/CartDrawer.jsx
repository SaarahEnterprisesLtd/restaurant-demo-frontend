import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function moneyGBP(n) {
  const x = Number(n || 0);
  return `£${x.toFixed(2)}`;
}

export default function CartDrawer({ open, onClose }) {
  const { user } = useAuth();
  const { items, remove, setQty, subtotal } = useCart();

  const location = useLocation();
  const navigate = useNavigate();

  const isCheckoutPage =
    location.pathname === "/checkout" || location.pathname === "/pay";

  const [showCheckoutChoice, setShowCheckoutChoice] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Reset local UI when drawer closes
  useEffect(() => {
    if (!open) {
      setShowCheckoutChoice(false);
      setIsCheckingOut(false);
    }
  }, [open]);

  // Auto-close drawer when entering checkout/pay pages
  useEffect(() => {
    if (open && isCheckoutPage) onClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCheckoutPage]);

  if (!open) return null;

  const itemCount = items.reduce((s, it) => s + it.qty, 0);
  const canCheckout = items.length > 0;

  const hideFooterButtons =
    isCheckoutPage || showCheckoutChoice || isCheckingOut;

  return (
    <div className="fixed inset-0 z-60">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-label="Close cart"
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-gray-900">Your Cart</div>
            <div className="text-sm text-gray-500">{itemCount} item(s)</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-gray-600">
              Your cart is empty.
              <div className="mt-3">
                <Link
                  to="/menu"
                  onClick={onClose}
                  className="inline-block font-medium text-emerald-700 hover:underline"
                >
                  Browse menu
                </Link>
              </div>
            </div>
          ) : (
            items.map((it) => (
              <div
                key={it.id}
                className="rounded-xl border border-gray-200 bg-white p-3 flex gap-3"
              >
                {it.imageUrl ? (
                  <img
                    src={it.imageUrl}
                    alt={it.name}
                    className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-gray-100 border border-gray-200" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {it.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {moneyGBP(it.price)}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={showCheckoutChoice || isCheckingOut}
                      onClick={() => remove(it.id)}
                      className="text-sm text-red-600 hover:text-red-700 disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-lg border border-gray-200">
                      <button
                        type="button"
                        disabled={showCheckoutChoice || isCheckingOut || it.qty <= 1}
                        onClick={() => setQty(it.id, it.qty - 1)}
                        className="px-3 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>

                      <div className="px-3 py-2 text-sm text-gray-900 w-10 text-center">
                        {it.qty}
                      </div>

                      <button
                        type="button"
                        disabled={showCheckoutChoice || isCheckingOut}
                        onClick={() => setQty(it.id, it.qty + 1)}
                        className="px-3 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="font-medium text-gray-900">
                      {moneyGBP(Number(it.price) * it.qty)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Subtotal</div>
            <div className="text-base font-semibold text-gray-900">
              {moneyGBP(subtotal)}
            </div>
          </div>

          {/* Checkout choice panel (guest only) */}
          {!user && showCheckoutChoice && !isCheckoutPage ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-2">
              <div className="text-sm font-medium text-gray-900">
                Checkout options
              </div>
              <div className="text-sm text-gray-600">
                Login for faster checkout and order history, or continue as guest.
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCheckingOut(true);
                    onClose?.();
                    navigate("/checkout");
                  }}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-center font-medium text-gray-800 hover:bg-gray-100"
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsCheckingOut(true);
                    onClose?.();
                    navigate("/checkout?guest=1");
                  }}
                  className="rounded-xl bg-emerald-500 px-4 py-2 text-center font-medium text-white hover:bg-emerald-600"
                >
                  Guest
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowCheckoutChoice(false);
                  setIsCheckingOut(false);
                }}
                className="w-full rounded-xl px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Back
              </button>
            </div>
          ) : null}

          {/* Footer buttons — MUST disappear when checkout choice is shown */}
          {!hideFooterButtons ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 font-medium text-gray-800 hover:bg-gray-100"
              >
                Continue
              </button>

              {user ? (
                <button
                  type="button"
                  disabled={!canCheckout}
                  onClick={() => {
                    setIsCheckingOut(true);
                    onClose?.();
                    navigate("/checkout");
                  }}
                  className="rounded-xl bg-emerald-500 px-4 py-2 text-center font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
                >
                  Checkout
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!canCheckout}
                  onClick={() => {
                    setIsCheckingOut(true);      // ✅ hides footer instantly
                    setShowCheckoutChoice(true); // show options
                  }}
                  className="rounded-xl bg-emerald-500 px-4 py-2 text-center font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
                >
                  Checkout
                </button>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
