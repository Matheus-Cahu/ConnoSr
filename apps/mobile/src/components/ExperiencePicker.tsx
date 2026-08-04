import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useCreateExperience, useExperiences } from "@connosr/api-client";
import { categoryLabels } from "@connosr/ui";
import type { Experience, ExperienceCategory } from "@connosr/shared-types";

const CATEGORIES = Object.keys(categoryLabels) as ExperienceCategory[];

export function ExperiencePicker({ onSelect }: { onSelect: (experience: Experience) => void }) {
  const [query, setQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<ExperienceCategory>("RESTAURANT");
  const [newCity, setNewCity] = useState("");

  const results = useExperiences({ q: query || undefined, limit: 10 });
  const createExperience = useCreateExperience();

  async function handleCreate() {
    if (!newName) return;
    const experience = await createExperience.mutateAsync({
      name: newName,
      category: newCategory,
      city: newCity || undefined,
    });
    onSelect(experience);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>O que você quer avaliar?</Text>

      <View style={styles.searchRow}>
        <Feather name="search" size={18} color="#7a7a82" />
        <TextInput
          placeholder="Buscar experiência..."
          placeholderTextColor="#7a7a82"
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
      </View>

      {query.length > 0 && results.isLoading && <ActivityIndicator style={{ marginTop: 12 }} />}

      {query.length > 0 &&
        !results.isLoading &&
        (results.data?.items ?? []).map((experience) => (
          <Pressable key={experience.id} onPress={() => onSelect(experience)} style={styles.resultItem}>
            <Text style={styles.resultName}>{experience.name}</Text>
            <Text style={styles.resultMeta}>
              {categoryLabels[experience.category]}
              {experience.city ? ` · ${experience.city}` : ""}
            </Text>
          </Pressable>
        ))}

      {query.length > 0 && !results.isLoading && results.data?.items.length === 0 && !showCreateForm && (
        <Text style={styles.muted}>Nenhuma experiência encontrada.</Text>
      )}

      {!showCreateForm ? (
        <Pressable onPress={() => setShowCreateForm(true)} style={styles.createToggle}>
          <Text style={styles.createToggleText}>+ Cadastrar uma nova experiência</Text>
        </Pressable>
      ) : (
        <View style={styles.createForm}>
          <TextInput
            placeholder="Nome do lugar"
            placeholderTextColor="#7a7a82"
            value={newName}
            onChangeText={setNewName}
            style={styles.input}
          />
          <View style={styles.categoryRow}>
            {CATEGORIES.map((category) => (
              <Pressable
                key={category}
                onPress={() => setNewCategory(category)}
                style={[styles.categoryChip, newCategory === category && styles.categoryChipActive]}
              >
                <Text
                  style={[styles.categoryChipText, newCategory === category && styles.categoryChipTextActive]}
                >
                  {categoryLabels[category]}
                </Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            placeholder="Cidade (opcional)"
            placeholderTextColor="#7a7a82"
            value={newCity}
            onChangeText={setNewCity}
            style={styles.input}
          />
          <Pressable onPress={handleCreate} disabled={createExperience.isPending} style={styles.submit}>
            <Text style={styles.submitText}>
              {createExperience.isPending ? "Criando..." : "Criar e continuar"}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#050506" },
  title: { fontSize: 20, color: "#f5f5f0", marginBottom: 16, fontWeight: "700" },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#2a2a30",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, color: "#f5f5f0", fontSize: 15 },
  muted: { color: "#7a7a82", marginTop: 8 },
  resultItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#2a2a30" },
  resultName: { color: "#f5f5f0", fontWeight: "600" },
  resultMeta: { color: "#7a7a82", fontSize: 13 },
  createToggle: { marginTop: 16, borderWidth: 1, borderStyle: "dashed", borderColor: "#2a2a30", borderRadius: 10, padding: 12 },
  createToggleText: { color: "#e8503a", textAlign: "center" },
  createForm: { gap: 10, marginTop: 16 },
  input: { borderWidth: 1, borderColor: "#2a2a30", borderRadius: 8, padding: 12, color: "#f5f5f0", fontSize: 15 },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  categoryChip: { borderWidth: 1, borderColor: "#2a2a30", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
  categoryChipActive: { backgroundColor: "#e8503a", borderColor: "#e8503a" },
  categoryChipText: { color: "#9a9aa2", fontSize: 13 },
  categoryChipTextActive: { color: "#fff" },
  submit: { backgroundColor: "#e8503a", borderRadius: 8, padding: 12, alignItems: "center" },
  submitText: { color: "#fff", fontWeight: "700" },
});
