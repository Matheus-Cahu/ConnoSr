import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHealthCheck, useLogin } from "@connosr/api-client";

export function LoginPage() {
  const navigate = useNavigate();
  const health = useHealthCheck();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await login.mutateAsync({ email, password });
    navigate("/");
  }

  return (
    <main style={{ maxWidth: 360, margin: "4rem auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>ConnoSr</h1>
      <p style={{ color: health.isSuccess ? "green" : health.isError ? "crimson" : "gray" }}>
        API: {health.isLoading ? "verificando..." : health.isSuccess ? "online" : "offline"}
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={login.isPending}>
          {login.isPending ? "Entrando..." : "Entrar"}
        </button>
        {login.isError && <p style={{ color: "crimson" }}>Email ou senha inválidos.</p>}
      </form>
    </main>
  );
}
