import { StyleSheet, Text, View } from "react-native";

export function StarRating({
  rating,
  color = "#e8503a",
  emptyColor = "#3a3a3a",
  size,
}: {
  rating: number;
  color?: string;
  emptyColor?: string;
  size?: number;
}) {
  return (
    <View style={styles.row}>
      <Text style={[styles.filled, { color, fontSize: size }]}>{"★".repeat(rating)}</Text>
      <Text style={[styles.empty, { color: emptyColor, fontSize: size }]}>{"★".repeat(5 - rating)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row" },
  filled: { letterSpacing: 1, textShadowColor: "rgba(0,0,0,0.5)", textShadowRadius: 3, textShadowOffset: { width: 0, height: 1 } },
  empty: { letterSpacing: 1 },
});
