import type {
  AttachPhotoInput,
  Comment,
  CreateCommentInput,
  CreateReviewInput,
  CursorPageQuery,
  Review,
  ReviewWithRelations,
  UpdateReviewInput,
} from "@connosr/shared-types";
import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { getPhotoUrl } from "../../lib/s3.js";
import { computeReviewEmbedding, cosineSimilarity } from "../../lib/embedding.js";
import { toPublicUser } from "../auth/service.js";

const REVIEW_INCLUDE = {
  photos: true,
  _count: { select: { likes: true, comments: true } },
} satisfies Prisma.ReviewInclude;

type ReviewRow = Prisma.ReviewGetPayload<{ include: typeof REVIEW_INCLUDE }>;

async function toDto(review: ReviewRow, currentUserId?: string): Promise<Review> {
  const photos = await Promise.all(
    review.photos
      .sort((a, b) => a.position - b.position)
      .map(async (photo) => ({
        id: photo.id,
        reviewId: photo.reviewId,
        url: await getPhotoUrl(photo.objectKey),
        position: photo.position,
        width: photo.width,
        height: photo.height,
      })),
  );

  let likedByCurrentUser: boolean | undefined;
  if (currentUserId) {
    likedByCurrentUser =
      (await prisma.like.findUnique({
        where: { userId_reviewId: { userId: currentUserId, reviewId: review.id } },
      })) !== null;
  }

  return {
    id: review.id,
    userId: review.userId,
    experienceId: review.experienceId,
    rating: review.rating,
    text: review.text,
    photos,
    likeCount: review._count.likes,
    commentCount: review._count.comments,
    likedByCurrentUser,
    createdAt: review.createdAt.toISOString(),
  };
}

export async function createReview(userId: string, input: CreateReviewInput): Promise<Review> {
  const experience = await prisma.experience.findUnique({
    where: { id: input.experienceId },
    select: { city: true },
  });
  const embedding = computeReviewEmbedding({
    userId,
    experienceId: input.experienceId,
    city: experience?.city ?? null,
    rating: input.rating,
  });

  const review = await prisma.review.create({
    data: {
      userId,
      experienceId: input.experienceId,
      rating: input.rating,
      text: input.text,
      embedding,
    },
    include: REVIEW_INCLUDE,
  });
  return toDto(review);
}

export async function getReview(
  id: string,
  currentUserId?: string,
): Promise<ReviewWithRelations | null> {
  const review = await prisma.review.findUnique({
    where: { id },
    include: { ...REVIEW_INCLUDE, user: true, experience: true },
  });
  if (!review) return null;
  const dto = await toDto(review, currentUserId);
  return {
    ...dto,
    user: toPublicUser(review.user),
    experience: {
      id: review.experience.id,
      name: review.experience.name,
      category: review.experience.category as ReviewWithRelations["experience"]["category"],
      description: review.experience.description,
      addressLine: review.experience.addressLine,
      city: review.experience.city,
      region: review.experience.region,
      country: review.experience.country,
      latitude: review.experience.latitude,
      longitude: review.experience.longitude,
      archivedAt: review.experience.archivedAt?.toISOString() ?? null,
      createdAt: review.experience.createdAt.toISOString(),
    },
  };
}

export async function listReviewsByUser(
  targetUserId: string,
  query: CursorPageQuery,
  currentUserId?: string,
): Promise<{ items: ReviewWithRelations[]; nextCursor: string | null }> {
  const reviews = await prisma.review.findMany({
    where: { userId: targetUserId },
    orderBy: { createdAt: "desc" },
    take: query.limit + 1,
    ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
  });

  const hasMore = reviews.length > query.limit;
  const page = hasMore ? reviews.slice(0, query.limit) : reviews;
  const nextCursor = hasMore ? (page[page.length - 1]?.id ?? null) : null;

  const items = (
    await Promise.all(page.map((review) => getReview(review.id, currentUserId)))
  ).filter((review): review is ReviewWithRelations => review !== null);

  return { items, nextCursor };
}

export async function updateReview(
  id: string,
  userId: string,
  input: UpdateReviewInput,
): Promise<Review | null> {
  let embedding: number[] | undefined;
  if (input.rating !== undefined) {
    const existing = await prisma.review.findUnique({
      where: { id },
      select: { userId: true, experienceId: true, experience: { select: { city: true } } },
    });
    if (!existing) return null;
    embedding = computeReviewEmbedding({
      userId: existing.userId,
      experienceId: existing.experienceId,
      city: existing.experience.city,
      rating: input.rating,
    });
  }

  const { count } = await prisma.review.updateMany({
    where: { id, userId },
    data: { ...input, ...(embedding ? { embedding } : {}) },
  });
  if (count === 0) return null;
  const review = await prisma.review.findUnique({ where: { id }, include: REVIEW_INCLUDE });
  return review ? toDto(review) : null;
}

/**
 * Reviews vector-similar to the given one (same experience/user/city pull
 * strongest, close ratings add a smaller boost), ranked by cosine similarity.
 * Scans all other reviews' embeddings in-process — fine at this app's scale;
 * see lib/embedding.ts for the tradeoff if that ever needs to change.
 */
export async function listSimilarReviews(
  reviewId: string,
  limit: number,
  currentUserId?: string,
): Promise<ReviewWithRelations[]> {
  const target = await prisma.review.findUnique({ where: { id: reviewId }, select: { embedding: true } });
  if (!target || target.embedding.length === 0) return [];

  const candidates = await prisma.review.findMany({
    where: { id: { not: reviewId } },
    select: { id: true, embedding: true },
  });

  const ranked = candidates
    .filter((c) => c.embedding.length > 0)
    .map((c) => ({ id: c.id, score: cosineSimilarity(target.embedding, c.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  const items = await Promise.all(ranked.map((r) => getReview(r.id, currentUserId)));
  return items.filter((review): review is ReviewWithRelations => review !== null);
}

export async function deleteReview(id: string, userId: string): Promise<boolean> {
  const result = await prisma.review.deleteMany({ where: { id, userId } });
  return result.count > 0;
}

export async function attachPhoto(reviewId: string, input: AttachPhotoInput) {
  return prisma.photo.upsert({
    where: { reviewId_position: { reviewId, position: input.position } },
    create: {
      reviewId,
      objectKey: input.objectKey,
      position: input.position,
      width: input.width,
      height: input.height,
    },
    update: { objectKey: input.objectKey, width: input.width, height: input.height },
  });
}

export async function likeReview(userId: string, reviewId: string): Promise<void> {
  await prisma.like.upsert({
    where: { userId_reviewId: { userId, reviewId } },
    create: { userId, reviewId },
    update: {},
  });
}

export async function unlikeReview(userId: string, reviewId: string): Promise<void> {
  await prisma.like
    .delete({ where: { userId_reviewId: { userId, reviewId } } })
    .catch(() => undefined);
}

export async function listComments(reviewId: string): Promise<Comment[]> {
  const comments = await prisma.comment.findMany({
    where: { reviewId },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });
  return comments.map((comment) => ({
    id: comment.id,
    reviewId: comment.reviewId,
    userId: comment.userId,
    user: toPublicUser(comment.user),
    text: comment.text,
    createdAt: comment.createdAt.toISOString(),
  }));
}

export async function createComment(
  userId: string,
  reviewId: string,
  input: CreateCommentInput,
): Promise<Comment> {
  const comment = await prisma.comment.create({
    data: { userId, reviewId, text: input.text },
    include: { user: true },
  });
  return {
    id: comment.id,
    reviewId: comment.reviewId,
    userId: comment.userId,
    user: toPublicUser(comment.user),
    text: comment.text,
    createdAt: comment.createdAt.toISOString(),
  };
}
