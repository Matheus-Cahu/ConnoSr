import { z } from "zod";
import { userSchema } from "./user.js";

export const signupInputSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_]+$/, "lowercase letters, numbers, underscore only"),
  displayName: z.string().min(1).max(80),
  password: z.string().min(8).max(128),
});
export type SignupInput = z.infer<typeof signupInputSchema>;

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginInputSchema>;

export const authTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number().int().positive(),
});
export type AuthTokens = z.infer<typeof authTokensSchema>;

export const authResponseSchema = z.object({
  user: userSchema,
  tokens: authTokensSchema,
});
export type AuthResponse = z.infer<typeof authResponseSchema>;

export const refreshInputSchema = z.object({
  refreshToken: z.string().optional(),
});
export type RefreshInput = z.infer<typeof refreshInputSchema>;
