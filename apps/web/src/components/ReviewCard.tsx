import { useState } from "react";
import { MapPin, User as UserIcon } from "lucide-react";
import { useLikeReview } from "@connosr/api-client";
import type { ReviewWithRelations } from "@connosr/shared-types";
import { PhotoCarousel } from "./PhotoCarousel.js";
import { CarouselDots } from "./CarouselDots.js";
import { StarRating } from "./StarRating.js";

export function ReviewCard({ review }: { review: ReviewWithRelations }) {
  const like = useLikeReview(review.id);
  const liked = review.likedByCurrentUser ?? false;
  const [photoIndex, setPhotoIndex] = useState(0);

  return (
    <article style={styles.article}>
      <header style={styles.userRow}>
        <div style={styles.avatar}>
          {review.user.avatarUrl ? (
            <img src={review.user.avatarUrl} alt="" style={styles.avatarImg} />
          ) : (
            <UserIcon size={20} color="#7a7a82" />
          )}
        </div>
        <div>
          <div style={styles.displayName}>{review.user.displayName}</div>
          <div style={styles.username}>@{review.user.username}</div>
        </div>
      </header>

      <div style={styles.card}>
        <PhotoCarousel photos={review.photos} onIndexChange={setPhotoIndex} />

        <div style={styles.ratingBadge}>
          <StarRating rating={review.rating} color="#f5f5f0" emptyColor="rgba(255,255,255,0.35)" size={15} />
        </div>

        <div style={styles.overlay}>
          <div style={styles.locationRow}>
            <MapPin size={16} color="#fff" />
            <span style={styles.placeName}>{review.experience.name}</span>
          </div>
          {review.text && <p style={styles.description}>{review.text}</p>}
        </div>
      </div>

      {review.photos.length > 1 && <CarouselDots count={review.photos.length} activeIndex={photoIndex} />}

      <div style={styles.actions}>
        <button onClick={() => like.mutate(!liked)} disabled={like.isPending} style={styles.likeButton}>
          <span style={{ color: liked ? "#e8503a" : "#7a7a82" }}>
            {liked ? "♥" : "♡"} {review.likeCount}
          </span>
        </button>
        <span style={styles.commentCount}>💬 {review.commentCount}</span>
      </div>
    </article>
  );
}

const styles = {
  article: { marginBottom: 32 },
  userRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "#2a2a30",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
  },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  displayName: { fontWeight: 700, color: "#f5f5f0" },
  username: { color: "#9a9aa2", fontSize: 14 },
  card: {
    position: "relative",
    width: "100%",
    aspectRatio: "4 / 5",
    borderRadius: 20,
    overflow: "hidden",
  },
  ratingBadge: { position: "absolute", top: 12, right: 14 },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: "40px 16px 16px",
    background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 55%, transparent 100%)",
  },
  locationRow: { display: "flex", alignItems: "center", gap: 6, marginBottom: 4 },
  placeName: { color: "#fff", fontWeight: 700, fontSize: 15 },
  description: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    margin: 0,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  actions: { display: "flex", gap: 16, fontSize: 14, marginTop: 4 },
  likeButton: { border: "none", background: "none", cursor: "pointer", padding: 0 },
  commentCount: { color: "#7a7a82" },
} as const;
