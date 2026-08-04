import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLikeReview } from "@connosr/api-client";
import { formatRelativeTime } from "@connosr/utils";
import type { ReviewWithRelations } from "@connosr/shared-types";
import { PhotoCarousel } from "./PhotoCarousel";
import { StarRating } from "./StarRating";

export function ReviewCard({ review }: { review: ReviewWithRelations }) {
  const like = useLikeReview(review.id);
  const liked = review.likedByCurrentUser ?? false;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.username}>@{review.user.username}</Text>
        <Text style={styles.timestamp}>{formatRelativeTime(review.createdAt)}</Text>
      </View>

      <View style={styles.ratingRow}>
        <Text>
          avaliou <Text style={styles.bold}>{review.experience.name}</Text>
        </Text>
        <StarRating rating={review.rating} />
      </View>

      {review.text ? <Text style={styles.text}>{review.text}</Text> : null}

      <PhotoCarousel photos={review.photos} />

      <View style={styles.footer}>
        <Pressable onPress={() => like.mutate(!liked)} disabled={like.isPending} style={styles.likeButton}>
          <Text style={{ color: liked ? "#e8503a" : "gray" }}>
            {liked ? "♥" : "♡"} {review.likeCount}
          </Text>
        </Pressable>
        <Text style={styles.commentCount}>💬 {review.commentCount}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: "#2a2a30", borderRadius: 12, padding: 16, marginBottom: 16 },
  header: { flexDirection: "row", justifyContent: "space-between" },
  username: { fontWeight: "600" },
  timestamp: { fontSize: 12, color: "gray" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  bold: { fontWeight: "700" },
  text: { marginTop: 8 },
  footer: { flexDirection: "row", gap: 16, marginTop: 4 },
  likeButton: { padding: 0 },
  commentCount: { color: "gray" },
});
