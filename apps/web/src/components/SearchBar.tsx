import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { colors, radii, spacing, typography } from "@connosr/ui";

export function SearchBar() {
  const navigate = useNavigate();

  return (
    <button type="button" onClick={() => navigate("/search")} style={styles.bar}>
      <Search size={18} color={colors.textMuted} />
      <span style={styles.placeholder}>Buscar usuários e experiências...</span>
    </button>
  );
}

const styles = {
  bar: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    width: "100%",
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
    background: colors.surface,
    padding: "12px 14px",
    marginBottom: spacing.md,
    cursor: "pointer",
    textAlign: "left",
  },
  placeholder: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily,
  },
} as const;
