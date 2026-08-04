import { NavLink } from "react-router-dom";
import { useLogout } from "@connosr/api-client";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/activity", label: "Atividade" },
  { to: "/journal", label: "Journal" },
  { to: "/profile", label: "Perfil" },
];

export function NavBar() {
  const logout = useLogout();

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 0",
        marginBottom: 24,
        borderBottom: "1px solid #2a2a30",
      }}
    >
      <div style={{ display: "flex", gap: 16 }}>
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            style={({ isActive }) => ({
              color: isActive ? "#e8503a" : "inherit",
              fontWeight: isActive ? 600 : 400,
              textDecoration: "none",
            })}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
      <button
        onClick={() => logout.mutate()}
        style={{ border: "none", background: "none", cursor: "pointer", color: "gray" }}
      >
        Sair
      </button>
    </nav>
  );
}
