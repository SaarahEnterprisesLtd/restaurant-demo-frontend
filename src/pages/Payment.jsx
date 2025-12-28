import React, { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiCreatePaymentIntent } from "../api/orders";
import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Payment() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const orderId = params.get("orderId");

  const [clientSecret, setClientSecret] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      try {
        if (!orderId) throw new Error("Missing orderId");
        const data = await apiCreatePaymentIntent({ orderId });
        if (!data?.clientSecret) throw new Error("No clientSecret returned");
        setClientSecret(data.clientSecret);
      } catch (e) {
        setErr(e.userMessage || e.message || "Failed to start payment");
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  const options = useMemo(
    () => ({
      clientSecret,
      appearance: { theme: "night" },
    }),
    [clientSecret]
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <div className="opacity-70">Preparing secure payment…</div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <div className="text-red-400 text-sm">{err}</div>
        <button
          className="mt-4 rounded-xl bg-white/10 px-4 py-2 hover:bg-white/15"
          onClick={() => nav("/orders")}
        >
          Back to orders
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-bold">Pay securely</h1>
      <p className="mt-2 text-sm opacity-80">Complete your payment to confirm the order.</p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
        {clientSecret && (
          <Elements stripe={stripePromise} options={options}>
            <PaymentForm orderId={orderId} />
          </Elements>
        )}
      </div>
    </div>
  );
}
