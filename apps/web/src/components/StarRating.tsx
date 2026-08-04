export function StarRating({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating} de 5 estrelas`} style={{ color: "#e8503a", letterSpacing: 1 }}>
      {"★".repeat(rating)}
      <span style={{ color: "#3a3a3a" }}>{"★".repeat(5 - rating)}</span>
    </span>
  );
}
