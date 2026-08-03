import { z } from "zod";
import { userSchema } from "./user.js";

export const followSchema = z.object({
  followerId: z.string().uuid(),
  followingId: z.string().uuid(),
  createdAt: z.string().datetime(),
});
export type Follow = z.infer<typeof followSchema>;

export const followListItemSchema = userSchema.extend({
  followedByCurrentUser: z.boolean().optional(),
});
export type FollowListItem = z.infer<typeof followListItemSchema>;
