import { createHash, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface AccessTokenPayload {
  sub: string;
}

export function signAccessToken(userId: string): string {
  return jwt.sign({ sub: userId } satisfies AccessTokenPayload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_TTL_SECONDS,
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
}

/** Refresh tokens are opaque random values; only their hash is persisted. */
export function generateRefreshToken(): { token: string; tokenHash: string; expiresAt: Date } {
  const token = randomBytes(48).toString("base64url");
  const tokenHash = hashRefreshToken(token);
  const expiresAt = new Date(Date.now() + env.JWT_REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000);
  return { token, tokenHash, expiresAt };
}

export function hashRefreshToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
