export const colors = {
  background: "#0f0f12",
  surface: "#1a1a1f",
  primary: "#e8503a",
  text: "#f5f5f5",
  textMuted: "#9a9aa2",
  border: "#2a2a30",
  success: "#3ac16f",
  danger: "#e8503a",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const typography = {
  fontFamily: "system-ui, -apple-system, sans-serif",
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 28,
  },
  weights: {
    regular: "400",
    medium: "500",
    bold: "700",
  },
} as const;

export const radii = {
  sm: 4,
  md: 8,
  lg: 16,
  full: 9999,
} as const;
