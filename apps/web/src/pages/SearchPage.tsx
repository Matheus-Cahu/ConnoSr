import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Search } from "lucide-react";
import { useExperiences, useSearchUsers } from "@connosr/api-client";
import { categoryLabels, colors, radii, spacing, typography } from "@connosr/ui";
import { DarkSection } from "../components/DarkSection.js";
import { UserSearchResultRow } from "../components/UserSearchResultRow.js";

type SearchMode = "users" | "experiences";

export function SearchPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<SearchMode>("users");
  const [query, setQuery] = useState("");

  const users = useSearchUsers(query, 20);
  const experiences = useExperiences({ q: query || undefined, limit: 20 });

  const isLoading = mode === "users" ? users.isLoading : experiences.isLoading;
  const userResults = users.data ?? [];
  const experienceResults = experiences.data?.items ?? [];
  const hasQuery = query.trim().length > 0;

  return (
    <DarkSection>
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        <ArrowLeft size={18} color={colors.text} />
        <span>Voltar</span>
      </button>

      <div style={styles.toggleRow}>
        <button
          onClick={() => setMode("users")}
          style={mode === "users" ? styles.toggleActive : styles.toggle}
        >
          Usuários
        </button>
        <button
          onClick={() => setMode("experiences")}
          style={mode === "experiences" ? styles.toggleActive : styles.toggle}
        >
          Experiências
        </button>
      </div>

      <div style={styles.searchRow}>
        <Search size={18} color={colors.textMuted} />
        <input
          type="text"
          autoFocus
          placeholder={mode === "users" ? "Buscar por nome ou @usuário..." : "Buscar por nome do lugar..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {!hasQuery && <p style={styles.muted}>Digite algo para buscar.</p>}
      {hasQuery && isLoading && <p style={styles.muted}>Buscando...</p>}

      {hasQuery && !isLoading && mode === "users" && userResults.length === 0 && (
        <p style={styles.muted}>Nenhum usuário encontrado.</p>
      )}
      {hasQuery &&
        mode === "users" &&
        userResults.map((user) => <UserSearchResultRow key={user.id} user={user} />)}

      {hasQuery && !isLoading && mode === "experiences" && experienceResults.length === 0 && (
        <p style={styles.muted}>Nenhuma experiência encontrada.</p>
      )}
      {hasQuery &&
        mode === "experiences" &&
        experienceResults.map((experience) => (
          <div key={experience.id} style={styles.experienceRow}>
            <div style={styles.experienceName}>{experience.name}</div>
            <div style={styles.experienceMeta}>
              {categoryLabels[experience.category]}
              {experience.city ? (
                <>
                  {" · "}
                  <MapPin size={12} style={{ verticalAlign: "-1px" }} /> {experience.city}
                </>
              ) : null}
            </div>
          </div>
        ))}
    </DarkSection>
  );
}

const styles = {
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    border: "none",
    background: "none",
    color: colors.text,
    cursor: "pointer",
    padding: 0,
    marginBottom: spacing.md,
    fontSize: typography.sizes.md,
  },
  toggleRow: { display: "flex", gap: spacing.sm, marginBottom: spacing.sm },
  toggle: {
    flex: 1,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.full,
    padding: "8px 0",
    background: "none",
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    cursor: "pointer",
  },
  toggleActive: {
    flex: 1,
    border: `1px solid ${colors.primary}`,
    borderRadius: radii.full,
    padding: "8px 0",
    background: colors.primary,
    color: "#fff",
    fontWeight: typography.weights.medium,
    fontSize: typography.sizes.sm,
    cursor: "pointer",
  },
  searchRow: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
    padding: "10px 12px",
    marginBottom: spacing.md,
  },
  searchInput: {
    border: "none",
    outline: "none",
    background: "none",
    color: colors.text,
    flex: 1,
    fontSize: typography.sizes.md,
  },
  muted: { color: colors.textMuted },
  experienceRow: {
    padding: "10px 0",
    borderBottom: `1px solid ${colors.border}`,
  },
  experienceName: { color: colors.text, fontWeight: typography.weights.bold },
  experienceMeta: { color: colors.textMuted, fontSize: typography.sizes.sm, marginTop: 2 },
} as const;
