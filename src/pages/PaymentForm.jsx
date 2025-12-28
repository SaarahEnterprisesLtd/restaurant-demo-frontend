import React, { useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

export default function PaymentForm({ orderId }) {
  const stripe = useStripe();
  const elements = useElements();
  const nav = useNavigate();

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    if (!stripe || !elements) return;

    setLoading(true);
    try {
      // If you use a return_url approach, Stripe will redirect and then come back
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders?paid=1&orderId=${orderId}`,
        },
      });

      if (error) setMsg(error.message || "Payment failed");
      // If no error, Stripe usually redirects to return_url automatically
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {msg && <div className="text-sm text-red-400">{msg}</div>}

      <button
        className="w-full rounded-xl bg-emerald-500 px-4 py-2 font-medium text-black disabled:opacity-60"
        disabled={!stripe || loading}
      >
        {loading ? "Processing…" : "Pay now"}
      </button>

      <button
        type="button"
        className="w-full rounded-xl bg-white/10 px-4 py-2 hover:bg-white/15"
        onClick={() => nav("/orders")}
      >
        Cancel
      </button>
    </form>
  );
}
