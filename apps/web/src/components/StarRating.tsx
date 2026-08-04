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
    <span
      aria-label={`${rating} de 5 estrelas`}
      style={{ letterSpacing: 1, fontSize: size, textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
    >
      <span style={{ color }}>{"★".repeat(rating)}</span>
      <span style={{ color: emptyColor }}>{"★".repeat(5 - rating)}</span>
    </span>
  );
}
