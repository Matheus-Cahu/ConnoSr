import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from "react-native";
import { useFollowers, useFollowing, useLogout, useMe, useUserReviews } from "@connosr/api-client";
import { JournalEntryRow } from "../../src/components/JournalEntryRow";

export default function ProfileScreen() {
  const me = useMe();
  const logout = useLogout();
  const followers = useFollowers(me.data?.id ?? "");
  const following = useFollowing(me.data?.id ?? "");
  const reviews = useUserReviews(me.data?.id ?? "");
  const reviewItems = reviews.data?.pages.flatMap((page) => page.items) ?? [];

  if (me.isLoading || !me.data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={reviewItems}
      keyExtractor={(review) => review.id}
      renderItem={({ item }) => <JournalEntryRow review={item} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.name}>{me.data.displayName}</Text>
          <Text style={styles.username}>@{me.data.username}</Text>
          {me.data.bio ? <Text style={styles.bio}>{me.data.bio}</Text> : null}
          <View style={styles.statsRow}>
            <Text>
              <Text style={styles.bold}>{reviewItems.length}</Text> reviews
            </Text>
            <Text>
              <Text style={styles.bold}>{followers.data?.length ?? 0}</Text> seguidores
            </Text>
            <Text>
              <Text style={styles.bold}>{following.data?.length ?? 0}</Text> seguindo
            </Text>
          </View>
          <Button title="Sair" onPress={() => logout.mutate()} />
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
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 16 },
  header: { gap: 4, marginBottom: 16 },
  name: { fontSize: 24, fontWeight: "700" },
  username: { color: "gray" },
  bio: { marginTop: 4 },
  statsRow: { flexDirection: "row", gap: 24, marginVertical: 12 },
  bold: { fontWeight: "700" },
  subheading: { fontSize: 16, fontWeight: "600", marginTop: 16 },
  empty: { color: "gray" },
});
