import { useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useLikeReview, useReview } from "@connosr/api-client";
import { formatRelativeTime } from "@connosr/utils";
import { PhotoCarousel } from "../../src/components/PhotoCarousel";
import { CarouselDots } from "../../src/components/CarouselDots";
import { StarRating } from "../../src/components/StarRating";

export default function ReviewDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const review = useReview(id ?? "");
  const like = useLikeReview(id ?? "");
  const [photoIndex, setPhotoIndex] = useState(0);

  if (review.isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <Stack.Screen options={{ headerStyle: { backgroundColor: "#050506" }, headerTintColor: "#f5f5f0" }} />
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  if (review.isError || !review.data) {
    return (
      <View style={[styles.container, styles.center]}>
        <Stack.Screen options={{ headerStyle: { backgroundColor: "#050506" }, headerTintColor: "#f5f5f0" }} />
        <Text style={styles.muted}>Review não encontrada.</Text>
      </View>
    );
  }

  const data = review.data;
  const liked = data.likedByCurrentUser ?? false;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen
        options={{
          title: data.experience.name,
          headerStyle: { backgroundColor: "#050506" },
          headerTintColor: "#f5f5f0",
        }}
      />

      <View style={styles.userRow}>
        <View style={styles.avatar}>
          {data.user.avatarUrl ? (
            <Image source={{ uri: data.user.avatarUrl }} style={styles.avatarImg} />
          ) : (
            <Feather name="user" size={20} color="#7a7a82" />
          )}
        </View>
        <View>
          <Text style={styles.displayName}>{data.user.displayName}</Text>
          <Text style={styles.username}>
            @{data.user.username} · {formatRelativeTime(data.createdAt)}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <PhotoCarousel photos={data.photos} onIndexChange={setPhotoIndex} />
        <View style={styles.ratingBadge}>
          <StarRating rating={data.rating} color="#f5f5f0" emptyColor="rgba(255,255,255,0.35)" size={18} />
        </View>
      </View>

      {data.photos.length > 1 && <CarouselDots count={data.photos.length} activeIndex={photoIndex} />}

      <View style={styles.locationRow}>
        <Feather name="map-pin" size={18} color="#f5f5f0" />
        <Text style={styles.placeName}>{data.experience.name}</Text>
      </View>
      {(data.experience.city || data.experience.country) ? (
        <Text style={styles.placeMeta}>
          {[data.experience.city, data.experience.country].filter(Boolean).join(", ")}
        </Text>
      ) : null}

      {data.text ? <Text style={styles.description}>{data.text}</Text> : null}

      <View style={styles.actions}>
        <Pressable onPress={() => like.mutate(!liked)} disabled={like.isPending}>
          <Text style={{ color: liked ? "#e8503a" : "#9a9aa2" }}>
            {liked ? "♥" : "♡"} {data.likeCount}
          </Text>
        </Pressable>
        <Text style={styles.commentCount}>💬 {data.commentCount}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050506" },
  center: { justifyContent: "center", alignItems: "center" },
  content: { padding: 16 },
  muted: { color: "#9a9aa2" },
  userRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
  locationRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 16 },
  placeName: { color: "#f5f5f0", fontWeight: "700", fontSize: 18 },
  placeMeta: { color: "#9a9aa2", fontSize: 14, marginTop: 2, marginLeft: 24 },
  description: { color: "rgba(255,255,255,0.9)", fontSize: 15, marginTop: 12, lineHeight: 21 },
  actions: { flexDirection: "row", gap: 16, marginTop: 20 },
  commentCount: { color: "#9a9aa2" },
});
