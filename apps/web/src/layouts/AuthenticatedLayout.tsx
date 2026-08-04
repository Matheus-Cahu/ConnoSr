import { Navigate, Outlet } from "react-router-dom";
import { useMe } from "@connosr/api-client";
import { TabBar } from "../components/TabBar.js";

export function AuthenticatedLayout() {
  const me = useMe();

  if (me.isLoading) return <p style={{ padding: 24 }}>Carregando...</p>;
  if (me.isError || !me.data) return <Navigate to="/login" replace />;

  return (
    <main
      style={{
        maxWidth: 640,
        margin: "0 auto",
        padding: "16px 16px 72px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <Outlet context={{ me: me.data }} />
      <TabBar />
    </main>
  );
}
