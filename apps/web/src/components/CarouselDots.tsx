export function CarouselDots({ count, activeIndex }: { count: number; activeIndex: number }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "10px 0" }}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: i === activeIndex ? "#fff" : "rgba(255,255,255,0.35)",
          }}
        />
      ))}
    </div>
  );
}
