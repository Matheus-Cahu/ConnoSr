import { useMe } from "@connosr/api-client";
import { Navigate } from "react-router-dom";

export function FeedPage() {
  const me = useMe();

  if (me.isLoading) return <p>Carregando...</p>;
  if (me.isError || !me.data) return <Navigate to="/login" replace />;

  return (
    <main style={{ maxWidth: 480, margin: "2rem auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>Feed</h1>
      <p>
        Bem-vindo(a), {me.data.displayName} (@{me.data.username})
      </p>
      <p style={{ color: "gray" }}>O feed de reviews aparecerá aqui.</p>
    </main>
  );
}
