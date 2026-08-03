import type { User } from "@connosr/shared-types";
import { prisma } from "../../lib/prisma.js";
import { hashPassword, verifyPassword } from "../../lib/password.js";
import { generateRefreshToken, hashRefreshToken, signAccessToken } from "../../lib/tokens.js";
import { env } from "../../config/env.js";

export class AuthError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
  }
}

function toPublicUser(user: {
  id: string;
  username: string;
  displayName: string;
  avatarKey: string | null;
  bio: string | null;
  createdAt: Date;
}): User {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    avatarUrl: user.avatarKey ? `${env.S3_PUBLIC_BASE_URL ?? ""}/${user.avatarKey}` : null,
    bio: user.bio,
    createdAt: user.createdAt.toISOString(),
  };
}

async function issueTokens(userId: string) {
  const accessToken = signAccessToken(userId);
  const { token: refreshToken, tokenHash, expiresAt } = generateRefreshToken();
  await prisma.refreshToken.create({
    data: { userId, tokenHash, expiresAt },
  });
  return {
    accessToken,
    refreshToken,
    expiresIn: env.JWT_ACCESS_TTL_SECONDS,
  };
}

export async function signup(input: { email: string; username: string; displayName: string; password: string }) {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: input.email }, { username: input.username }] },
  });
  if (existing) {
    throw new AuthError(409, "Email or username already in use");
  }
  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      email: input.email,
      username: input.username,
      displayName: input.displayName,
      passwordHash,
    },
  });
  const tokens = await issueTokens(user.id);
  return { user: toPublicUser(user), tokens };
}

export async function login(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !(await verifyPassword(user.passwordHash, input.password))) {
    throw new AuthError(401, "Invalid email or password");
  }
  const tokens = await issueTokens(user.id);
  return { user: toPublicUser(user), tokens };
}

export async function refresh(refreshToken: string) {
  const tokenHash = hashRefreshToken(refreshToken);
  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } });
  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw new AuthError(401, "Invalid or expired refresh token");
  }
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });
  return issueTokens(stored.userId);
}

export async function logout(refreshToken: string): Promise<void> {
  const tokenHash = hashRefreshToken(refreshToken);
  await prisma.refreshToken
    .updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    })
    .catch(() => undefined);
}

export async function getUserById(userId: string): Promise<User | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user ? toPublicUser(user) : null;
}

export { toPublicUser };
