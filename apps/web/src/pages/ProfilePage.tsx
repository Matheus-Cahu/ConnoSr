import { useOutletContext } from "react-router-dom";
import { User as UserIcon } from "lucide-react";
import type { User } from "@connosr/shared-types";
import { useFollowers, useFollowing, useLogout, useUserReviews } from "@connosr/api-client";
import { DarkSection } from "../components/DarkSection.js";
import { ReviewCard } from "../components/ReviewCard.js";

export function ProfilePage() {
  const { me } = useOutletContext<{ me: User }>();
  const followers = useFollowers(me.id);
  const following = useFollowing(me.id);
  const reviews = useUserReviews(me.id);
  const reviewItems = reviews.data?.pages.flatMap((page) => page.items) ?? [];
  const logout = useLogout();

  return (
    <DarkSection>
      <header style={styles.header}>
        <div style={styles.avatar}>
          {me.avatarUrl ? (
            <img src={me.avatarUrl} alt="" style={styles.avatarImg} />
          ) : (
            <UserIcon size={32} color="#7a7a82" />
          )}
        </div>
        <h1 style={styles.name}>{me.displayName}</h1>
        <span style={styles.username}>@{me.username}</span>
        {me.bio && <p style={styles.bio}>{me.bio}</p>}
        <div style={styles.statsRow}>
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
        <button onClick={() => logout.mutate()} style={styles.logout}>
          Sair
        </button>
      </header>

      <h2 style={styles.sectionTitle}>Minhas reviews</h2>
      {reviews.isLoading && <p style={styles.muted}>Carregando...</p>}
      {!reviews.isLoading && reviewItems.length === 0 && (
        <p style={styles.muted}>Você ainda não postou nenhuma review.</p>
      )}
      {reviewItems.map((review) => (
        <ReviewCard key={review.id} review={review} showUser={false} />
      ))}
      {reviews.hasNextPage && (
        <button onClick={() => reviews.fetchNextPage()} disabled={reviews.isFetchingNextPage} style={styles.loadMore}>
          {reviews.isFetchingNextPage ? "Carregando..." : "Carregar mais"}
        </button>
      )}
    </DarkSection>
  );
}

const styles = {
  header: { display: "flex", flexDirection: "column", gap: 4, marginBottom: 28 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "#2a2a30",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 8,
  },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  name: { margin: 0, color: "#f5f5f0", fontSize: 22 },
  username: { color: "#9a9aa2" },
  bio: { color: "#f5f5f0", margin: "8px 0 0" },
  statsRow: { display: "flex", gap: 24, marginTop: 12, fontSize: 14, color: "#f5f5f0" },
  logout: {
    alignSelf: "flex-start",
    marginTop: 12,
    border: "1px solid #2a2a30",
    background: "none",
    color: "#f5f5f0",
    borderRadius: 8,
    padding: "6px 14px",
    cursor: "pointer",
  },
  sectionTitle: { fontSize: 16, color: "#f5f5f0" },
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
