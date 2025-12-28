import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      };

      await register(payload);

      // Since backend sets cookie on register, send them straight in
      nav("/menu", { replace: true });
    } catch (e2) {
      setErr(e2.userMessage || e2.message || "Register failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold">Register</h1>

      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input
          className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          required
        />
        <input
          className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          inputMode="email"
          required
        />
        <input
          className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none"
          placeholder="Password (min 8 chars)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          minLength={8}
          required
        />

        {err && <div className="text-sm text-red-400">{err}</div>}

        <button
          disabled={submitting}
          className="w-full rounded-xl bg-emerald-500 px-4 py-2 font-medium text-black disabled:opacity-60"
        >
          {submitting ? "Creating..." : "Create account"}
        </button>
      </form>

      <div className="mt-4 text-sm opacity-80">
        Have an account?{" "}
        <Link className="underline" to="/login">
          Login
        </Link>
      </div>
    </div>
  );
}
