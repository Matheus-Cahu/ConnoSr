import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignup } from "@connosr/api-client";
import { AuthLayout, authErrorStyle, authInputStyle, authSubmitStyle } from "../layouts/AuthLayout.js";

export function SignupPage() {
  const navigate = useNavigate();
  const signup = useSignup();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      await signup.mutateAsync({ displayName, username, email, password });
      navigate("/");
    } catch {
      // handled below via signup.isError
    }
  }

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Comece a registrar e descobrir experiências."
      footer={
        <>
          Já tem conta?{" "}
          <Link to="/login" style={{ color: "#e8503a" }}>
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="text"
          placeholder="Nome de exibição"
          autoComplete="name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          maxLength={80}
          style={authInputStyle}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <input
            type="text"
            placeholder="Usuário"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            required
            minLength={3}
            maxLength={30}
            pattern="[a-z0-9_]+"
            style={authInputStyle}
          />
          <span style={{ color: "#9a9aa2", fontSize: 12 }}>
            só letras minúsculas, números e underscore
          </span>
        </div>
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
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          style={authInputStyle}
        />
        {signup.isError && (
          <p style={authErrorStyle}>
            Não foi possível criar a conta. Verifique os dados (email/usuário já podem estar em uso).
          </p>
        )}
        <button type="submit" disabled={signup.isPending} style={authSubmitStyle}>
          {signup.isPending ? "Criando conta..." : "Criar conta"}
        </button>
      </form>
    </AuthLayout>
  );
}
