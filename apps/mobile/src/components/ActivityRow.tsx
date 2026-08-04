import { StyleSheet, Text, View } from "react-native";
import { formatRelativeTime } from "@connosr/utils";
import type { ReviewWithRelations } from "@connosr/shared-types";
import { StarRating } from "./StarRating";

export function ActivityRow({ review }: { review: ReviewWithRelations }) {
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <Text>
          <Text style={styles.bold}>@{review.user.username}</Text> avaliou{" "}
          <Text style={styles.bold}>{review.experience.name}</Text>
        </Text>
        <StarRating rating={review.rating} />
      </View>
      <Text style={styles.timestamp}>{formatRelativeTime(review.createdAt)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a30",
  },
  text: { flex: 1, gap: 4 },
  bold: { fontWeight: "700" },
  timestamp: { fontSize: 12, color: "gray", marginLeft: 12 },
});
