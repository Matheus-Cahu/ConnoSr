import { useFeed } from "@connosr/api-client";
import { ReviewCard } from "../components/ReviewCard.js";

export function HomePage() {
  const feed = useFeed();
  const reviews = feed.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div style={styles.section}>
      {feed.isLoading && <p style={styles.muted}>Carregando feed...</p>}

      {!feed.isLoading && reviews.length === 0 && (
        <p style={styles.muted}>
          Nenhuma review por aqui ainda. Siga outras pessoas para ver as reviews delas no seu feed.
        </p>
      )}

      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}

      {feed.hasNextPage && (
        <button onClick={() => feed.fetchNextPage()} disabled={feed.isFetchingNextPage} style={styles.loadMore}>
          {feed.isFetchingNextPage ? "Carregando..." : "Carregar mais"}
        </button>
      )}
    </div>
  );
}

const styles = {
  section: {
    margin: "-16px -16px 0",
    padding: "24px 16px 32px",
    background: "linear-gradient(180deg, #050506 0%, #0a1f14 100%)",
    minHeight: "calc(100vh - 72px)",
  },
  muted: { color: "#9a9aa2" },
  loadMore: {
    display: "block",
    margin: "8px auto 0",
    background: "none",
    border: "1px solid #2a2a30",
    color: "#f5f5f0",
    borderRadius: 8,
    padding: "8px 16px",
    cursor: "pointer",
  },
} as const;
