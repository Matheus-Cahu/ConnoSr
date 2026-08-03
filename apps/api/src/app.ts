import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import { env } from "./config/env.js";
import authenticatePlugin from "./plugins/authenticate.js";
import authRoutes from "./modules/auth/routes.js";
import experienceRoutes from "./modules/experiences/routes.js";
import reviewRoutes from "./modules/reviews/routes.js";
import userRoutes from "./modules/users/routes.js";
import feedRoutes from "./modules/feed/routes.js";
import uploadRoutes from "./modules/uploads/routes.js";

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: {
      transport: env.NODE_ENV === "development" ? { target: "pino-pretty" } : undefined,
    },
  });

  app.register(cors, { origin: env.WEB_ORIGIN, credentials: true });
  app.register(cookie);
  app.register(authenticatePlugin);

  app.get("/api/v1/health", async () => ({ status: "ok" }));

  app.register(authRoutes, { prefix: "/api/v1/auth" });
  app.register(experienceRoutes, { prefix: "/api/v1/experiences" });
  app.register(reviewRoutes, { prefix: "/api/v1/reviews" });
  app.register(userRoutes, { prefix: "/api/v1/users" });
  app.register(feedRoutes, { prefix: "/api/v1/feed" });
  app.register(uploadRoutes, { prefix: "/api/v1/uploads" });

  return app;
}
