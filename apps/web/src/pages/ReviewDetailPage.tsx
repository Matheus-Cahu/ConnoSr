import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, User as UserIcon } from "lucide-react";
import { useLikeReview, useReview } from "@connosr/api-client";
import { formatRelativeTime } from "@connosr/utils";
import { DarkSection } from "../components/DarkSection.js";
import { PhotoCarousel } from "../components/PhotoCarousel.js";
import { CarouselDots } from "../components/CarouselDots.js";
import { StarRating } from "../components/StarRating.js";

export function ReviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const review = useReview(id ?? "");
  const like = useLikeReview(id ?? "");
  const [photoIndex, setPhotoIndex] = useState(0);

  if (review.isLoading) {
    return (
      <DarkSection>
        <p style={{ color: "#9a9aa2" }}>Carregando...</p>
      </DarkSection>
    );
  }

  if (review.isError || !review.data) {
    return (
      <DarkSection>
        <p style={{ color: "#9a9aa2" }}>Review não encontrada.</p>
      </DarkSection>
    );
  }

  const data = review.data;
  const liked = data.likedByCurrentUser ?? false;

  return (
    <DarkSection>
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        <ArrowLeft size={18} color="#f5f5f0" />
        <span>Voltar</span>
      </button>

      <div style={styles.userRow}>
        <div style={styles.avatar}>
          {data.user.avatarUrl ? (
            <img src={data.user.avatarUrl} alt="" style={styles.avatarImg} />
          ) : (
            <UserIcon size={20} color="#7a7a82" />
          )}
        </div>
        <div>
          <div style={styles.displayName}>{data.user.displayName}</div>
          <div style={styles.username}>
            @{data.user.username} · {formatRelativeTime(data.createdAt)}
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <PhotoCarousel photos={data.photos} onIndexChange={setPhotoIndex} />
        <div style={styles.ratingBadge}>
          <StarRating rating={data.rating} color="#f5f5f0" emptyColor="rgba(255,255,255,0.35)" size={18} />
        </div>
      </div>

      {data.photos.length > 1 && <CarouselDots count={data.photos.length} activeIndex={photoIndex} />}

      <div style={styles.locationRow}>
        <MapPin size={18} color="#f5f5f0" />
        <span style={styles.placeName}>{data.experience.name}</span>
      </div>
      {(data.experience.city || data.experience.country) && (
        <div style={styles.placeMeta}>
          {[data.experience.city, data.experience.country].filter(Boolean).join(", ")}
        </div>
      )}

      {data.text && <p style={styles.description}>{data.text}</p>}

      <div style={styles.actions}>
        <button
          onClick={() => like.mutate(!liked)}
          disabled={like.isPending}
          style={styles.likeButton}
        >
          <span style={{ color: liked ? "#e8503a" : "#9a9aa2" }}>
            {liked ? "♥" : "♡"} {data.likeCount}
          </span>
        </button>
        <span style={styles.commentCount}>💬 {data.commentCount}</span>
      </div>
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
    color: "#f5f5f0",
    cursor: "pointer",
    padding: 0,
    marginBottom: 16,
    fontSize: 15,
  },
  userRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16 },
  avatar: {
    width: 44,
    height: 44,
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
  card: { position: "relative", width: "100%", aspectRatio: "4 / 5", borderRadius: 20, overflow: "hidden" },
  ratingBadge: { position: "absolute", top: 12, right: 14 },
  locationRow: { display: "flex", alignItems: "center", gap: 6, marginTop: 16 },
  placeName: { color: "#f5f5f0", fontWeight: 700, fontSize: 18 },
  placeMeta: { color: "#9a9aa2", fontSize: 14, marginTop: 2, marginLeft: 24 },
  description: { color: "rgba(255,255,255,0.9)", fontSize: 15, marginTop: 12, lineHeight: 1.5 },
  actions: { display: "flex", gap: 16, fontSize: 15, marginTop: 20 },
  likeButton: { border: "none", background: "none", cursor: "pointer", padding: 0 },
  commentCount: { color: "#9a9aa2" },
} as const;
