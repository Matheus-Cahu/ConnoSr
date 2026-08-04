import type { FastifyInstance } from "fastify";
import { cursorPageQuerySchema, updateUserSchema } from "@connosr/shared-types";
import { listReviewsByUser } from "../reviews/service.js";
import {
  followUser,
  getUser,
  listFollowers,
  listFollowing,
  unfollowUser,
  updateMe,
} from "./service.js";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.patch("/me", { preHandler: fastify.authenticate }, async (request, reply) => {
    const input = updateUserSchema.parse(request.body);
    return reply.send(await updateMe(request.userId, input));
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const user = await getUser(request.params.id);
    if (!user) return reply.code(404).send({ message: "User not found" });
    return reply.send(user);
  });

  fastify.get<{ Params: { id: string } }>("/:id/followers", async (request, reply) => {
    return reply.send(await listFollowers(request.params.id));
  });

  fastify.get<{ Params: { id: string } }>("/:id/following", async (request, reply) => {
    return reply.send(await listFollowing(request.params.id));
  });

  fastify.get<{ Params: { id: string } }>(
    "/:id/reviews",
    { preHandler: fastify.optionalAuthenticate },
    async (request, reply) => {
      const query = cursorPageQuerySchema.parse(request.query);
      return reply.send(await listReviewsByUser(request.params.id, query, request.optionalUserId));
    },
  );

  fastify.post<{ Params: { id: string } }>(
    "/:id/follow",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      await followUser(request.userId, request.params.id);
      return reply.code(204).send();
    },
  );

  fastify.delete<{ Params: { id: string } }>(
    "/:id/follow",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      await unfollowUser(request.userId, request.params.id);
      return reply.code(204).send();
    },
  );
}
