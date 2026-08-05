import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useFollowUser } from "@connosr/api-client";
import { colors, radii, spacing, typography } from "@connosr/ui";
import type { FollowListItem } from "@connosr/shared-types";

export function UserSearchResultRow({ user }: { user: FollowListItem }) {
  const following = user.followedByCurrentUser ?? false;
  const follow = useFollowUser(user.id);

  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        {user.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.avatarImg} />
        ) : (
          <Feather name="user" size={20} color={colors.textMuted} />
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.displayName}>{user.displayName}</Text>
        <Text style={styles.username}>@{user.username}</Text>
      </View>
      <Pressable
        onPress={() => follow.mutate(!following)}
        disabled={follow.isPending}
        style={following ? styles.followingButton : styles.followButton}
      >
        <Text style={following ? styles.followingButtonText : styles.followButtonText}>
          {following ? "Seguindo" : "Seguir"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: { width: "100%", height: "100%" },
  info: { flex: 1 },
  displayName: { color: colors.text, fontWeight: "700", fontSize: typography.sizes.md },
  username: { color: colors.textMuted, fontSize: typography.sizes.sm },
  followButton: { backgroundColor: colors.primary, borderRadius: radii.md, paddingHorizontal: 14, paddingVertical: 6 },
  followButtonText: { color: "#fff", fontWeight: "500", fontSize: typography.sizes.sm },
  followingButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  followingButtonText: { color: colors.text, fontSize: typography.sizes.sm },
});
