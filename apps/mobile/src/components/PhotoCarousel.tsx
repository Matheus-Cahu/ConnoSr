import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { Photo } from "@connosr/shared-types";

export function PhotoCarousel({
  photos,
  onIndexChange,
}: {
  photos: Photo[];
  onIndexChange?: (index: number) => void;
}) {
  const { width } = useWindowDimensions();
  const cardWidth = width - 32;

  function handleScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    if (cardWidth === 0) return;
    onIndexChange?.(Math.round(event.nativeEvent.contentOffset.x / cardWidth));
  }

  if (photos.length === 0) {
    return (
      <LinearGradient
        colors={["#cfd4d8", "#9aa1a8", "#24282c"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.fill}
      />
    );
  }

  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={handleScrollEnd}
      style={styles.fill}
    >
      {photos.map((photo) => (
        <View key={photo.id} style={{ width: cardWidth, height: "100%" }}>
          <Image source={{ uri: photo.url }} style={styles.photo} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fill: { width: "100%", height: "100%" },
  photo: { width: "100%", height: "100%", resizeMode: "cover" },
});
