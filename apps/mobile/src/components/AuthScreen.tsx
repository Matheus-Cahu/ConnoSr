import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing, typography } from "@connosr/ui";

export function AuthScreen({
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
    <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.wordmark}>ConnoSr</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <View style={styles.form}>{children}</View>
        <View style={styles.footer}>{footer}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export const authInputStyle = {
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: radii.md,
  padding: 12,
  color: colors.text,
  fontSize: typography.sizes.md,
} as const;

export const authSubmitStyle = {
  backgroundColor: colors.primary,
  borderRadius: radii.md,
  padding: 14,
  alignItems: "center" as const,
};

export const authErrorStyle = {
  color: colors.danger,
  fontSize: typography.sizes.sm,
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#050506" },
  scroll: { flexGrow: 1, justifyContent: "center", padding: spacing.lg, gap: spacing.md },
  wordmark: {
    color: colors.primary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    textAlign: "center",
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    textAlign: "center",
    marginTop: spacing.md,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    textAlign: "center",
    marginTop: 4,
    marginBottom: spacing.md,
  },
  form: { gap: 12 },
  footer: { alignItems: "center", marginTop: spacing.lg },
});
