import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useMe, useUserReviews } from "@connosr/api-client";
import { JournalEntryRow } from "../../src/components/JournalEntryRow";

export default function JournalScreen() {
  const me = useMe();
  const journal = useUserReviews(me.data?.id ?? "");
  const reviews = journal.data?.pages.flatMap((page) => page.items) ?? [];

  if (me.isLoading || journal.isLoading) {
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
      renderItem={({ item }) => <JournalEntryRow review={item} />}
      onEndReached={() => journal.hasNextPage && journal.fetchNextPage()}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={<Text style={styles.empty}>Você ainda não postou nenhuma review.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 16 },
  empty: { color: "gray", padding: 16 },
});
