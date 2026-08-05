import type { ReactNode } from "react";
import { colors, radii, spacing, typography } from "@connosr/ui";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.wordmark}>ConnoSr</h1>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.subtitle}>{subtitle}</p>
        {children}
        <div style={styles.footer}>{footer}</div>
      </div>
    </div>
  );
}

export const authInputStyle = {
  border: `1px solid ${colors.border}`,
  borderRadius: radii.md,
  padding: "12px 14px",
  background: "none",
  color: colors.text,
  fontSize: typography.sizes.md,
  fontFamily: typography.fontFamily,
} as const;

export const authSubmitStyle = {
  border: "none",
  borderRadius: radii.md,
  padding: "12px",
  background: colors.primary,
  color: "#fff",
  fontWeight: typography.weights.bold,
  fontSize: typography.sizes.md,
  cursor: "pointer",
} as const;

export const authErrorStyle = {
  color: colors.danger,
  fontSize: typography.sizes.sm,
  margin: 0,
} as const;

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `linear-gradient(180deg, #050506 0%, ${colors.background} 100%)`,
    padding: spacing.lg,
    fontFamily: typography.fontFamily,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    display: "flex",
    flexDirection: "column",
    gap: spacing.md,
  },
  wordmark: {
    color: colors.primary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    margin: 0,
    textAlign: "center",
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    margin: `${spacing.md}px 0 0`,
    textAlign: "center",
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    margin: "4px 0 0",
    textAlign: "center",
  },
  footer: {
    textAlign: "center",
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
  },
} as const;
