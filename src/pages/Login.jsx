import { useState } from "react";
import api from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    await api.post("/api/auth/login", { email, password });
    alert("Logged in");
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <br />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <br />
      <button onClick={submit}>Login</button>
    </div>
  );
}
