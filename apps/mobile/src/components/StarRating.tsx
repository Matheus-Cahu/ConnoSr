import { StyleSheet, Text, View } from "react-native";

export function StarRating({ rating }: { rating: number }) {
  return (
    <View style={styles.row}>
      <Text style={styles.filled}>{"★".repeat(rating)}</Text>
      <Text style={styles.empty}>{"★".repeat(5 - rating)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row" },
  filled: { color: "#e8503a", letterSpacing: 1 },
  empty: { color: "#3a3a3a", letterSpacing: 1 },
});
