const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

export function formatRelativeTime(date: Date | string, now: Date = new Date()): string {
  const target = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.round((target.getTime() - now.getTime()) / 1000);
  const absSeconds = Math.abs(seconds);

  if (absSeconds < 60) return "agora";

  const formatter = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
  for (const [unit, unitSeconds] of UNITS) {
    if (absSeconds >= unitSeconds) {
      return formatter.format(Math.round(seconds / unitSeconds), unit);
    }
  }
  return formatter.format(Math.round(seconds / 60), "minute");
}
