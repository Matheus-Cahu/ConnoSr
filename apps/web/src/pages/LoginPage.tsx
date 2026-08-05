import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "@connosr/api-client";
import { AuthLayout, authErrorStyle, authInputStyle, authSubmitStyle } from "../layouts/AuthLayout.js";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      await login.mutateAsync({ email, password });
      navigate("/");
    } catch {
      // handled below via login.isError
    }
  }

  return (
    <AuthLayout
      title="Bem-vindo de volta"
      subtitle="Entre para ver as experiências de quem você segue."
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link to="/signup" style={{ color: "#e8503a" }}>
            Cadastre-se
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={authInputStyle}
        />
        <input
          type="password"
          placeholder="Senha"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={authInputStyle}
        />
        {login.isError && <p style={authErrorStyle}>Email ou senha inválidos.</p>}
        <button type="submit" disabled={login.isPending} style={authSubmitStyle}>
          {login.isPending ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </AuthLayout>
  );
}
