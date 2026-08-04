import { StyleSheet, View } from "react-native";

export function CarouselDots({ count, activeIndex }: { count: number; activeIndex: number }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={[styles.dot, i === activeIndex ? styles.active : styles.inactive]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "center", gap: 6, marginVertical: 10 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  active: { backgroundColor: "#fff" },
  inactive: { backgroundColor: "rgba(255,255,255,0.35)" },
});
