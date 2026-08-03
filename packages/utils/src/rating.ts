export function formatRating(rating: number): string {
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    throw new RangeError(`rating must be between 1 and 5, got ${rating}`);
  }
  return rating.toFixed(1);
}

export function averageRating(ratings: number[]): number | null {
  if (ratings.length === 0) return null;
  const sum = ratings.reduce((total, rating) => total + rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
}
