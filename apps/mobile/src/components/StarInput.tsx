import { Pressable, StyleSheet, Text, View } from "react-native";

export function StarInput({ value, onChange }: { value: number; onChange: (rating: number) => void }) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable key={star} onPress={() => onChange(star)} hitSlop={6}>
          <Text style={[styles.star, { color: star <= value ? "#e8503a" : "#3a3a3a" }]}>★</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 4 },
  star: { fontSize: 32 },
});
