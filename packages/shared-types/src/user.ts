import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(30),
  displayName: z.string().min(1).max(80),
  avatarUrl: z.string().url().nullable(),
  bio: z.string().max(280).nullable(),
  createdAt: z.string().datetime(),
});
export type User = z.infer<typeof userSchema>;

export const updateUserSchema = z.object({
  displayName: z.string().min(1).max(80).optional(),
  bio: z.string().max(280).nullable().optional(),
});
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const searchUsersQuerySchema = z.object({
  q: z.string().max(160).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
export type SearchUsersQuery = z.infer<typeof searchUsersQuerySchema>;
