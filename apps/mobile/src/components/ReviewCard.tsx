import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLikeReview } from "@connosr/api-client";
import type { ReviewWithRelations } from "@connosr/shared-types";
import { PhotoCarousel } from "./PhotoCarousel";
import { CarouselDots } from "./CarouselDots";
import { StarRating } from "./StarRating";

export function ReviewCard({
  review,
  showUser = true,
}: {
  review: ReviewWithRelations;
  showUser?: boolean;
}) {
  const like = useLikeReview(review.id);
  const liked = review.likedByCurrentUser ?? false;
  const [photoIndex, setPhotoIndex] = useState(0);

  return (
    <View style={styles.article}>
      {showUser && (
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            {review.user.avatarUrl ? (
              <Image source={{ uri: review.user.avatarUrl }} style={styles.avatarImg} />
            ) : (
              <Feather name="user" size={20} color="#7a7a82" />
            )}
          </View>
          <View>
            <Text style={styles.displayName}>{review.user.displayName}</Text>
            <Text style={styles.username}>@{review.user.username}</Text>
          </View>
        </View>
      )}

      <Pressable style={styles.card} onPress={() => router.push(`/review/${review.id}`)}>
        <PhotoCarousel photos={review.photos} onIndexChange={setPhotoIndex} />

        <View style={styles.ratingBadge}>
          <StarRating rating={review.rating} color="#f5f5f0" emptyColor="rgba(255,255,255,0.35)" size={15} />
        </View>

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.55)", "rgba(0,0,0,0.88)"]}
          locations={[0, 0.45, 1]}
          style={styles.overlay}
        >
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={16} color="#fff" />
            <Text style={styles.placeName}>{review.experience.name}</Text>
          </View>
          {review.text ? (
            <Text style={styles.description} numberOfLines={2}>
              {review.text}
            </Text>
          ) : null}
        </LinearGradient>
      </Pressable>

      {review.photos.length > 1 && <CarouselDots count={review.photos.length} activeIndex={photoIndex} />}

      <View style={styles.actions}>
        <Pressable onPress={() => like.mutate(!liked)} disabled={like.isPending}>
          <Text style={{ color: liked ? "#e8503a" : "#7a7a82" }}>
            {liked ? "♥" : "♡"} {review.likeCount}
          </Text>
        </Pressable>
        <Text style={styles.commentCount}>💬 {review.commentCount}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  article: { marginBottom: 32 },
  userRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2a2a30",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: { width: "100%", height: "100%" },
  displayName: { fontWeight: "700", color: "#f5f5f0" },
  username: { color: "#9a9aa2", fontSize: 14 },
  card: { position: "relative", width: "100%", aspectRatio: 4 / 5, borderRadius: 20, overflow: "hidden" },
  ratingBadge: { position: "absolute", top: 12, right: 14 },
  overlay: { position: "absolute", left: 0, right: 0, bottom: 0, padding: 16, paddingTop: 40 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  placeName: { color: "#fff", fontWeight: "700", fontSize: 15 },
  description: { color: "rgba(255,255,255,0.85)", fontSize: 13 },
  actions: { flexDirection: "row", gap: 16, marginTop: 4 },
  commentCount: { color: "#7a7a82" },
});
