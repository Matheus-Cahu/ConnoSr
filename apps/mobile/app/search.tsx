import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Stack } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useExperiences, useSearchUsers } from "@connosr/api-client";
import { categoryLabels, colors, radii, spacing, typography } from "@connosr/ui";
import { UserSearchResultRow } from "../src/components/UserSearchResultRow";

type SearchMode = "users" | "experiences";

export default function SearchScreen() {
  const [mode, setMode] = useState<SearchMode>("users");
  const [query, setQuery] = useState("");

  const users = useSearchUsers(query, 20);
  const experiences = useExperiences({ q: query || undefined, limit: 20 });

  const isLoading = mode === "users" ? users.isLoading : experiences.isLoading;
  const hasQuery = query.trim().length > 0;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Buscar",
          headerStyle: { backgroundColor: "#050506" },
          headerTintColor: colors.text,
        }}
      />

      <View style={styles.toggleRow}>
        <Pressable
          onPress={() => setMode("users")}
          style={mode === "users" ? styles.toggleActive : styles.toggle}
        >
          <Text style={mode === "users" ? styles.toggleTextActive : styles.toggleText}>Usuários</Text>
        </Pressable>
        <Pressable
          onPress={() => setMode("experiences")}
          style={mode === "experiences" ? styles.toggleActive : styles.toggle}
        >
          <Text style={mode === "experiences" ? styles.toggleTextActive : styles.toggleText}>
            Experiências
          </Text>
        </Pressable>
      </View>

      <View style={styles.searchRow}>
        <Feather name="search" size={18} color={colors.textMuted} />
        <TextInput
          autoFocus
          placeholder={mode === "users" ? "Buscar por nome ou @usuário..." : "Buscar por nome do lugar..."}
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
      </View>

      {!hasQuery && <Text style={styles.muted}>Digite algo para buscar.</Text>}
      {hasQuery && isLoading && <ActivityIndicator color="#fff" style={{ marginTop: 12 }} />}

      {hasQuery && !isLoading && mode === "users" && (
        <FlatList
          data={users.data ?? []}
          keyExtractor={(user) => user.id}
          renderItem={({ item }) => <UserSearchResultRow user={item} />}
          ListEmptyComponent={<Text style={styles.muted}>Nenhum usuário encontrado.</Text>}
        />
      )}

      {hasQuery && !isLoading && mode === "experiences" && (
        <FlatList
          data={experiences.data?.items ?? []}
          keyExtractor={(experience) => experience.id}
          renderItem={({ item }) => (
            <View style={styles.experienceRow}>
              <Text style={styles.experienceName}>{item.name}</Text>
              <Text style={styles.experienceMeta}>
                {categoryLabels[item.category]}
                {item.city ? ` · ${item.city}` : ""}
              </Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.muted}>Nenhuma experiência encontrada.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050506", padding: 16 },
  toggleRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.sm },
  toggle: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.full,
    paddingVertical: 8,
    alignItems: "center",
  },
  toggleActive: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radii.full,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  toggleText: { color: colors.textMuted, fontSize: typography.sizes.sm },
  toggleTextActive: { color: "#fff", fontWeight: "500", fontSize: typography.sizes.sm },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: spacing.md,
  },
  searchInput: { flex: 1, color: colors.text, fontSize: typography.sizes.md },
  muted: { color: colors.textMuted },
  experienceRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  experienceName: { color: colors.text, fontWeight: "700" },
  experienceMeta: { color: colors.textMuted, fontSize: typography.sizes.sm, marginTop: 2 },
});
