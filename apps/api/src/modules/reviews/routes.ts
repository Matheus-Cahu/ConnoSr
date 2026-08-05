import type { FastifyInstance } from "fastify";
import {
  attachPhotoInputSchema,
  createCommentInputSchema,
  createReviewInputSchema,
  similarReviewsQuerySchema,
  updateReviewInputSchema,
} from "@connosr/shared-types";
import {
  attachPhoto,
  createComment,
  createReview,
  deleteReview,
  getReview,
  likeReview,
  listComments,
  listSimilarReviews,
  unlikeReview,
  updateReview,
} from "./service.js";

export default async function reviewRoutes(fastify: FastifyInstance) {
  fastify.post("/", { preHandler: fastify.authenticate }, async (request, reply) => {
    const input = createReviewInputSchema.parse(request.body);
    const review = await createReview(request.userId, input);
    return reply.code(201).send(review);
  });

  fastify.get<{ Params: { id: string } }>(
    "/:id",
    { preHandler: fastify.optionalAuthenticate },
    async (request, reply) => {
      const review = await getReview(request.params.id, request.optionalUserId);
      if (!review) return reply.code(404).send({ message: "Review not found" });
      return reply.send(review);
    },
  );

  fastify.patch<{ Params: { id: string } }>(
    "/:id",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const input = updateReviewInputSchema.parse(request.body);
      const review = await updateReview(request.params.id, request.userId, input);
      if (!review) return reply.code(404).send({ message: "Review not found" });
      return reply.send(review);
    },
  );

  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const deleted = await deleteReview(request.params.id, request.userId);
      if (!deleted) return reply.code(404).send({ message: "Review not found" });
      return reply.code(204).send();
    },
  );

  fastify.post<{ Params: { id: string } }>(
    "/:id/photos",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const input = attachPhotoInputSchema.parse(request.body);
      const photo = await attachPhoto(request.params.id, input);
      return reply.code(201).send(photo);
    },
  );

  fastify.post<{ Params: { id: string } }>(
    "/:id/like",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      await likeReview(request.userId, request.params.id);
      return reply.code(204).send();
    },
  );

  fastify.delete<{ Params: { id: string } }>(
    "/:id/like",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      await unlikeReview(request.userId, request.params.id);
      return reply.code(204).send();
    },
  );

  fastify.get<{ Params: { id: string } }>(
    "/:id/similar",
    { preHandler: fastify.optionalAuthenticate },
    async (request, reply) => {
      const query = similarReviewsQuerySchema.parse(request.query);
      const items = await listSimilarReviews(request.params.id, query.limit, request.optionalUserId);
      return reply.send({ items });
    },
  );

  fastify.get<{ Params: { id: string } }>("/:id/comments", async (request, reply) => {
    return reply.send(await listComments(request.params.id));
  });

  fastify.post<{ Params: { id: string } }>(
    "/:id/comments",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const input = createCommentInputSchema.parse(request.body);
      const comment = await createComment(request.userId, request.params.id, input);
      return reply.code(201).send(comment);
    },
  );
}
