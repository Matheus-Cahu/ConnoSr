import { z } from "zod";

export const experienceCategorySchema = z.enum([
  "RESTAURANT",
  "HOTEL",
  "RESORT",
  "PARK",
  "BAR",
  "CAFE",
  "ATTRACTION",
  "OTHER",
]);
export type ExperienceCategory = z.infer<typeof experienceCategorySchema>;
