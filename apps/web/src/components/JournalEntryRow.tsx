import type { ReviewWithRelations } from "@connosr/shared-types";
import { StarRating } from "./StarRating.js";

export function JournalEntryRow({ review }: { review: ReviewWithRelations }) {
  const date = new Date(review.createdAt);
  const thumbnail = review.photos[0];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "80px 56px 1fr auto",
        alignItems: "center",
        gap: 12,
        padding: "10px 0",
        borderBottom: "1px solid #2a2a30",
      }}
    >
      <span style={{ fontSize: 12, color: "gray" }}>
        {date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
      </span>
      {thumbnail ? (
        <img
          src={thumbnail.url}
          alt=""
          style={{ width: 56, height: 56, borderRadius: 6, objectFit: "cover" }}
        />
      ) : (
        <div style={{ width: 56, height: 56, borderRadius: 6, background: "#1a1a1f" }} />
      )}
      <span>{review.experience.name}</span>
      <StarRating rating={review.rating} />
    </div>
  );
}
