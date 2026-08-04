import { describe, expect, it } from "vitest";
import { formatRelativeTime } from "./relativeTime.js";

describe("formatRelativeTime", () => {
  const now = new Date("2026-08-03T12:00:00Z");

  it("returns 'agora' for very recent timestamps", () => {
    expect(formatRelativeTime(new Date("2026-08-03T11:59:45Z"), now)).toBe("agora");
  });

  it("formats minutes in the past", () => {
    expect(formatRelativeTime(new Date("2026-08-03T11:55:00Z"), now)).toBe("há 5 minutos");
  });

  it("formats hours in the past", () => {
    expect(formatRelativeTime(new Date("2026-08-03T09:00:00Z"), now)).toBe("há 3 horas");
  });

  it("formats days in the past", () => {
    expect(formatRelativeTime(new Date("2026-08-01T12:00:00Z"), now)).toBe("anteontem");
  });
});
