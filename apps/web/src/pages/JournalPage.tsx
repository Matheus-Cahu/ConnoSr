import { useOutletContext } from "react-router-dom";
import type { User } from "@connosr/shared-types";
import { useUserReviews } from "@connosr/api-client";
import { JournalEntryRow } from "../components/JournalEntryRow.js";

export function JournalPage() {
  const { me } = useOutletContext<{ me: User }>();
  const journal = useUserReviews(me.id);
  const reviews = journal.data?.pages.flatMap((page) => page.items) ?? [];

  if (journal.isLoading) return <p>Carregando journal...</p>;

  if (reviews.length === 0) {
    return <p style={{ color: "gray" }}>Você ainda não postou nenhuma review.</p>;
  }

  return (
    <div>
      {reviews.map((review) => (
        <JournalEntryRow key={review.id} review={review} />
      ))}
      {journal.hasNextPage && (
        <button onClick={() => journal.fetchNextPage()} disabled={journal.isFetchingNextPage}>
          {journal.isFetchingNextPage ? "Carregando..." : "Carregar mais"}
        </button>
      )}
    </div>
  );
}
