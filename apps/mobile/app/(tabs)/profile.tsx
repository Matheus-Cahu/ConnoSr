import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useFollowers, useFollowing, useLogout, useMe, useUserReviews } from "@connosr/api-client";
import { ReviewCard } from "../../src/components/ReviewCard";

export default function ProfileScreen() {
  const me = useMe();
  const logout = useLogout();
  const followers = useFollowers(me.data?.id ?? "");
  const following = useFollowing(me.data?.id ?? "");
  const reviews = useUserReviews(me.data?.id ?? "");
  const reviewItems = reviews.data?.pages.flatMap((page) => page.items) ?? [];

  if (me.isLoading || !me.data) {
    return (
      <View style={[styles.background, styles.center]}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.background}
      contentContainerStyle={styles.list}
      data={reviewItems}
      keyExtractor={(review) => review.id}
      renderItem={({ item }) => <ReviewCard review={item} showUser={false} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.avatar}>
            {me.data.avatarUrl ? (
              <Image source={{ uri: me.data.avatarUrl }} style={styles.avatarImg} />
            ) : (
              <Feather name="user" size={32} color="#7a7a82" />
            )}
          </View>
          <Text style={styles.name}>{me.data.displayName}</Text>
          <Text style={styles.username}>@{me.data.username}</Text>
          {me.data.bio ? <Text style={styles.bio}>{me.data.bio}</Text> : null}
          <View style={styles.statsRow}>
            <Text style={styles.statText}>
              <Text style={styles.bold}>{reviewItems.length}</Text> reviews
            </Text>
            <Text style={styles.statText}>
              <Text style={styles.bold}>{followers.data?.length ?? 0}</Text> seguidores
            </Text>
            <Text style={styles.statText}>
              <Text style={styles.bold}>{following.data?.length ?? 0}</Text> seguindo
            </Text>
          </View>
          <Pressable onPress={() => logout.mutate()} style={styles.logout}>
            <Text style={styles.logoutText}>Sair</Text>
          </Pressable>
          <Text style={styles.subheading}>Minhas reviews</Text>
        </View>
      }
      onEndReached={() => reviews.hasNextPage && reviews.fetchNextPage()}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={<Text style={styles.empty}>Você ainda não postou nenhuma review.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: "#050506" },
  center: { justifyContent: "center", alignItems: "center" },
  list: { padding: 16 },
  header: { gap: 4, marginBottom: 20 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#2a2a30",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 8,
  },
  avatarImg: { width: "100%", height: "100%" },
  name: { fontSize: 22, fontWeight: "700", color: "#f5f5f0" },
  username: { color: "#9a9aa2" },
  bio: { marginTop: 4, color: "#f5f5f0" },
  statsRow: { flexDirection: "row", gap: 24, marginVertical: 12 },
  statText: { color: "#f5f5f0" },
  bold: { fontWeight: "700" },
  logout: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#2a2a30",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  logoutText: { color: "#f5f5f0" },
  subheading: { fontSize: 16, fontWeight: "600", marginTop: 20, color: "#f5f5f0" },
  empty: { color: "#9a9aa2" },
});
