import type { CursorPageQuery, ReviewWithRelations } from "@connosr/shared-types";
import { prisma } from "../../lib/prisma.js";
import { getReview } from "../reviews/service.js";

export async function getFeed(
  userId: string,
  query: CursorPageQuery,
): Promise<{ items: ReviewWithRelations[]; nextCursor: string | null }> {
  const followingIds = (
    await prisma.follow.findMany({ where: { followerId: userId }, select: { followingId: true } })
  ).map((f) => f.followingId);

  if (followingIds.length === 0) {
    return { items: [], nextCursor: null };
  }

  const reviews = await prisma.review.findMany({
    where: { userId: { in: followingIds } },
    orderBy: { createdAt: "desc" },
    take: query.limit + 1,
    ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
  });

  const hasMore = reviews.length > query.limit;
  const page = hasMore ? reviews.slice(0, query.limit) : reviews;
  const nextCursor = hasMore ? (page[page.length - 1]?.id ?? null) : null;

  const items = (
    await Promise.all(page.map((review) => getReview(review.id, userId)))
  ).filter((review): review is ReviewWithRelations => review !== null);

  return { items, nextCursor };
}
