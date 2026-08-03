import type { FastifyInstance } from "fastify";
import {
  loginInputSchema,
  refreshInputSchema,
  signupInputSchema,
} from "@connosr/shared-types";
import { env } from "../../config/env.js";
import { AuthError, getUserById, login, logout, refresh, signup } from "./service.js";

const REFRESH_COOKIE = "connosr_refresh_token";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/signup", async (request, reply) => {
    const input = signupInputSchema.parse(request.body);
    try {
      const { user, tokens } = await signup(input);
      reply.setCookie(REFRESH_COOKIE, tokens.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/v1/auth",
        maxAge: env.JWT_REFRESH_TTL_DAYS * 24 * 60 * 60,
      });
      return reply.code(201).send({ user, tokens });
    } catch (error) {
      if (error instanceof AuthError) return reply.code(error.statusCode).send({ message: error.message });
      throw error;
    }
  });

  fastify.post("/login", async (request, reply) => {
    const input = loginInputSchema.parse(request.body);
    try {
      const { user, tokens } = await login(input);
      reply.setCookie(REFRESH_COOKIE, tokens.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/v1/auth",
        maxAge: env.JWT_REFRESH_TTL_DAYS * 24 * 60 * 60,
      });
      return reply.send({ user, tokens });
    } catch (error) {
      if (error instanceof AuthError) return reply.code(error.statusCode).send({ message: error.message });
      throw error;
    }
  });

  fastify.post("/refresh", async (request, reply) => {
    const input = refreshInputSchema.parse(request.body ?? {});
    const refreshToken = input.refreshToken ?? request.cookies[REFRESH_COOKIE];
    if (!refreshToken) {
      return reply.code(401).send({ message: "Missing refresh token" });
    }
    try {
      const tokens = await refresh(refreshToken);
      reply.setCookie(REFRESH_COOKIE, tokens.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/v1/auth",
        maxAge: env.JWT_REFRESH_TTL_DAYS * 24 * 60 * 60,
      });
      return reply.send(tokens);
    } catch (error) {
      if (error instanceof AuthError) return reply.code(error.statusCode).send({ message: error.message });
      throw error;
    }
  });

  fastify.post("/logout", async (request, reply) => {
    const refreshToken = request.cookies[REFRESH_COOKIE];
    if (refreshToken) await logout(refreshToken);
    reply.clearCookie(REFRESH_COOKIE, { path: "/api/v1/auth" });
    return reply.code(204).send();
  });

  fastify.get("/me", { preHandler: fastify.authenticate }, async (request, reply) => {
    const user = await getUserById(request.userId);
    if (!user) return reply.code(404).send({ message: "User not found" });
    return reply.send(user);
  });
}
