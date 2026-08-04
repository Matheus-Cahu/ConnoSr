import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useFeed } from "@connosr/api-client";
import { ActivityRow } from "../../src/components/ActivityRow";

export default function ActivityScreen() {
  const feed = useFeed();
  const reviews = feed.data?.pages.flatMap((page) => page.items) ?? [];

  if (feed.isLoading) {
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
      onEndReached={() => feed.hasNextPage && feed.fetchNextPage()}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={<Text style={styles.empty}>Nenhuma atividade de quem você segue ainda.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 16 },
  empty: { color: "gray", padding: 16 },
});
