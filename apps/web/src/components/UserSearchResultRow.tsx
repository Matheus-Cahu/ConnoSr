import { User as UserIcon } from "lucide-react";
import { useFollowUser } from "@connosr/api-client";
import { colors, radii, spacing, typography } from "@connosr/ui";
import type { FollowListItem } from "@connosr/shared-types";

export function UserSearchResultRow({ user }: { user: FollowListItem }) {
  const following = user.followedByCurrentUser ?? false;
  const follow = useFollowUser(user.id);

  return (
    <div style={styles.row}>
      <div style={styles.avatar}>
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="" style={styles.avatarImg} />
        ) : (
          <UserIcon size={20} color={colors.textMuted} />
        )}
      </div>
      <div style={styles.info}>
        <div style={styles.displayName}>{user.displayName}</div>
        <div style={styles.username}>@{user.username}</div>
      </div>
      <button
        onClick={() => follow.mutate(!following)}
        disabled={follow.isPending}
        style={following ? styles.followingButton : styles.followButton}
      >
        {following ? "Seguindo" : "Seguir"}
      </button>
    </div>
  );
}

const styles = {
  row: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    padding: "10px 0",
    borderBottom: `1px solid ${colors.border}`,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: colors.surface,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
  },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  info: { flex: 1, minWidth: 0 },
  displayName: { color: colors.text, fontWeight: typography.weights.bold, fontSize: typography.sizes.md },
  username: { color: colors.textMuted, fontSize: typography.sizes.sm },
  followButton: {
    border: "none",
    borderRadius: radii.md,
    padding: "6px 14px",
    background: colors.primary,
    color: "#fff",
    fontWeight: typography.weights.medium,
    fontSize: typography.sizes.sm,
    cursor: "pointer",
    flexShrink: 0,
  },
  followingButton: {
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
    padding: "6px 14px",
    background: "none",
    color: colors.text,
    fontSize: typography.sizes.sm,
    cursor: "pointer",
    flexShrink: 0,
  },
} as const;
