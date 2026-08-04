import { useOutletContext } from "react-router-dom";
import type { User } from "@connosr/shared-types";
import { useFollowers, useFollowing, useLogout, useUserReviews } from "@connosr/api-client";
import { JournalEntryRow } from "../components/JournalEntryRow.js";

export function ProfilePage() {
  const { me } = useOutletContext<{ me: User }>();
  const followers = useFollowers(me.id);
  const following = useFollowing(me.id);
  const reviews = useUserReviews(me.id);
  const reviewItems = reviews.data?.pages.flatMap((page) => page.items) ?? [];
  const logout = useLogout();

  return (
    <div>
      <header style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>{me.displayName}</h1>
        <span style={{ color: "gray" }}>@{me.username}</span>
        {me.bio && <p style={{ margin: "8px 0 0" }}>{me.bio}</p>}
        <div style={{ display: "flex", gap: 24, marginTop: 12, fontSize: 14 }}>
          <span>
            <strong>{reviewItems.length}</strong> reviews
          </span>
          <span>
            <strong>{followers.data?.length ?? 0}</strong> seguidores
          </span>
          <span>
            <strong>{following.data?.length ?? 0}</strong> seguindo
          </span>
        </div>
        <button onClick={() => logout.mutate()} style={{ alignSelf: "flex-start", marginTop: 4 }}>
          Sair
        </button>
      </header>

      <h2 style={{ fontSize: 16 }}>Minhas reviews</h2>
      {reviews.isLoading && <p>Carregando...</p>}
      {!reviews.isLoading && reviewItems.length === 0 && (
        <p style={{ color: "gray" }}>Você ainda não postou nenhuma review.</p>
      )}
      {reviewItems.map((review) => (
        <JournalEntryRow key={review.id} review={review} />
      ))}
      {reviews.hasNextPage && (
        <button onClick={() => reviews.fetchNextPage()} disabled={reviews.isFetchingNextPage}>
          {reviews.isFetchingNextPage ? "Carregando..." : "Carregar mais"}
        </button>
      )}
    </div>
  );
}
