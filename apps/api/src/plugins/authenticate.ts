import fp from "fastify-plugin";
import type { FastifyReply, FastifyRequest } from "fastify";
import { verifyAccessToken } from "../lib/tokens.js";

declare module "fastify" {
  interface FastifyRequest {
    userId: string;
    optionalUserId?: string;
  }
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    optionalAuthenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

function extractToken(request: FastifyRequest): string | null {
  const header = request.headers.authorization;
  return header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;
}

export default fp(async (fastify) => {
  fastify.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
    const token = extractToken(request);
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

  // Best-effort auth: sets optionalUserId when a valid token is present,
  // but never rejects, for routes that stay public but personalize when logged in.
  fastify.decorate("optionalAuthenticate", async (request: FastifyRequest) => {
    const token = extractToken(request);
    if (!token) return;
    try {
      const payload = verifyAccessToken(token);
      request.optionalUserId = payload.sub;
    } catch {
      // invalid/expired token on a public route: treat as anonymous
    }
  });
});
