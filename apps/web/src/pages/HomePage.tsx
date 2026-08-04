import { useFeed } from "@connosr/api-client";
import { ReviewCard } from "../components/ReviewCard.js";

export function HomePage() {
  const feed = useFeed();
  const reviews = feed.data?.pages.flatMap((page) => page.items) ?? [];

  if (feed.isLoading) return <p>Carregando feed...</p>;

  if (reviews.length === 0) {
    return (
      <p style={{ color: "gray" }}>
        Nenhuma review por aqui ainda. Siga outras pessoas para ver as reviews delas no seu feed.
      </p>
    );
  }

  return (
    <div>
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
      {feed.hasNextPage && (
        <button onClick={() => feed.fetchNextPage()} disabled={feed.isFetchingNextPage}>
          {feed.isFetchingNextPage ? "Carregando..." : "Carregar mais"}
        </button>
      )}
    </div>
  );
}
