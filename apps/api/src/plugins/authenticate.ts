import fp from "fastify-plugin";
import type { FastifyReply, FastifyRequest } from "fastify";
import { verifyAccessToken } from "../lib/tokens.js";

declare module "fastify" {
  interface FastifyRequest {
    userId: string;
  }
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export default fp(async (fastify) => {
  fastify.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
    const header = request.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;
    if (!token) {
      return reply.code(401).send({ message: "Missing access token" });
    }
    try {
      const payload = verifyAccessToken(token);
      request.userId = payload.sub;
    } catch {
      return reply.code(401).send({ message: "Invalid or expired access token" });
    }
  });
});
