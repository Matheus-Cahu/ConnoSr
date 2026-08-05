import { ActivityIndicator, FlatList, StyleSheet, Text } from "react-native";
import { useFeed } from "@connosr/api-client";
import { ReviewCard } from "../../src/components/ReviewCard";
import { SearchBar } from "../../src/components/SearchBar";

export default function HomeScreen() {
  const feed = useFeed();
  const reviews = feed.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <FlatList
      style={styles.background}
      contentContainerStyle={styles.list}
      data={reviews}
      keyExtractor={(review) => review.id}
      renderItem={({ item }) => <ReviewCard review={item} />}
      onEndReached={() => feed.hasNextPage && feed.fetchNextPage()}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={<SearchBar />}
      ListEmptyComponent={
        feed.isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.empty}>
            Nenhuma review por aqui ainda. Siga outras pessoas para ver as reviews delas no seu feed.
          </Text>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: "#050506" },
  list: { padding: 16 },
  empty: { color: "#9a9aa2", padding: 16 },
});
