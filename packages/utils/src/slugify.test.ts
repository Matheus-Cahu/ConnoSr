import { describe, expect, it } from "vitest";
import { slugifyExperienceName } from "./slugify.js";

describe("slugifyExperienceName", () => {
  it("lowercases and hyphenates", () => {
    expect(slugifyExperienceName("The Grand Café")).toBe("the-grand-cafe");
  });

  it("strips punctuation and collapses whitespace", () => {
    expect(slugifyExperienceName("  Joe's   Diner!! ")).toBe("joes-diner");
  });
});
