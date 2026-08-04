import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApiClient, useCreateReview, usePresignUpload, uploadToPresignedUrl } from "@connosr/api-client";
import type { Experience } from "@connosr/shared-types";
import { DarkSection } from "../components/DarkSection.js";
import { ExperiencePicker } from "../components/ExperiencePicker.js";
import { StarInput } from "../components/StarInput.js";

export function CreatePostPage() {
  const navigate = useNavigate();
  const client = useApiClient();
  const createReview = useCreateReview();
  const presignUpload = usePresignUpload();

  const [experience, setExperience] = useState<Experience | null>(null);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!experience) {
    return (
      <DarkSection>
        <ExperiencePicker onSelect={setExperience} />
      </DarkSection>
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!experience || rating === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      const review = await createReview.mutateAsync({
        experienceId: experience.id,
        rating,
        text: text || undefined,
      });

      if (photos.length > 0) {
        const presigned = await presignUpload.mutateAsync({
          files: photos.map((file) => ({
            contentType: file.type as "image/jpeg" | "image/png" | "image/webp",
            fileSize: file.size,
          })),
        });
        for (let i = 0; i < photos.length; i++) {
          const file = photos[i];
          const target = presigned.files[i];
          if (!file || !target) continue;
          await uploadToPresignedUrl(target.uploadUrl, file, file.type);
          await client.request(`/api/v1/reviews/${review.id}/photos`, {
            method: "POST",
            body: JSON.stringify({ objectKey: target.objectKey, position: i }),
          });
        }
      }

      navigate("/");
    } catch {
      setError("Não foi possível publicar a review. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DarkSection>
      <form onSubmit={handleSubmit} style={styles.form}>
        <button type="button" onClick={() => setExperience(null)} style={styles.backLink}>
          ← trocar experiência
        </button>

        <h1 style={styles.title}>{experience.name}</h1>

        <StarInput value={rating} onChange={setRating} />

        <textarea
          placeholder="Como foi a experiência?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          style={styles.textarea}
        />

        <label style={styles.photoLabel}>
          {photos.length > 0 ? `${photos.length} foto(s) selecionada(s)` : "Adicionar fotos"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => setPhotos(Array.from(e.target.files ?? []))}
            style={{ display: "none" }}
          />
        </label>

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" disabled={rating === 0 || submitting} style={styles.submit}>
          {submitting ? "Publicando..." : "Publicar"}
        </button>
      </form>
    </DarkSection>
  );
}

const styles = {
  form: { display: "flex", flexDirection: "column", gap: 16 },
  backLink: { alignSelf: "flex-start", border: "none", background: "none", color: "#7a7a82", cursor: "pointer", padding: 0 },
  title: { fontSize: 20, color: "#f5f5f0", margin: 0 },
  textarea: {
    border: "1px solid #2a2a30",
    borderRadius: 8,
    padding: "10px 12px",
    background: "none",
    color: "#f5f5f0",
    fontSize: 15,
    resize: "vertical",
  },
  photoLabel: {
    border: "1px dashed #2a2a30",
    borderRadius: 10,
    padding: "10px 12px",
    color: "#9a9aa2",
    textAlign: "center",
    cursor: "pointer",
  },
  error: { color: "#e8503a" },
  submit: {
    border: "none",
    borderRadius: 8,
    padding: "12px",
    background: "#e8503a",
    color: "#fff",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
  },
} as const;
