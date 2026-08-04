import { useRef } from "react";
import type { Photo } from "@connosr/shared-types";

export function PhotoCarousel({
  photos,
  onIndexChange,
}: {
  photos: Photo[];
  onIndexChange?: (index: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  function handleScroll() {
    const el = containerRef.current;
    if (!el || el.clientWidth === 0) return;
    onIndexChange?.(Math.round(el.scrollLeft / el.clientWidth));
  }

  if (photos.length === 0) {
    return <div style={styles.placeholder} />;
  }

  return (
    <div ref={containerRef} onScroll={handleScroll} className="no-scrollbar" style={styles.container}>
      {photos.map((photo) => (
        <img key={photo.id} src={photo.url} alt="" style={styles.photo} />
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    overflowX: "auto",
    scrollSnapType: "x mandatory",
    width: "100%",
    height: "100%",
  },
  photo: {
    flex: "0 0 100%",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    scrollSnapAlign: "start",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    background: "linear-gradient(160deg, #cfd4d8 0%, #9aa1a8 45%, #24282c 100%)",
  },
} as const;
