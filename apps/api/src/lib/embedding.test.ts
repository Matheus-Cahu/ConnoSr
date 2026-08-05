import { describe, expect, it } from "vitest";
import { computeReviewEmbedding, cosineSimilarity, EMBEDDING_DIMENSIONS } from "./embedding.js";

const base = { userId: "user-a", experienceId: "exp-a", city: "São Paulo", rating: 5 };

describe("computeReviewEmbedding", () => {
  it("is deterministic for the same input", () => {
    const a = computeReviewEmbedding(base);
    const b = computeReviewEmbedding({ ...base });
    expect(a).toEqual(b);
  });

  it("produces vectors of the expected length", () => {
    expect(computeReviewEmbedding(base)).toHaveLength(EMBEDDING_DIMENSIONS);
  });

  it("produces a unit-length (L2-normalized) vector", () => {
    const vector = computeReviewEmbedding(base);
    const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
    expect(norm).toBeCloseTo(1, 5);
  });

  it("is case/whitespace-insensitive for city", () => {
    const a = computeReviewEmbedding({ ...base, city: "São Paulo" });
    const b = computeReviewEmbedding({ ...base, city: "  são paulo  " });
    expect(a).toEqual(b);
  });
});

describe("cosineSimilarity + computeReviewEmbedding", () => {
  it("gives identical reviews similarity 1", () => {
    const a = computeReviewEmbedding(base);
    const b = computeReviewEmbedding({ ...base });
    expect(cosineSimilarity(a, b)).toBeCloseTo(1, 5);
  });

  it("ranks same-experience reviews above same-city-only reviews", () => {
    const target = computeReviewEmbedding(base);
    const sameExperience = computeReviewEmbedding({
      ...base,
      userId: "user-b",
      rating: 4,
    });
    const sameCityOnly = computeReviewEmbedding({
      userId: "user-c",
      experienceId: "exp-z",
      city: "São Paulo",
      rating: 4,
    });
    const unrelated = computeReviewEmbedding({
      userId: "user-d",
      experienceId: "exp-y",
      city: "Curitiba",
      rating: 1,
    });

    const simSameExperience = cosineSimilarity(target, sameExperience);
    const simSameCityOnly = cosineSimilarity(target, sameCityOnly);
    const simUnrelated = cosineSimilarity(target, unrelated);

    expect(simSameExperience).toBeGreaterThan(simSameCityOnly);
    expect(simSameCityOnly).toBeGreaterThan(simUnrelated);
  });

  it("ranks closer ratings as more similar, all else equal", () => {
    const target = computeReviewEmbedding({ ...base, userId: "u1", experienceId: "e1", rating: 5 });
    const closeRating = computeReviewEmbedding({ ...base, userId: "u2", experienceId: "e2", rating: 4 });
    const farRating = computeReviewEmbedding({ ...base, userId: "u3", experienceId: "e3", rating: 1 });

    expect(cosineSimilarity(target, closeRating)).toBeGreaterThan(cosineSimilarity(target, farRating));
  });
});
