import { useState } from "react";
import { Search } from "lucide-react";
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

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    const experience = await createExperience.mutateAsync({
      name: newName,
      category: newCategory,
      city: newCity || undefined,
    });
    onSelect(experience);
  }

  return (
    <div>
      <h1 style={styles.title}>O que você quer avaliar?</h1>

      <div style={styles.searchRow}>
        <Search size={18} color="#7a7a82" />
        <input
          type="text"
          placeholder="Buscar experiência..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {query && results.isLoading && <p style={styles.muted}>Buscando...</p>}

      {query &&
        !results.isLoading &&
        (results.data?.items ?? []).map((experience) => (
          <button key={experience.id} onClick={() => onSelect(experience)} style={styles.resultItem}>
            <div style={styles.resultName}>{experience.name}</div>
            <div style={styles.resultMeta}>
              {categoryLabels[experience.category]}
              {experience.city ? ` · ${experience.city}` : ""}
            </div>
          </button>
        ))}

      {query && !results.isLoading && results.data?.items.length === 0 && !showCreateForm && (
        <p style={styles.muted}>Nenhuma experiência encontrada.</p>
      )}

      {!showCreateForm ? (
        <button type="button" onClick={() => setShowCreateForm(true)} style={styles.createToggle}>
          + Cadastrar uma nova experiência
        </button>
      ) : (
        <form onSubmit={handleCreate} style={styles.createForm}>
          <input
            type="text"
            placeholder="Nome do lugar"
            required
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={styles.input}
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as ExperienceCategory)}
            style={styles.input}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {categoryLabels[category]}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Cidade (opcional)"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            style={styles.input}
          />
          <button type="submit" disabled={createExperience.isPending} style={styles.submit}>
            {createExperience.isPending ? "Criando..." : "Criar e continuar"}
          </button>
        </form>
      )}
    </div>
  );
}

const styles = {
  title: { fontSize: 20, color: "#f5f5f0", marginBottom: 16 },
  searchRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid #2a2a30",
    borderRadius: 10,
    padding: "10px 12px",
    marginBottom: 12,
  },
  searchInput: { border: "none", outline: "none", background: "none", color: "#f5f5f0", flex: 1, fontSize: 15 },
  muted: { color: "#7a7a82" },
  resultItem: {
    display: "block",
    width: "100%",
    textAlign: "left",
    border: "none",
    borderBottom: "1px solid #2a2a30",
    background: "none",
    cursor: "pointer",
    padding: "10px 0",
  },
  resultName: { color: "#f5f5f0", fontWeight: 600 },
  resultMeta: { color: "#7a7a82", fontSize: 13 },
  createToggle: {
    marginTop: 16,
    border: "1px dashed #2a2a30",
    borderRadius: 10,
    background: "none",
    color: "#e8503a",
    padding: "10px 12px",
    width: "100%",
    cursor: "pointer",
  },
  createForm: { display: "flex", flexDirection: "column", gap: 10, marginTop: 16 },
  input: {
    border: "1px solid #2a2a30",
    borderRadius: 8,
    padding: "10px 12px",
    background: "none",
    color: "#f5f5f0",
    fontSize: 15,
  },
  submit: {
    border: "none",
    borderRadius: 8,
    padding: "10px 12px",
    background: "#e8503a",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
} as const;
