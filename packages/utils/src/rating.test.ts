import { describe, expect, it } from "vitest";
import { averageRating, formatRating } from "./rating.js";

describe("formatRating", () => {
  it("formats a valid rating to one decimal place", () => {
    expect(formatRating(4)).toBe("4.0");
    expect(formatRating(3.5)).toBe("3.5");
  });

  it("throws for out-of-range ratings", () => {
    expect(() => formatRating(0)).toThrow(RangeError);
    expect(() => formatRating(6)).toThrow(RangeError);
  });
});

describe("averageRating", () => {
  it("returns null for an empty list", () => {
    expect(averageRating([])).toBeNull();
  });

  it("averages and rounds to one decimal place", () => {
    expect(averageRating([5, 4, 3])).toBe(4);
    expect(averageRating([5, 4])).toBe(4.5);
  });
});
