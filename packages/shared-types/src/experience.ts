import { z } from "zod";
import { experienceCategorySchema } from "./enums.js";

export const experienceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(160),
  category: experienceCategorySchema,
  description: z.string().max(2000).nullable(),
  addressLine: z.string().max(200).nullable(),
  city: z.string().max(100).nullable(),
  region: z.string().max(100).nullable(),
  country: z.string().max(100).nullable(),
  latitude: z.number().min(-90).max(90).nullable(),
  longitude: z.number().min(-180).max(180).nullable(),
  archivedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
});
export type Experience = z.infer<typeof experienceSchema>;

export const createExperienceInputSchema = z.object({
  name: z.string().min(1).max(160),
  category: experienceCategorySchema,
  description: z.string().max(2000).optional(),
  addressLine: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  region: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});
export type CreateExperienceInput = z.infer<typeof createExperienceInputSchema>;

export const updateExperienceInputSchema = createExperienceInputSchema.partial();
export type UpdateExperienceInput = z.infer<typeof updateExperienceInputSchema>;

export const searchExperiencesQuerySchema = z.object({
  q: z.string().max(160).optional(),
  category: experienceCategorySchema.optional(),
  city: z.string().max(100).optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
export type SearchExperiencesQuery = z.infer<typeof searchExperiencesQuerySchema>;
