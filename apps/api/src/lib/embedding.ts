/**
 * Feature-hashed embeddings for reviews (posts).
 *
 * Each review's vector is built from four independently-hashed sub-vectors —
 * user, experience, experience city, and rating — concatenated and
 * L2-normalized. Two reviews that share a user, experience, or city end up
 * with an *identical* sub-vector for that feature (same input string always
 * hashes to the same vector), which pulls their cosine similarity up; rating
 * uses a smooth proximity encoding instead of a hash, so a 4-star and a
 * 5-star review are closer than a 4-star and a 1-star one.
 *
 * This is a deterministic "hashing trick" style embedding (no ML model, no
 * external service) sized for the scale of this app: similarity is computed
 * in-process over all reviews rather than via an ANN index. That's the right
 * tradeoff while the review table is small; if it ever grows large enough
 * for a full scan to matter, swap in pgvector + an index without changing
 * this module's public shape.
 */

// Hashed sub-vectors need enough dimensions that two *different* category
// values land reliably close to orthogonal (noise std shrinks as 1/sqrt(d)):
// too few dims and random hash noise can swamp a genuine "same city" or
// "same experience" match, ranking unrelated reviews above related ones.
const USER_DIMS = 64;
const EXPERIENCE_DIMS = 128;
const CITY_DIMS = 64;
const RATING_DIMS = 5; // one slot per possible 1-5 rating; not hash-based, no noise floor

const USER_WEIGHT = 1.0;
const EXPERIENCE_WEIGHT = 1.4;
const CITY_WEIGHT = 0.8;
const RATING_WEIGHT = 0.6;

export const EMBEDDING_DIMENSIONS = USER_DIMS + EXPERIENCE_DIMS + CITY_DIMS + RATING_DIMS;

/** Deterministic 32-bit string hash (FNV-1a), used to seed the PRNG below. */
function fnv1aHash(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** mulberry32: small, fast, deterministic PRNG from a 32-bit seed. */
function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function l2Normalize(vector: number[]): number[] {
  const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
  if (norm === 0) return vector;
  return vector.map((v) => v / norm);
}

/**
 * Hashes an arbitrary string into a fixed-length, *unit-length* pseudo-random
 * vector. Normalizing each sub-vector individually (rather than leaving its
 * magnitude to chance) matters: it's what makes the "same value" contribution
 * to the final cosine similarity a fixed, predictable amount (equal to that
 * feature's weight squared) instead of noise that varies with hash luck.
 */
function hashToVector(value: string, dims: number): number[] {
  const rng = mulberry32(fnv1aHash(value));
  return l2Normalize(Array.from({ length: dims }, () => rng() * 2 - 1));
}

/** Encodes a 1-5 rating as proximity to each possible rating value (closer ratings overlap more). */
function ratingToVector(rating: number): number[] {
  const vector: number[] = [];
  for (let r = 1; r <= RATING_DIMS; r++) {
    vector.push(Math.max(0, 1 - Math.abs(rating - r) / 2));
  }
  return l2Normalize(vector);
}

function scale(vector: number[], factor: number): number[] {
  return vector.map((v) => v * factor);
}

export interface ReviewEmbeddingInput {
  userId: string;
  experienceId: string;
  city: string | null;
  rating: number;
}

export function computeReviewEmbedding(input: ReviewEmbeddingInput): number[] {
  const userVector = scale(hashToVector(`user:${input.userId}`, USER_DIMS), USER_WEIGHT);
  const experienceVector = scale(
    hashToVector(`experience:${input.experienceId}`, EXPERIENCE_DIMS),
    EXPERIENCE_WEIGHT,
  );
  const cityVector = scale(
    hashToVector(`city:${input.city?.trim().toLowerCase() ?? ""}`, CITY_DIMS),
    CITY_WEIGHT,
  );
  const ratingVector = scale(ratingToVector(input.rating), RATING_WEIGHT);

  return l2Normalize([...userVector, ...experienceVector, ...cityVector, ...ratingVector]);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const length = Math.min(a.length, b.length);
  if (length === 0) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < length; i++) {
    const ai = a[i] ?? 0;
    const bi = b[i] ?? 0;
    dot += ai * bi;
    normA += ai * ai;
    normB += bi * bi;
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
