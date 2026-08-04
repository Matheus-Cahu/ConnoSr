import { Navigate, Outlet } from "react-router-dom";
import { useMe } from "@connosr/api-client";
import { NavBar } from "../components/NavBar.js";

export function AuthenticatedLayout() {
  const me = useMe();

  if (me.isLoading) return <p style={{ padding: 24 }}>Carregando...</p>;
  if (me.isError || !me.data) return <Navigate to="/login" replace />;

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "0 16px", fontFamily: "system-ui, sans-serif" }}>
      <NavBar />
      <Outlet context={{ me: me.data }} />
    </main>
  );
}
