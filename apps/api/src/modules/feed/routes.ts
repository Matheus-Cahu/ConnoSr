import type { FastifyInstance } from "fastify";
import { cursorPageQuerySchema } from "@connosr/shared-types";
import { getFeed } from "./service.js";

export default async function feedRoutes(fastify: FastifyInstance) {
  fastify.get("/", { preHandler: fastify.authenticate }, async (request, reply) => {
    const query = cursorPageQuerySchema.parse(request.query);
    return reply.send(await getFeed(request.userId, query));
  });
}
