import type { FollowListItem, UpdateUserInput, User } from "@connosr/shared-types";
import { prisma } from "../../lib/prisma.js";
import { toPublicUser } from "../auth/service.js";

export async function getUser(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({ where: { id } });
  return user ? toPublicUser(user) : null;
}

export async function updateMe(userId: string, input: UpdateUserInput): Promise<User> {
  const user = await prisma.user.update({ where: { id: userId }, data: input });
  return toPublicUser(user);
}

export async function followUser(followerId: string, followingId: string): Promise<void> {
  if (followerId === followingId) return;
  await prisma.follow.upsert({
    where: { followerId_followingId: { followerId, followingId } },
    create: { followerId, followingId },
    update: {},
  });
}

export async function unfollowUser(followerId: string, followingId: string): Promise<void> {
  await prisma.follow
    .delete({ where: { followerId_followingId: { followerId, followingId } } })
    .catch(() => undefined);
}

export async function listFollowers(
  userId: string,
  currentUserId?: string,
): Promise<FollowListItem[]> {
  const follows = await prisma.follow.findMany({
    where: { followingId: userId },
    include: { follower: true },
    orderBy: { createdAt: "desc" },
  });
  return annotateFollowedByCurrentUser(
    follows.map((f) => f.follower),
    currentUserId,
  );
}

export async function listFollowing(
  userId: string,
  currentUserId?: string,
): Promise<FollowListItem[]> {
  const follows = await prisma.follow.findMany({
    where: { followerId: userId },
    include: { following: true },
    orderBy: { createdAt: "desc" },
  });
  return annotateFollowedByCurrentUser(
    follows.map((f) => f.following),
    currentUserId,
  );
}

async function annotateFollowedByCurrentUser(
  users: Parameters<typeof toPublicUser>[0][],
  currentUserId?: string,
): Promise<FollowListItem[]> {
  if (!currentUserId) return users.map((u) => toPublicUser(u));
  const currentFollowing = await prisma.follow.findMany({
    where: { followerId: currentUserId, followingId: { in: users.map((u) => u.id) } },
    select: { followingId: true },
  });
  const followingIds = new Set(currentFollowing.map((f) => f.followingId));
  return users.map((u) => ({ ...toPublicUser(u), followedByCurrentUser: followingIds.has(u.id) }));
}
