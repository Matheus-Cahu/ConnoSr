import { useFeed } from "@connosr/api-client";
import { ActivityRow } from "../components/ActivityRow.js";

export function ActivityPage() {
  const feed = useFeed();
  const reviews = feed.data?.pages.flatMap((page) => page.items) ?? [];

  if (feed.isLoading) return <p>Carregando atividade...</p>;

  if (reviews.length === 0) {
    return <p style={{ color: "gray" }}>Nenhuma atividade de quem você segue ainda.</p>;
  }

  return (
    <div>
      {reviews.map((review) => (
        <ActivityRow key={review.id} review={review} />
      ))}
      {feed.hasNextPage && (
        <button onClick={() => feed.fetchNextPage()} disabled={feed.isFetchingNextPage}>
          {feed.isFetchingNextPage ? "Carregando..." : "Carregar mais"}
        </button>
      )}
    </div>
  );
}
