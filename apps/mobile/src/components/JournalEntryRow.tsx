import { Image, StyleSheet, Text, View } from "react-native";
import type { ReviewWithRelations } from "@connosr/shared-types";
import { StarRating } from "./StarRating";

export function JournalEntryRow({ review }: { review: ReviewWithRelations }) {
  const date = new Date(review.createdAt);
  const thumbnail = review.photos[0];

  return (
    <View style={styles.row}>
      <Text style={styles.date}>
        {date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
      </Text>
      {thumbnail ? (
        <Image source={{ uri: thumbnail.url }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, styles.thumbnailPlaceholder]} />
      )}
      <Text style={styles.name} numberOfLines={1}>
        {review.experience.name}
      </Text>
      <StarRating rating={review.rating} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a30",
  },
  date: { fontSize: 12, color: "gray", width: 48 },
  thumbnail: { width: 44, height: 44, borderRadius: 6 },
  thumbnailPlaceholder: { backgroundColor: "#1a1a1f" },
  name: { flex: 1 },
});
