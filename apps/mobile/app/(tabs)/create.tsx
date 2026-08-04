import { useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useApiClient, useCreateReview, usePresignUpload, uploadToPresignedUrl } from "@connosr/api-client";
import type { Experience } from "@connosr/shared-types";
import { ExperiencePicker } from "../../src/components/ExperiencePicker";
import { StarInput } from "../../src/components/StarInput";

export default function CreateScreen() {
  const client = useApiClient();
  const createReview = useCreateReview();
  const presignUpload = usePresignUpload();

  const [experience, setExperience] = useState<Experience | null>(null);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [photos, setPhotos] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [submitting, setSubmitting] = useState(false);

  if (!experience) {
    return <ExperiencePicker onSelect={setExperience} />;
  }

  async function pickPhotos() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão necessária", "Precisamos de acesso às suas fotos para anexar imagens.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhotos(result.assets);
    }
  }

  async function handleSubmit() {
    if (!experience || rating === 0) return;
    setSubmitting(true);
    try {
      const review = await createReview.mutateAsync({
        experienceId: experience.id,
        rating,
        text: text || undefined,
      });

      if (photos.length > 0) {
        const blobs = await Promise.all(
          photos.map(async (photo) => {
            const blob = await (await fetch(photo.uri)).blob();
            const contentType = (photo.mimeType ?? "image/jpeg") as "image/jpeg" | "image/png" | "image/webp";
            return { blob, contentType };
          }),
        );

        const presigned = await presignUpload.mutateAsync({
          files: blobs.map(({ blob, contentType }) => ({ contentType, fileSize: blob.size })),
        });

        for (let i = 0; i < blobs.length; i++) {
          const item = blobs[i];
          const target = presigned.files[i];
          if (!item || !target) continue;
          await uploadToPresignedUrl(target.uploadUrl, item.blob, item.contentType);
          await client.request(`/api/v1/reviews/${review.id}/photos`, {
            method: "POST",
            body: JSON.stringify({ objectKey: target.objectKey, position: i }),
          });
        }
      }

      router.replace("/");
    } catch {
      Alert.alert("Erro", "Não foi possível publicar a review. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => setExperience(null)}>
        <Text style={styles.backLink}>← trocar experiência</Text>
      </Pressable>

      <Text style={styles.title}>{experience.name}</Text>

      <StarInput value={rating} onChange={setRating} />

      <TextInput
        placeholder="Como foi a experiência?"
        placeholderTextColor="#7a7a82"
        value={text}
        onChangeText={setText}
        multiline
        numberOfLines={4}
        style={styles.textarea}
      />

      <Pressable onPress={pickPhotos} style={styles.photoButton}>
        <Text style={styles.photoButtonText}>
          {photos.length > 0 ? `${photos.length} foto(s) selecionada(s)` : "Adicionar fotos"}
        </Text>
      </Pressable>

      {photos.length > 0 && (
        <ScrollView horizontal style={styles.previewRow}>
          {photos.map((photo) => (
            <Image key={photo.uri} source={{ uri: photo.uri }} style={styles.previewImage} />
          ))}
        </ScrollView>
      )}

      <Pressable
        onPress={handleSubmit}
        disabled={rating === 0 || submitting}
        style={[styles.submit, (rating === 0 || submitting) && styles.submitDisabled]}
      >
        <Text style={styles.submitText}>{submitting ? "Publicando..." : "Publicar"}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050506" },
  content: { padding: 16, gap: 16 },
  backLink: { color: "#7a7a82" },
  title: { fontSize: 20, color: "#f5f5f0", fontWeight: "700" },
  textarea: {
    borderWidth: 1,
    borderColor: "#2a2a30",
    borderRadius: 8,
    padding: 12,
    color: "#f5f5f0",
    fontSize: 15,
    minHeight: 90,
    textAlignVertical: "top",
  },
  photoButton: { borderWidth: 1, borderStyle: "dashed", borderColor: "#2a2a30", borderRadius: 10, padding: 12 },
  photoButtonText: { color: "#9a9aa2", textAlign: "center" },
  previewRow: { flexDirection: "row" },
  previewImage: { width: 72, height: 72, borderRadius: 8, marginRight: 8 },
  submit: { backgroundColor: "#e8503a", borderRadius: 8, padding: 14, alignItems: "center" },
  submitDisabled: { opacity: 0.5 },
  submitText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
