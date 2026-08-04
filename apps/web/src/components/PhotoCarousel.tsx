import type { Photo } from "@connosr/shared-types";

export function PhotoCarousel({ photos }: { photos: Photo[] }) {
  if (photos.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        margin: "12px 0",
        scrollSnapType: "x mandatory",
      }}
    >
      {photos.map((photo) => (
        <img
          key={photo.id}
          src={photo.url}
          alt=""
          style={{
            height: 220,
            width: "auto",
            flexShrink: 0,
            borderRadius: 8,
            objectFit: "cover",
            scrollSnapAlign: "start",
          }}
        />
      ))}
    </div>
  );
}
