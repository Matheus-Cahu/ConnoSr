import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useMe, useUserReviews } from "@connosr/api-client";
import { ActivityRow } from "../../src/components/ActivityRow";

export default function MyActivityScreen() {
  const me = useMe();
  const activity = useUserReviews(me.data?.id ?? "");
  const reviews = activity.data?.pages.flatMap((page) => page.items) ?? [];

  if (me.isLoading || activity.isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={reviews}
      keyExtractor={(review) => review.id}
      renderItem={({ item }) => <ActivityRow review={item} />}
      onEndReached={() => activity.hasNextPage && activity.fetchNextPage()}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={<Text style={styles.empty}>Você ainda não tem atividade.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 16 },
  empty: { color: "gray", padding: 16 },
});
