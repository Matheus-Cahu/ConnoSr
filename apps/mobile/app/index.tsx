import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useMe } from "@connosr/api-client";

export default function FeedScreen() {
  const me = useMe();

  if (me.isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (me.isError || !me.data) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feed</Text>
      <Text>
        Bem-vindo(a), {me.data.displayName} (@{me.data.username})
      </Text>
      <Text style={styles.muted}>O feed de reviews aparecerá aqui.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 8 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "700" },
  muted: { color: "#888" },
});
