import { NavLink } from "react-router-dom";
import { Activity, FileText, Home, User, Users } from "lucide-react";

const TABS = [
  { to: "/", icon: Home, end: true, label: "Home" },
  { to: "/journal", icon: FileText, label: "Journal" },
  { to: "/activity", icon: Users, label: "Atividade dos amigos" },
  { to: "/my-activity", icon: Activity, label: "Minha atividade" },
  { to: "/profile", icon: User, label: "Perfil" },
];

export function TabBar() {
  return (
    <nav style={styles.nav}>
      {TABS.map(({ to, icon: Icon, end, label }) => (
        <NavLink key={to} to={to} end={end} aria-label={label} style={styles.link}>
          {({ isActive }) => <Icon size={24} strokeWidth={1.75} color={isActive ? "#e8503a" : "#7a7a82"} />}
        </NavLink>
      ))}
    </nav>
  );
}

const styles = {
  nav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    height: 56,
    borderTop: "1px solid #2a2a30",
    background: "var(--tabbar-bg, #0f0f12)",
  },
  link: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: "100%",
  },
} as const;
