import { useOutletContext } from "react-router-dom";
import type { User } from "@connosr/shared-types";
import { useUserReviews } from "@connosr/api-client";
import { ActivityRow } from "../components/ActivityRow.js";

export function MyActivityPage() {
  const { me } = useOutletContext<{ me: User }>();
  const activity = useUserReviews(me.id);
  const reviews = activity.data?.pages.flatMap((page) => page.items) ?? [];

  if (activity.isLoading) return <p>Carregando...</p>;

  if (reviews.length === 0) {
    return <p style={{ color: "gray" }}>Você ainda não tem atividade.</p>;
  }

  return (
    <div>
      {reviews.map((review) => (
        <ActivityRow key={review.id} review={review} />
      ))}
      {activity.hasNextPage && (
        <button onClick={() => activity.fetchNextPage()} disabled={activity.isFetchingNextPage}>
          {activity.isFetchingNextPage ? "Carregando..." : "Carregar mais"}
        </button>
      )}
    </div>
  );
}
