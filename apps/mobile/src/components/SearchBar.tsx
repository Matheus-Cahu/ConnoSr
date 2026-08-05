import { Pressable, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { colors, radii, spacing, typography } from "@connosr/ui";

export function SearchBar() {
  return (
    <Pressable style={styles.bar} onPress={() => router.push("/search")}>
      <Feather name="search" size={18} color={colors.textMuted} />
      <Text style={styles.placeholder}>Buscar usuários e experiências...</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: spacing.md,
  },
  placeholder: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
  },
});
