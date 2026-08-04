import type { ReactNode } from "react";

/** Bleeds out of AuthenticatedLayout's padding to give a page a full-bleed dark background. */
export function DarkSection({ children }: { children: ReactNode }) {
  return <div style={styles.section}>{children}</div>;
}

const styles = {
  section: {
    margin: "-16px -16px 0",
    padding: "24px 16px 32px",
    background: "linear-gradient(180deg, #050506 0%, #0a1f14 100%)",
    minHeight: "calc(100vh - 72px)",
  },
} as const;
