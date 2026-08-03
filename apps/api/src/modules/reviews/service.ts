import type {
  AttachPhotoInput,
  Comment,
  CreateCommentInput,
  CreateReviewInput,
  Review,
  ReviewWithRelations,
  UpdateReviewInput,
} from "@connosr/shared-types";
import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { getPhotoUrl } from "../../lib/s3.js";
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
  const review = await prisma.review.create({
    data: { userId, experienceId: input.experienceId, rating: input.rating, text: input.text },
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

export async function updateReview(
  id: string,
  userId: string,
  input: UpdateReviewInput,
): Promise<Review | null> {
  const { count } = await prisma.review.updateMany({ where: { id, userId }, data: input });
  if (count === 0) return null;
  const review = await prisma.review.findUnique({ where: { id }, include: REVIEW_INCLUDE });
  return review ? toDto(review) : null;
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
