import { z } from "zod";
import { userSchema } from "./user.js";
import { experienceSchema } from "./experience.js";
import { photoSchema } from "./photo.js";

export const reviewSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  experienceId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  text: z.string().max(4000).nullable(),
  photos: z.array(photoSchema),
  likeCount: z.number().int().min(0),
  commentCount: z.number().int().min(0),
  likedByCurrentUser: z.boolean().optional(),
  createdAt: z.string().datetime(),
});
export type Review = z.infer<typeof reviewSchema>;

export const reviewWithRelationsSchema = reviewSchema.extend({
  user: userSchema,
  experience: experienceSchema,
});
export type ReviewWithRelations = z.infer<typeof reviewWithRelationsSchema>;

export const createReviewInputSchema = z.object({
  experienceId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  text: z.string().max(4000).optional(),
});
export type CreateReviewInput = z.infer<typeof createReviewInputSchema>;

export const updateReviewInputSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  text: z.string().max(4000).nullable().optional(),
});
export type UpdateReviewInput = z.infer<typeof updateReviewInputSchema>;

export const similarReviewsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(20).default(10),
});
export type SimilarReviewsQuery = z.infer<typeof similarReviewsQuerySchema>;

export const similarReviewsResponseSchema = z.object({
  items: z.array(reviewWithRelationsSchema),
});
export type SimilarReviewsResponse = z.infer<typeof similarReviewsResponseSchema>;

export const commentSchema = z.object({
  id: z.string().uuid(),
  reviewId: z.string().uuid(),
  userId: z.string().uuid(),
  user: userSchema,
  text: z.string().max(1000),
  createdAt: z.string().datetime(),
});
export type Comment = z.infer<typeof commentSchema>;

export const createCommentInputSchema = z.object({
  text: z.string().min(1).max(1000),
});
export type CreateCommentInput = z.infer<typeof createCommentInputSchema>;
