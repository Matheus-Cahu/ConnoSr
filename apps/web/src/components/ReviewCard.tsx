import { useLikeReview } from "@connosr/api-client";
import { formatRelativeTime } from "@connosr/utils";
import type { ReviewWithRelations } from "@connosr/shared-types";
import { PhotoCarousel } from "./PhotoCarousel.js";
import { StarRating } from "./StarRating.js";

export function ReviewCard({ review }: { review: ReviewWithRelations }) {
  const like = useLikeReview(review.id);
  const liked = review.likedByCurrentUser ?? false;

  return (
    <article
      style={{
        border: "1px solid #2a2a30",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontWeight: 600 }}>@{review.user.username}</span>
        <span style={{ fontSize: 12, color: "gray" }}>{formatRelativeTime(review.createdAt)}</span>
      </header>

      <p style={{ margin: "4px 0" }}>
        avaliou <strong>{review.experience.name}</strong> <StarRating rating={review.rating} />
      </p>

      {review.text && <p style={{ margin: "8px 0" }}>{review.text}</p>}

      <PhotoCarousel photos={review.photos} />

      <footer style={{ display: "flex", gap: 16, fontSize: 14, color: "gray" }}>
        <button
          onClick={() => like.mutate(!liked)}
          disabled={like.isPending}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            color: liked ? "#e8503a" : "gray",
            padding: 0,
          }}
        >
          {liked ? "♥" : "♡"} {review.likeCount}
        </button>
        <span>💬 {review.commentCount}</span>
      </footer>
    </article>
  );
}
