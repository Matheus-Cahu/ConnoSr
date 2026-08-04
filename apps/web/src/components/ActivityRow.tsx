import { formatRelativeTime } from "@connosr/utils";
import type { ReviewWithRelations } from "@connosr/shared-types";
import { StarRating } from "./StarRating.js";

export function ActivityRow({ review }: { review: ReviewWithRelations }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid #2a2a30",
        fontSize: 14,
      }}
    >
      <span>
        <strong>@{review.user.username}</strong> avaliou <strong>{review.experience.name}</strong>{" "}
        <StarRating rating={review.rating} />
      </span>
      <span style={{ color: "gray", fontSize: 12, whiteSpace: "nowrap", marginLeft: 12 }}>
        {formatRelativeTime(review.createdAt)}
      </span>
    </div>
  );
}
