import { Image, ScrollView, StyleSheet } from "react-native";
import type { Photo } from "@connosr/shared-types";

export function PhotoCarousel({ photos }: { photos: Photo[] }) {
  if (photos.length === 0) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {photos.map((photo) => (
        <Image key={photo.id} source={{ uri: photo.url }} style={styles.photo} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 12 },
  photo: { height: 220, width: 220, borderRadius: 8, marginRight: 8 },
});
