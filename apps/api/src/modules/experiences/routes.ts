import type { FastifyInstance } from "fastify";
import {
  createExperienceInputSchema,
  searchExperiencesQuerySchema,
  updateExperienceInputSchema,
} from "@connosr/shared-types";
import {
  archiveExperience,
  createExperience,
  getExperience,
  searchExperiences,
  updateExperience,
} from "./service.js";

export default async function experienceRoutes(fastify: FastifyInstance) {
  fastify.get("/", async (request, reply) => {
    const query = searchExperiencesQuerySchema.parse(request.query);
    return reply.send(await searchExperiences(query));
  });

  fastify.post("/", { preHandler: fastify.authenticate }, async (request, reply) => {
    const input = createExperienceInputSchema.parse(request.body);
    const experience = await createExperience(request.userId, input);
    return reply.code(201).send(experience);
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const experience = await getExperience(request.params.id);
    if (!experience) return reply.code(404).send({ message: "Experience not found" });
    return reply.send(experience);
  });

  fastify.patch<{ Params: { id: string } }>(
    "/:id",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const input = updateExperienceInputSchema.parse(request.body);
      const experience = await updateExperience(request.params.id, input);
      if (!experience) return reply.code(404).send({ message: "Experience not found" });
      return reply.send(experience);
    },
  );

  fastify.post<{ Params: { id: string } }>(
    "/:id/archive",
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const experience = await archiveExperience(request.params.id);
      if (!experience) return reply.code(404).send({ message: "Experience not found" });
      return reply.send(experience);
    },
  );
}
