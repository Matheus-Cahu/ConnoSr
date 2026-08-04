import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useFeed } from "@connosr/api-client";
import { ReviewCard } from "../../src/components/ReviewCard";

export default function HomeScreen() {
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
      renderItem={({ item }) => <ReviewCard review={item} />}
      onEndReached={() => feed.hasNextPage && feed.fetchNextPage()}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={
        <Text style={styles.empty}>
          Nenhuma review por aqui ainda. Siga outras pessoas para ver as reviews delas no seu feed.
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 16 },
  empty: { color: "gray", padding: 16 },
});
